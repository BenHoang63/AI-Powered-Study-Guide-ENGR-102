// Pyodide Web Worker
// Runs Python code in a sandboxed WebAssembly environment off the main thread.
// Supports input() via a pre-supplied list of stdin values (one per line).

importScripts("https://cdn.jsdelivr.net/pyodide/v0.27.5/full/pyodide.js");

let pyodide = null;

async function loadPyodideInstance() {
    pyodide = await loadPyodide({
        indexURL: "https://cdn.jsdelivr.net/pyodide/v0.27.5/full/",
    });
}

// Start loading immediately when the worker spawns
const pyodideReady = loadPyodideInstance();

self.onmessage = async (event) => {
    const { id, code, stdinLines } = event.data;

    await pyodideReady;

    let stdout = "";
    let stderr = "";
    let exitCode = 0;

    // Redirect stdout / stderr to JS strings
    pyodide.setStdout({ batched: (text) => { stdout += text + "\n"; } });
    pyodide.setStderr({ batched: (text) => { stderr += text + "\n"; } });

    // Override input() with a mock that consumes pre-supplied stdin lines
    const inputLines = Array.isArray(stdinLines) ? [...stdinLines] : [];
    pyodide.globals.set("_stdin_lines", pyodide.toPy(inputLines));

    const inputOverride = `
import builtins as _builtins
_input_index = [0]

def _mock_input(prompt=""):
    if prompt:
        print(prompt, end="")
    global _stdin_lines, _input_index
    lines = list(_stdin_lines)
    idx = _input_index[0]
    if idx < len(lines):
        val = str(lines[idx])
        _input_index[0] += 1
        print(val)
        return val
    raise EOFError("No more input values. Add more lines to the Stdin box.")

_builtins.input = _mock_input
`;

    try {
        await pyodide.runPythonAsync(inputOverride);
        await pyodide.runPythonAsync(code);
    } catch (err) {
        let msg = err.message || String(err);
        if (msg.includes("EOFError")) {
            msg = "EOFError: EOF when reading a line.\nYour code called input(), but there were not enough input values provided in the Stdin box.";
        }
        stderr += msg;
        exitCode = 1;
    }

    self.postMessage({ id, stdout: stdout.trimEnd(), stderr: stderr.trimEnd(), exitCode });
};
