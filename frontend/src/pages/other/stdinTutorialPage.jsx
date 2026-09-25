import { useNavigate, Link } from 'react-router-dom';
import { Terminal, ArrowLeft, AlertTriangle, CheckCircle2, CornerDownLeft, Code2 } from 'lucide-react';

const EXAMPLES = [
    {
        title: "Single input() prompt",
        description: 'Your code calls input() once to ask for a name.',
        code: `name = input("What is your name? ")\nprint("Hello,", name)`,
        stdin: `Alice`,
        output: `What is your name? Alice\nHello, Alice`,
    },
    {
        title: "Multiple input() calls",
        description: 'Your code calls input() multiple times — add one value per line, in the exact order requested.',
        code: `name = input("Name: ")\nage  = int(input("Age: "))\nprint(f"{name} is {age} years old.")`,
        stdin: `Alice\n25`,
        output: `Name: Alice\nAge: 25\nAlice is 25 years old.`,
    },
    {
        title: "input() inside a loop",
        description: 'If input() is called repeatedly in a loop, list each value sequentially line by line.',
        code: `total = 0\nfor i in range(3):\n    total += int(input("Enter a number: "))\nprint("Sum:", total)`,
        stdin: `10\n20\n30`,
        output: `Enter a number: 10\nEnter a number: 20\nEnter a number: 30\nSum: 60`,
    },
];

