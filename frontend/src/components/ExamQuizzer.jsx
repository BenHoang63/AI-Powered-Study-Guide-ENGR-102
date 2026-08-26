import { useState, useEffect, useRef } from 'react';
import { useQuizFetch } from '../context/QuizFetchContext.jsx';
import '../styles/topic_quizzer.css';
import '../styles/exam_quizzer.css';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';

// ===================== MARKDOWN RENDERER ===================== //
const renderFormattedText = (text) => {
    if (!text || typeof text !== 'string') return text;

    const normalizedText = text
        .replace(/\\`/g, '`')
        .replace(/\\n/g, '\n')
        .replace(/[\u2018\u2019\u00b4\u02cb\u02cf]/g, '`');

    const blockParts = normalizedText.split(/```/g);

    return blockParts.map((blockChunk, blockIdx) => {
        if (blockIdx % 2 === 1) {
            let codeContent = blockChunk.replace(/^(python|py|js|javascript|bash|sh|c|cpp|java|html|css)\b[\s\n]*/i, '');
            codeContent = codeContent.replace(/^\n+|\n+$/g, '');
            return (
                <pre key={`block-${blockIdx}`} className="code block-code">
                    {codeContent}
                </pre>
            );
        }

        const inlineParts = blockChunk.split(/`/g);
        return (
            <span key={`text-${blockIdx}`}>
                {inlineParts.map((inlineChunk, inlineIdx) => {
                    if (inlineIdx % 2 === 1) {
                        return <code key={`inline-${inlineIdx}`} className="inline-code">{inlineChunk}</code>;
                    }
                    const boldParts = inlineChunk.split(/\*\*/g);
                    return boldParts.map((boldChunk, boldIdx) => {
                        if (boldIdx % 2 === 1) {
                            return <strong key={`bold-${boldIdx}`}>{boldChunk}</strong>;
                        }
                        return boldChunk.split('\n').map((line, lineIdx, arr) => (
                            <span key={`line-${lineIdx}`}>
                                {line}
                                {lineIdx < arr.length - 1 && <br />}
                            </span>
                        ));
                    });
                })}
            </span>
        );
    });
};

// ===================== EXAM QUIZZER COMPONENT ===================== //

