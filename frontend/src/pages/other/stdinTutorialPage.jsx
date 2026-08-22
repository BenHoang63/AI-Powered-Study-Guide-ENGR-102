import { useNavigate } from 'react-router-dom';
import '../../styles/styles.css';
import '../../styles/topic_quizzer.css';

const EXAMPLES = [
    {
        title: "One input()",
        description: 'Your code calls input() once to ask for a name.',
        code: `name = input("What is your name? ")\nprint("Hello,", name)`,
        stdin: `Alice`,
        output: `What is your name? Alice\nHello, Alice`,
    },
    {
        title: "Multiple input() calls",
        description: 'Your code calls input() multiple times — add one value per line, in the order they are asked.',
        code: `name = input("Name: ")\nage  = int(input("Age: "))\nprint(f"{name} is {age} years old.")`,
        stdin: `Alice\n25`,
        output: `Name: Alice\nAge: 25\nAlice is 25 years old.`,
    },
    {
        title: "input() inside a loop",
        description: 'If input() is called inside a loop, you still just list every value top-to-bottom.',
        code: `total = 0\nfor i in range(3):\n    total += int(input("Enter a number: "))\nprint("Sum:", total)`,
        stdin: `10\n20\n30`,
        output: `Enter a number: 10\nEnter a number: 20\nEnter a number: 30\nSum: 60`,
    },
];

const StdinTutorialPage = () => {
    const navigate = useNavigate();

    return (
        <>
            <header style={{ textAlign: 'center', margin: 'auto', padding: '32px 16px 0' }}>
                <h1>How to Use the Stdin Box</h1>
                <p style={{ color: '#aaa', marginTop: '-8px', maxWidth: '600px', margin: '0 auto 24px' }}>
                    When your Python code uses <code>input()</code>, you need to tell the code runner
                    what values to supply — that's what the <strong>Stdin</strong> box is for.
                </p>
            </header>

            <section style={{ width: '60%', maxWidth: '720px', margin: '0 auto 80px' }}>

                {/* ── What is stdin ── */}
                <div style={{ marginBottom: '40px' }}>
                    <h2>What is Stdin?</h2>
                    <p>
                        In a normal Python program you'd type your answers at the keyboard when{' '}
                        <code>input()</code> pauses the program. Since this quiz runs Python in your
                        browser there is no keyboard prompt, so you <strong>pre-supply the values</strong>{' '}
                        in the Stdin box before clicking <strong>▶ Run Code</strong>.
                    </p>
                    <p>
                        Think of it like writing your answers on a piece of paper ahead of time and
                        handing it to the program.
                    </p>
                </div>

                {/* ── The rule ── */}
                <div style={{ marginBottom: '40px' }}>
                    <h2>The Rule</h2>
                    <strong>One value per line, in the order input() will ask for them.</strong>
                    <p style={{ marginTop: '12px' }}>
                        Every time <code>input()</code> is called, it reads the <em>next</em> line
                        from the Stdin box. If you have three <code>input()</code> calls, you need
                        three lines in the box.
                    </p>
                </div>

                {/* ── Examples ── */}
                <h2 style={{ marginBottom: '16px' }}>Examples</h2>

                {EXAMPLES.map((ex, i) => (
                    <div key={i} style={{
                        border: '2px solid #444',
                        marginBottom: '28px',
                        padding: '20px 24px',
                        background: 'rgba(255,255,255,0.02)',
                    }}>
                        <h3 style={{ marginTop: 0 }}>{ex.title}</h3>
                        <p style={{ color: '#aaa', marginTop: '-8px' }}>{ex.description}</p>

                        <div style={{ display: 'grid', gridTemplateColumns: '2.5fr 1fr', gap: '16px' }}>
                            {/* Code */}
                            <div>
                                <div style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#888', marginBottom: '6px', fontFamily: 'monospace' }}>
                                    Code
                                </div>
                                <pre className='code' style={{ margin: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-word', fontSize: '0.9rem' }}>
                                    {ex.code}
                                </pre>
                            </div>

                            {/* Stdin */}
                            <div>
                                <div style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#888', marginBottom: '6px', fontFamily: 'monospace' }}>
                                    Stdin box
                                </div>
                                <div className='cw_stdin_wrapper' style={{ margin: 0 }}>
                                    <span className='cw_stdin_label'>Stdin</span>
                                    <pre className='cw_stdin_box' style={{ margin: 0, padding: '4px 14px 10px', height: 'auto', minHeight: '60px', resize: 'none' }}>
                                        {ex.stdin}
                                    </pre>
                                </div>
                            </div>
                        </div>

                        {/* Output */}
                        <div style={{ marginTop: '14px' }}>
                            <div style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#888', marginBottom: '6px', fontFamily: 'monospace' }}>
                                Output
                            </div>
                            <div className='cw_output' style={{ margin: 0, padding: '12px 16px' }}>
                                <pre className='cw_output_stdout'>{ex.output}</pre>
                            </div>
                        </div>
                    </div>
                ))}

                {/* ── Common mistakes ── */}
                <div style={{ marginBottom: '40px' }}>
                    <h2>Common Mistakes</h2>
                    <ul style={{ lineHeight: '2' }}>
                        <li>
                            <strong>Leaving the Stdin box empty</strong> when your code calls{' '}
                            <code>input()</code> — you'll get an{' '}
                            <span style={{ color: '#ff6b6b', fontFamily: 'monospace' }}>EOFError</span>.
                        </li>
                        <li>
                            <strong>Providing too few lines</strong> — if you have 3{' '}
                            <code>input()</code> calls but only 2 lines, the third call will raise an{' '}
                            <span style={{ color: '#ff6b6b', fontFamily: 'monospace' }}>EOFError</span>.
                        </li>
                        <li>
                            <strong>Adding extra blank lines</strong> — blank lines are ignored, so
                            only type the actual values.
                        </li>
                        <li>
                            <strong>Forgetting type conversion</strong> — the Stdin box always provides
                            strings. If your code does <code>int(input(...))</code>, just write the
                            number in the box and the cast happens in code.
                        </li>
                    </ul>
                </div>


            </section>
        </>
    );
};

export default StdinTutorialPage;