const StdinTutorialPage = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-so-bg text-so-text-body pb-24">
            {/* Header / Breadcrumb */}
            <div className="border-b border-so-border bg-[#161616] py-8 px-4 sm:px-6">
                <div className="max-w-4xl mx-auto">
                    <div className="flex items-center gap-2 text-xs text-so-text-muted mb-3 font-mono">
                        <Link to="/home" className="hover:text-slate-900 dark:hover:text-white transition-colors">Home</Link>
                        <span>/</span>
                        <Link to="/engr102" className="hover:text-slate-900 dark:hover:text-white transition-colors">ENGR 102</Link>
                        <span>/</span>
                        <span className="text-white font-semibold">WebAssembly Python STDIN</span>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                                Standard Input (stdin) Guide
                            </h1>
                            <p className="text-xs sm:text-sm text-so-text-muted mt-1.5 max-w-xl leading-relaxed">
                                Basically, stdin is giving your program input values before it starts running.
                            </p>
                        </div>

                        <button
                            onClick={() => navigate('/engr102/topicquizzer')}
                            className="so-btn-outline text-xs shrink-0 self-start sm:self-auto"
                        >
                            <ArrowLeft className="w-3.5 h-3.5" />
                            <span>Back to Quizzer</span>
                        </button>
                    </div>
                </div>
            </div>

            <main className="max-w-4xl mx-auto px-4 sm:px-6 pt-8 space-y-8">
                
                {/* Rule Card */}
                <div className="so-card p-6 border-so-border">
                    <div className="flex items-start gap-3.5">
                        {/* <div className="w-8 h-8 rounded bg-so-surface border border-so-border flex items-center justify-center shrink-0 mt-0.5">
                            <CornerDownLeft className="w-4 h-4 text-white" />
                        </div> */}
                        <div>
                            <h2 className="text-sm font-bold text-white mb-1">
                                Core Rule for Browser STDIN
                            </h2>
                            <p className="text-xs text-so-text-body leading-relaxed">
                                Supply <strong>one value per line</strong> in the exact order that <code className="bg-slate-100 dark:bg-[#0f0f0f] border border-slate-200 dark:border-[#2d2d2d] px-1.5 py-0.5 rounded text-slate-800 dark:text-white font-mono text-xs">input()</code> is evaluated.
                                Each <code className="bg-slate-100 dark:bg-[#0f0f0f] border border-slate-200 dark:border-[#2d2d2d] px-1.5 py-0.5 rounded text-slate-800 dark:text-white font-mono text-xs">input()</code> call uses the next line from the stdin.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Interactive Examples */}
                <div>
                    <h2 className="text-xs font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2 border-b border-so-border pb-2">
                        <Terminal className="w-4 h-4 text-white" />
                        <span>Execution Trace Examples</span>
                    </h2>

                    <div className="space-y-6">
                        {EXAMPLES.map((ex, i) => (
                            <div key={i} className="so-card p-5 border-so-border">
                                <h3 className="text-sm font-bold text-white mb-1">
                                    Example {i + 1}: {ex.title}
                                </h3>
                                <p className="text-xs text-so-text-muted mb-4">
                                    {ex.description}
                                </p>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    {/* Code Block */}
                                    <div className="md:col-span-2 space-y-1.5">
                                        <div className="text-[11px] font-mono uppercase text-so-text-muted">
                                            Python Source
                                        </div>
                                        <div className="bg-slate-50 dark:bg-[#0c0c0c] border border-slate-200 dark:border-so-border rounded-md p-3.5 font-mono text-xs text-slate-800 dark:text-[#e2e8f0] overflow-x-auto">
                                            <pre>{ex.code}</pre>
                                        </div>
                                    </div>

                                    {/* Stdin Box */}
                                    <div className="space-y-1.5">
                                        <div className="text-[11px] font-mono uppercase text-so-text-muted">
                                            Stdin Values
                                        </div>
                                        <div className="bg-emerald-50/70 dark:bg-[#121212] border border-emerald-200 dark:border-so-border rounded-md p-3 font-mono text-xs text-emerald-800 dark:text-emerald-400 min-h-[78px] flex items-center">
                                            <pre>{ex.stdin}</pre>
                                        </div>
                                    </div>
                                </div>

                                {/* Simulated Output */}
                                <div className="mt-4 pt-3 border-t border-so-border/50">
                                    <div className="text-[11px] font-mono uppercase text-so-text-muted mb-1.5">
                                        Terminal Output
                                    </div>
                                    <div className="bg-slate-50 dark:bg-[#0a0a0a] border border-slate-200 dark:border-neutral-800 rounded p-3 font-mono text-xs text-slate-800 dark:text-neutral-300">
                                        <pre>{ex.output}</pre>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Common Pitfalls Card */}
                <div className="so-card p-6 border-so-border">
                    <h2 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                        {/* <AlertTriangle className="w-4 h-4 text-amber-400" /> */}
                        <span>Common Stdin Mistakes to Avoid</span>
                    </h2>

                    <ul className="space-y-2.5 text-xs text-so-text-body">
                        <li className="flex items-start gap-2">
                            <span className="text-400 font-bold">•</span>
                            <div>
                                <strong className="text-white">Leaving Stdin empty:</strong> If your code calls <code className="bg-slate-100 dark:bg-so-surface border border-slate-200 dark:border-so-border px-1.5 py-0.5 rounded text-slate-800 dark:text-white font-mono text-xs">input()</code> but Stdin is blank, Python raises an <code className="bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 px-1.5 py-0.5 rounded text-rose-700 dark:text-rose-400 font-mono text-xs">EOFError: EOF when reading a line</code>.
                            </div>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-400 font-bold">•</span>
                            <div>
                                <strong className="text-white">Providing too few lines:</strong> If you have 3 prompts but only provide 2 lines, the 3rd prompt crashes with an <code className="bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 px-1.5 py-0.5 rounded text-rose-700 dark:text-rose-400 font-mono text-xs">EOFError</code>.
                            </div>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-400 font-bold">•</span>
                            <div>
                                <strong className="text-white">Forgetting type conversion:</strong> Stdin values are always read as strings. Remember to wrap them in <code className="bg-slate-100 dark:bg-so-surface border border-slate-200 dark:border-so-border px-1.5 py-0.5 rounded text-slate-800 dark:text-white font-mono text-xs">int()</code> or <code className="bg-slate-100 dark:bg-so-surface border border-slate-200 dark:border-so-border px-1.5 py-0.5 rounded text-slate-800 dark:text-white font-mono text-xs">float()</code> if you need numbers.
                            </div>
                        </li>
                    </ul>
                </div>

            </main>
        </div>
    );
};

export default StdinTutorialPage;