const ExamQuizzer = ({ examName, chapters, pdfUrl, storageKey }) => {

    const [currentQuestion, setCurrentQuestion] = useState(() => {
        try { return JSON.parse(sessionStorage.getItem(`${storageKey}_question`)) || null; }
        catch { return null; }
    });
    const [quizStarted, setQuizStarted] = useState(() => {
        return sessionStorage.getItem(`${storageKey}_started`) === 'true';
    });
    const [loading, setLoading]                 = useState(false);
    const [prefetchLoading, setPrefetchLoading] = useState(false);
    const [explanationText, setExplanationText] = useState('');
    const [pdfOpen, setPdfOpen]                 = useState(false);
    const [checkingCode, setCheckingCode]       = useState(false);

    const lineNumbersRef        = useRef(null);
    const textareaRef           = useRef(null);
    const [lineCount, setLineCount] = useState(1);
    const nextQuestionPromiseRef = useRef(null);

    const { fetchQuestionData, prefetch, consumePrefetch } = useQuizFetch();

    const getFetchConfig = () => ({
        chapters,
        types: ['code_writing'],
        extraSlots: 5,
    });

    useEffect(() => {
        if (currentQuestion) {
            sessionStorage.setItem(`${storageKey}_question`, JSON.stringify(currentQuestion));
        }
    }, [currentQuestion]);

    useEffect(() => {
        sessionStorage.setItem(`${storageKey}_started`, quizStarted);
    }, [quizStarted]);

    useEffect(() => {
        if (quizStarted && (!currentQuestion || !currentQuestion[3]?.question)) {
            getQuestion().then(() => cw_setup());
        } else if (quizStarted && currentQuestion) {
            setTimeout(() => cw_setup(), 50);
        }
    }, []);

    // Pre-fetch the next question as soon as the current question is displayed
    useEffect(() => {
        if (quizStarted && currentQuestion?.[3]?.question) {
            prefetchNextQuestion();
        }
    }, [quizStarted, currentQuestion?.[3]?.question]);

    const updateLineCount = (val) => {
        setLineCount(Math.max(1, (val || '').split('\n').length));
    };

    const handleCwScroll = () => {
        if (lineNumbersRef.current && textareaRef.current) {
            lineNumbersRef.current.scrollTop = textareaRef.current.scrollTop;
        }
    };

    const prefetchNextQuestion = () => {
        setPrefetchLoading(true);
        prefetch('examQuizzer', getFetchConfig());
    };

    const getQuestion = async () => {
        let qData = null;

        // Try to consume the prefetched question from the global context
        qData = await consumePrefetch('examQuizzer');

        // If no pre-fetched data available, fetch now
        if (!qData) {
            setLoading(true);
            qData = await fetchQuestionData(getFetchConfig());
            setLoading(false);
        }

        setPrefetchLoading(false);
        if (qData) setCurrentQuestion(qData);
        return qData;
    };

    const cw_setup = (qData = currentQuestion) => {
        const savedCode = qData?.[4] || '';
        const cw = document.getElementById('cw_answer');
        if (cw) {
            cw.value = savedCode;
            updateLineCount(savedCode);
        }
        setExplanationText('');
        const exp = document.getElementById('eq-explanation');
        if (exp) exp.hidden = true;
        const sub = document.getElementById('eq-submit');
        if (sub) { sub.hidden = false; sub.disabled = false; }
        const nxt = document.getElementById('eq-next');
        if (nxt) nxt.hidden = true;
    };

    const handleCodeWritingKeyDown = (e) => {
        if (e.key !== 'Tab') return;
        e.preventDefault();
        const { selectionStart, selectionEnd, value } = e.target;
        const indent = '    ';

        if (e.shiftKey) {
            const lineStart  = value.lastIndexOf('\n', selectionStart - 1) + 1;
            const lineEnd    = value.indexOf('\n', selectionEnd);
            const end        = lineEnd === -1 ? value.length : lineEnd;
            const block      = value.substring(lineStart, end);
            const unindented = block.split('\n').map(l =>
                l.startsWith(indent) ? l.slice(indent.length) : l.replace(/^ {1,4}/, '')
            ).join('\n');
            const diff = block.length - unindented.length;
            e.target.value = value.substring(0, lineStart) + unindented + value.substring(end);
            e.target.selectionStart = Math.max(lineStart, selectionStart - (block.startsWith(indent) ? indent.length : (diff > 0 ? 1 : 0)));
            e.target.selectionEnd   = Math.max(lineStart, selectionEnd - diff);
        } else {
            if (selectionStart !== selectionEnd && value.substring(selectionStart, selectionEnd).includes('\n')) {
                const lineStart = value.lastIndexOf('\n', selectionStart - 1) + 1;
                const lineEnd   = value.indexOf('\n', selectionEnd);
                const end       = lineEnd === -1 ? value.length : lineEnd;
                const block     = value.substring(lineStart, end);
                const indented  = block.split('\n').map(l => indent + l).join('\n');
                e.target.value = value.substring(0, lineStart) + indented + value.substring(end);
                e.target.selectionStart = selectionStart + indent.length;
                e.target.selectionEnd   = selectionEnd + (indented.length - block.length);
            } else {
                const nv = value.substring(0, selectionStart) + indent + value.substring(selectionEnd);
                e.target.value = nv;
                e.target.selectionStart = e.target.selectionEnd = selectionStart + indent.length;
            }
        }
        updateLineCount(e.target.value);
    };

    const cw_check = async () => {
        const user_answer = document.getElementById('cw_answer')?.value;
        if (!user_answer?.trim()) {
            setExplanationText('Please enter an answer.');
            document.getElementById('eq-explanation').hidden = false;
            return;
        }
        setExplanationText('Evaluating your code...');
        document.getElementById('eq-explanation').hidden = false;
        setCheckingCode(true);

        try {
            const res = await fetch(`${BACKEND_URL}/api/engr102/quiz/check_answer`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ question: currentQuestion[3].question, user_answer }),
            });
            if (!res.ok) throw new Error();
            const data = await res.json();
            if (data.is_correct) {
                setExplanationText(`Correct! ${data.explanation || ''}`);
                document.getElementById('eq-explanation').hidden = false;
                document.getElementById('eq-submit').hidden = true;
                const nxt = document.getElementById('eq-next');
                if (nxt) nxt.hidden = false;
            } else {
                setExplanationText(`Incorrect. ${data.explanation || 'Try again.'}`);
                document.getElementById('eq-explanation').hidden = false;
            }
        } catch (err) {
            console.error('[ExamQuizzer] check_answer error:', err);
            setExplanationText('Error evaluating answer. Please try again.');
            document.getElementById('eq-explanation').hidden = false;
        }
    };

    const startQuiz = async () => {
        setQuizStarted(true);
        await getQuestion();
        cw_setup();
        setTimeout(() => {
            const cw = document.getElementById('cw_answer');
            if (cw) cw.value = '';
        }, 0);
    };

    const resetQuiz = () => {
        setQuizStarted(false);
        setCurrentQuestion(null);
        setExplanationText('');
        sessionStorage.removeItem(`${storageKey}_question`);
        sessionStorage.setItem(`${storageKey}_started`, 'false');
        nextQuestionPromiseRef.current = null;
    };

    const chapterRange = chapters.length === 12
        ? 'all chapters (1–12)'
        : `Chapters ${chapters[0]}–${chapters[chapters.length - 1]}`;

    return (
        <div className="eq-root">

            <header className="eq-header">
                <h1>{examName} Practice</h1>
                <p className="eq-subtitle">Code-writing questions drawn from {chapterRange}</p>
            </header>

            {/* PDF Review Sheet */}
            <div className="eq-pdf-bar">
                <button className="eq-pdf-toggle-btn" onClick={() => setPdfOpen(o => !o)}>
                    {pdfOpen ? '▲ Hide Review Sheet' : '▼ View Review Sheet'}
                </button>
                {pdfOpen && (
                    <div className="eq-pdf-container">
                        <iframe
                            src={pdfUrl}
                            title={`${examName} Review Sheet`}
                            className="eq-pdf-iframe"
                        />
                    </div>
                )}
            </div>

            {/* Pre-quiz start screen */}
            {!quizStarted && (
                <div className="eq-start-screen">
                    <p className="eq-start-desc">
                        Practice writing Python code for {examName}. Questions are randomly drawn from the covered chapters and evaluated by AI.<br></br>
                        Note: there will be multiple choice, short answer, and multiple-answer questions on the exam, but use the topic quizzer to review your topics.
                    </p>
                    <button className="quiz-start-btn" onClick={startQuiz} disabled={loading}>
                        {loading ? 'Loading...' : 'Start Practice'}
                    </button>
                </div>
            )}

            {/* Quiz panel */}
            {quizStarted && (
                <div className="eq-quiz-panel">

                    <div className="eq-quiz-topbar">
                        <button className="toggle-all-btn" onClick={resetQuiz}>
                            ← Back to Start
                        </button>
                        {currentQuestion && (
                            <span className="eq-topic-label">
                                <h2>
                                    <span className="definition">
                                        Topic {currentQuestion[0]}.{currentQuestion[1]}
                                    </span>
                                    &nbsp;{currentQuestion[2]}
                                </h2>
                            </span>
                        )}
                    </div>

                    <div className="eq-question-box">
                        {loading ? (
                            <p className="eq-loading">Loading question...</p>
                        ) : currentQuestion ? (
                            <>
                                <strong>Code Writing: </strong>
                                {renderFormattedText(currentQuestion[3]?.question)}
                            </>
                        ) : (
                            <p className="eq-loading">Fetching question…</p>
                        )}
                    </div>

                    {currentQuestion && (
                        <div className="block" id="code-writing">
                            <div className="cw_wrapper">
                                <div className="cw_line_numbers" ref={lineNumbersRef}>
                                    {Array.from({ length: lineCount }, (_, i) => (
                                        <div key={i + 1}>{i + 1}</div>
                                    ))}
                                </div>
                                <textarea
                                    id="cw_answer"
                                    className="cw_box"
                                    ref={textareaRef}
                                    value={currentQuestion?.[4] || ''}
                                    onKeyDown={handleCodeWritingKeyDown}
                                    onChange={(e) => {
                                        const val = e.target.value;
                                        updateLineCount(val);
                                        setCurrentQuestion(prev => [prev[0], prev[1], prev[2], prev[3], val]);
                                    }}
                                    onScroll={handleCwScroll}
                                />
                            </div>
                        </div>
                    )}

                    <p id="eq-explanation" hidden={true} className="eq-explanation">
                        {renderFormattedText(explanationText)}
                    </p>

                    {currentQuestion && (
                        <div className="eq-btn-row">
                            <button
                                id="eq-submit"
                                className="quiz-start-btn"
                                disabled={loading}
                                onClick={cw_check}
                            >
                                Submit
                            </button>

                            <button
                                id="eq-next"
                                className="quiz-start-btn"
                                hidden={true}
                                disabled={loading}
                                onClick={async () => {
                                    setCurrentQuestion(null);
                                    document.getElementById('eq-next').hidden = true;
                                    document.getElementById('eq-submit').hidden = false;
                                    document.getElementById('eq-explanation').hidden = true;
                                    await getQuestion();
                                    cw_setup();
                                    setTimeout(() => {
                                        const cw = document.getElementById('cw_answer');
                                        if (cw) cw.value = '';
                                    }, 0);
                                }}
                            >
                                Next Question
                            </button>
                        </div>
                    )}

                    {prefetchLoading && (
                        <p className="eq-loading">Loading next question...</p>
                    )}

                    <p style={{ color: "#888", fontSize: "0.8rem", marginTop: "30px", textAlign: "center", fontStyle: "italic" }}>
                        AI can make mistakes. Double-check important facts and concepts.
                    </p>

                </div>
            )}
        </div>
    );
};

export default ExamQuizzer;
