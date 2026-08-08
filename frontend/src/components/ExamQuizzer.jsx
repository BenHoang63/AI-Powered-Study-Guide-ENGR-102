import { useState, useEffect, useRef } from 'react';
import '../styles/topic_quizzer.css';
import '../styles/exam_quizzer.css';

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

    const lineNumbersRef        = useRef(null);
    const textareaRef           = useRef(null);
    const [lineCount, setLineCount] = useState(1);
    const nextQuestionPromiseRef    = useRef(null);

    useEffect(() => {
        if (currentQuestion) {
            sessionStorage.setItem(`${storageKey}_question`, JSON.stringify(currentQuestion));
        }
    }, [currentQuestion]);

    useEffect(() => {
        sessionStorage.setItem(`${storageKey}_started`, quizStarted);
    }, [quizStarted]);

    useEffect(() => {
        if (quizStarted && currentQuestion) {
            setTimeout(() => cw_setup(), 50);
        }
    }, []);

    const updateLineCount = (val) => {
        setLineCount(Math.max(1, (val || '').split('\n').length));
    };

    const handleCwScroll = () => {
        if (lineNumbersRef.current && textareaRef.current) {
            lineNumbersRef.current.scrollTop = textareaRef.current.scrollTop;
        }
    };

    const fetchQuestionData = async () => {
        const ch = chapters[Math.floor(Math.random() * chapters.length)];
        let tp = 1;
        try {
            const res = await fetch(`/api/engr102/${ch}/num_topics`);
            if (!res.ok) throw new Error();
            const data = await res.json();
            tp = Math.ceil(Math.random() * data.topicCount) || 1;
        } catch (err) {
            console.error('[ExamQuizzer] Could not get topic count:', err);
            return null;
        }
        try {
            const res2 = await fetch('/api/engr102/quiz/question', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ chapter: ch, topic: tp, type: 'code_writing' }),
            });
            if (!res2.ok) throw new Error();
            const data2 = await res2.json();
            console.log('[ExamQuizzer] Fetched:', data2.topic_name);
            return [ch, tp, data2.topic_name, data2.llm_response, null];
        } catch (err) {
            console.error('[ExamQuizzer] Could not fetch question:', err);
            return null;
        }
    };

    const prefetchNextQuestion = () => {
        setPrefetchLoading(true);
        const promise = fetchQuestionData();
        nextQuestionPromiseRef.current = promise;
        promise
            .then(() => {
                setPrefetchLoading(false);
                const btn = document.getElementById('eq-next');
                if (btn) btn.hidden = false;
            })
            .catch(() => setPrefetchLoading(false));
    };

    const getQuestion = async () => {
        let qData = null;
        if (nextQuestionPromiseRef.current) {
            const p = nextQuestionPromiseRef.current;
            nextQuestionPromiseRef.current = null;
            qData = await p;
        }
        if (!qData) {
            setLoading(true);
            qData = await fetchQuestionData();
            setLoading(false);
        }
        if (qData) setCurrentQuestion(qData);
        return qData;
    };

    const cw_setup = () => {
        setLineCount(1);
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
        try {
            const res = await fetch('/api/engr102/quiz/check_answer', {
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
                prefetchNextQuestion();
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
                                    onKeyDown={handleCodeWritingKeyDown}
                                    onInput={(e) => updateLineCount(e.target.value)}
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

                </div>
            )}
        </div>
    );
};

export default ExamQuizzer;
