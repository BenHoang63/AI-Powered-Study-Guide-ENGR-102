import { authClient } from '../../scripts/auth';
import { isAuthorized, isDemoMode } from '../../scripts/demo';
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuizFetch } from '../../context/QuizFetchContext.jsx';
import '../../styles/styles.css';
import '../../styles/topic_quizzer.css';

const BACKEND_URL = (import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000').replace(/\/$/, '');

const TOPICS = [
    { id: 1, title: "Intro to Computing & Python" },
    { id: 2, title: "Variables & Expressions" },
    { id: 3, title: "Types & Strings" },
    { id: 4, title: "Boolean Expressions & Conditionals" },
    { id: 5, title: "Program Design & Testing" },
    { id: 6, title: "Loops" },
    { id: 7, title: "Lists" },
    { id: 8, title: "Top-Down Design & Dictionaries" },
    { id: 9, title: "User-Designed Functions & Mutable/Immutable Data Types" },
    { id: 10, title: "Exceptions & Errors" },
    { id: 11, title: "Files" },
    { id: 12, title: "Modules" },
];

const QUESTION_TYPE_LABELS = {
    multiple_choice: "Multiple Choice",
    short_answer: "Short Answer",
    code_writing: "Code Writing",
    multiple_answer: "Multiple Answer"
};

const renderFormattedText = (text) => {
    if (!text || typeof text !== 'string') return text;

    // Normalize escaped backticks (\`), escaped newlines (\\n), and unicode grave accents
    const normalizedText = text
        .replace(/\\`/g, '`')
        .replace(/\\n/g, '\n')
        .replace(/[\u2018\u2019\u00b4\u02cb\u02cf]/g, '`');

    // Split by code blocks (```code```)
    const blockParts = normalizedText.split(/```/g);

    return blockParts.map((blockChunk, blockIdx) => {
        if (blockIdx % 2 === 1) {
            // Code Block: strip language identifier (e.g. 'python', 'py') at start with or without newline
            let codeContent = blockChunk.replace(/^(python|py|js|javascript|bash|sh|c|cpp|java|html|css)\b[\s\n]*/i, '');
            codeContent = codeContent.replace(/^\n+|\n+$/g, '');

            return (
                <pre key={`block-${blockIdx}`} className="code block-code">
                    {codeContent}
                </pre>
            );
        }

        // Inline Code / Plain Text
        const inlineParts = blockChunk.split(/`/g);
        return (
            <span key={`text-${blockIdx}`}>
                {inlineParts.map((inlineChunk, inlineIdx) => {
                    if (inlineIdx % 2 === 1) {
                        return (
                            <code key={`inline-${inlineIdx}`} className="inline-code">
                                {inlineChunk}
                            </code>
                        );
                    }
                    // Handle **bold** markdown within plain text
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

const ENGR102TopicQuizzer = () => {

    const [user, setUser] = useState(null);
    const [error, setError] = useState(null);
    const [selectedTopics, setSelectedTopics] = useState(() => {
        try { return JSON.parse(sessionStorage.getItem('quizzer_selectedTopics')) || []; }
        catch { return []; }
    });
    const [selectedTypes, setSelectedTypes] = useState(() => {
        try {
            const saved = JSON.parse(sessionStorage.getItem('quizzer_selectedTypes'));
            return saved && saved.length > 0 ? saved : Object.keys(QUESTION_TYPE_LABELS);
        } catch { return Object.keys(QUESTION_TYPE_LABELS); }
    });
    const [quizMode, setQuizMode] = useState(() => {
        return sessionStorage.getItem('quizzer_quizMode') === 'true';
    });
    const [loading, setLoading] = useState(false);
    const [prefetchLoading, setPrefetchLoading] = useState(false);
    const [explanationText, setExplanationText] = useState(() => {
        return sessionStorage.getItem('quizzer_explanationText') || '';
    });
    const navigate = useNavigate();

    // [chapter, topic, topic name, question JSON, current answer, isAnsweredCorrectly, hasFailed, hasRecordedWrong]
    const [currentQuestion, setCurrentQuestion] = useState(() => {
        try { return JSON.parse(sessionStorage.getItem('quizzer_currentQuestion')) || [1,1,"topic",{},null,false,false,false]; }
        catch { return [1,1,"topic",{},null,false,false,false]; }
    });
    const [nextQuestion, setNextQuestion] = useState([1,1,"topic",{},null,false,false,false]); 

    // Code writing line numbers refs and state
    const lineNumbersRef = useRef(null);
    const textareaRef = useRef(null);
    const pyodideWorkerRef = useRef(null);
    const [lineCount, setLineCount] = useState(1);
    const [codeRunning, setCodeRunning] = useState(false);
    const [codeOutput, setCodeOutput] = useState(null);
    const [stdinValue, setStdinValue] = useState(() => {
        return sessionStorage.getItem('quizzer_stdinValue') || "";
    });

    useEffect(() => {
        sessionStorage.setItem('quizzer_stdinValue', stdinValue);
    }, [stdinValue]);
    const [pyodideReady, setPyodideReady] = useState(false);

    const updateLineCount = (val) => {
        const lines = (val || "").split('\n').length;
        setLineCount(Math.max(1, lines));
    };

    const handleCwScroll = () => {
        if (lineNumbersRef.current && textareaRef.current) {
            lineNumbersRef.current.scrollTop = textareaRef.current.scrollTop;
        }
    };

    useEffect(() => {
        authClient.getSession().then(({ data }) => {
            if (data?.user) {
                // Check if TAMU email
                if (isAuthorized(data.user.email)) {
                    setUser(data.user);
                    return;
                } else {
                    // Not a TAMU student — sign them out
                    console.log("Not a TAMU student:", data.user.email);
                    setError("Please sign in with your @tamu.edu email.");
                    authClient.signOut();
                }
            } else if (!isDemoMode()) {
                navigate('/');
            }
        });
    }, []);

    // ========================== RECORD PROGRESS ========================== //

    // Fire-and-forget: records a quiz attempt to the backend.
    // Skipped silently in demo mode so guest sessions don't pollute stats.
    const recordProgress = (attempts, correct) => {
        if (isDemoMode() || !user?.email) return;
        const [chapter, topic] = currentQuestion;
        fetch(`${BACKEND_URL}/api/stats/record`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: user.email,
                course: 'engr102',
                chapter,
                topic,
                attempts,
                correct
            })
        }).catch(err => console.error('[stats] Failed to record progress:', err));
    };

    const handleAnswerAttempt = (is_correct) => {
        const isAnsweredCorrectly = currentQuestion[5] || false;
        const hasFailed = currentQuestion[6] || false;
        const hasRecordedWrong = currentQuestion[7] || false;

        if (is_correct) {
            if (!isAnsweredCorrectly) {
                if (hasFailed) {
                    recordProgress(0, 1);
                } else {
                    recordProgress(1, 1);
                }
                setCurrentQuestion(prev => [
                    prev[0], prev[1], prev[2], prev[3], prev[4],
                    true,
                    prev[6] || false,
                    prev[7] || false
                ]);
            }
        } else {
            if (!hasRecordedWrong) {
                recordProgress(2, 0);
            }
            setCurrentQuestion(prev => [
                prev[0], prev[1], prev[2], prev[3], prev[4],
                false,
                true,
                true
            ]);
        }
    };

    // Persist selectedTopics, selectedTypes, quizMode, and currentQuestion to sessionStorage
    useEffect(() => {
        sessionStorage.setItem('quizzer_selectedTopics', JSON.stringify(selectedTopics));
    }, [selectedTopics]);

    useEffect(() => {
        sessionStorage.setItem('quizzer_selectedTypes', JSON.stringify(selectedTypes));
    }, [selectedTypes]);

    useEffect(() => {
        sessionStorage.setItem('quizzer_quizMode', quizMode);
    }, [quizMode]);

    useEffect(() => {
        sessionStorage.setItem('quizzer_currentQuestion', JSON.stringify(currentQuestion));
    }, [currentQuestion]);

    useEffect(() => {
        sessionStorage.setItem('quizzer_explanationText', explanationText);
    }, [explanationText]);

    // Pre-fetch the next question as soon as the current one is displayed
    // Guard: skip if getQuestion is still actively running (to avoid double-fetch on remount)
    const fetchInProgressRef = useRef(false);
    useEffect(() => {
        if (quizMode && currentQuestion[3]?.question && !fetchInProgressRef.current) {
            prefetchNextQuestion();
        }
    }, [currentQuestion[3]?.question]);
    useEffect(() => {
        let cancelled = false;
        const savedQuizMode = sessionStorage.getItem('quizzer_quizMode') === 'true';
        if (savedQuizMode) {
            const topic_select = document.getElementById('topic-select');
            const quiz = document.getElementById('quiz');
            const desc = document.getElementById('select-topics-desc');
            if (topic_select) topic_select.hidden = true;
            if (quiz) quiz.hidden = false;
            if (desc) desc.hidden = true;
            // Restore question UI state (explanation hidden, submit/next buttons)
            const savedQ = (() => {
                try { return JSON.parse(sessionStorage.getItem('quizzer_currentQuestion')); }
                catch { return null; }
            })();
            if (savedQ && savedQ[3] && savedQ[3].type) {
                if (savedQ[5] === true) {
                    // Question was already answered correctly — restore the post-answer UI.
                    const submitBtn = document.getElementById('submit');
                    const nextBtn   = document.getElementById('next-question');
                    const expEl     = document.getElementById('explanation');
                    if (submitBtn) submitBtn.hidden = true;
                    if (nextBtn)   nextBtn.hidden   = false;
                    if (expEl)     expEl.hidden     = false;
                } else {
                    start_question_setup(savedQ);
                }
            } else {
                // If savedQ is missing or was left in a blank/loading state ({}), fetch a new question!
                fetchInProgressRef.current = true;
                getQuestion().then((qData) => {
                    if (cancelled) return; // StrictMode or stale mount — discard
                    fetchInProgressRef.current = false;
                    if (qData) start_question_setup(qData);
                });
            }
        }
        return () => { cancelled = true; };
    }, []);


    // ========================== TOPIC SELECT ========================== //

    const toggleTopic = (topicId) => {
        setSelectedTopics((prev) =>
            prev.includes(topicId)
                ? prev.filter((id) => id !== topicId)
                : [...prev, topicId]
        );
    };

    const toggleAll = () => {
        if (selectedTopics.length === TOPICS.length) {
            setSelectedTopics([]);
        } else {
            setSelectedTopics(TOPICS.map((t) => t.id));
        }
    };

    const toggleType = (typeKey) => {
        setSelectedTypes((prev) =>
            prev.includes(typeKey)
                ? prev.filter((t) => t !== typeKey)
                : [...prev, typeKey]
        );
    };

    const toggleAllTypes = () => {
        const allTypeKeys = Object.keys(QUESTION_TYPE_LABELS);
        if (selectedTypes.length === allTypeKeys.length) {
            setSelectedTypes([]);
        } else {
            setSelectedTypes(allTypeKeys);
        }
    };

    const toggleUI = (clearQuestion = false) => {
        let topic_select = document.getElementById('topic-select');
        let quiz = document.getElementById('quiz');
        let desc = document.getElementById('select-topics-desc');
        topic_select.hidden = !topic_select.hidden;
        quiz.hidden = !quiz.hidden;
        desc.hidden = !desc.hidden;
        setQuizMode(!quizMode);
        if (clearQuestion) {
            // Clear saved question so a fresh one loads next time
            const blank = [1, 1, "topic", {}, null, false, false, false];
            setCurrentQuestion(blank);
            sessionStorage.removeItem('quizzer_currentQuestion');
            sessionStorage.setItem('quizzer_quizMode', 'false');
        }
    };


    // ========================== GET QUESTION ========================== //

    const { fetchQuestionData, prefetch, consumePrefetch } = useQuizFetch();

    const getFetchConfig = () => ({
        chapters: selectedTopics.length > 0 ? selectedTopics : [1],
        types: selectedTypes.length > 0 ? selectedTypes : Object.keys(QUESTION_TYPE_LABELS),
        extraSlots: 8,
    });

    const prefetchNextQuestion = () => {
        setPrefetchLoading(true);
        prefetch('topicQuizzer', getFetchConfig());
    };

    const getQuestion = async () => {
        let qData = null;

        // Try to consume the prefetched question from the global context
        qData = await consumePrefetch('topicQuizzer');

        // If no pre-fetched data available, fetch now
        if (!qData) {
            setLoading(true);
            qData = await fetchQuestionData(getFetchConfig());
            setLoading(false);
        }

        setPrefetchLoading(false);
        if (qData) {
            setCurrentQuestion(qData);
        }
        return qData;
    };

    const allSelected = selectedTopics.length === TOPICS.length;
    const allTypesSelected = selectedTypes.length === Object.keys(QUESTION_TYPE_LABELS).length;
    const moduleUrl = currentQuestion[0] ? `/engr102/module${currentQuestion[0]}` : null;

    // hide all question types
    const hide_all = () => {
        document.getElementById('multiple choice').hidden = true;
    };

    // start question setup
    const start_question_setup = (qData = currentQuestion) => {
        if (!qData || !qData[3]) return;
        const questionType = qData[3].type;
        // console.log('starting question setup...');
        if (questionType === 'multiple_choice') { mc_setup(qData); }
        else if (questionType === 'short_answer') { sa_setup(qData); }
        else if (questionType === 'code_writing') { sa_setup(qData); }
        else if (questionType === 'multiple_answer') { ma_setup(qData); }
    };

    // ========================== MULTIPLE CHOICE QUESTION ========================== //

/* 
    currentQuestion[3]
    {
        "type": "multiple_choice",
        "question": "the question text here",
        "options": {
            "A": "first option",
            "B": "second option",
            "C": "third option",
            "D": "fourth option"
        },
        "correct_answer": "A",
        "explanation": "brief explanation of why the answer is correct"
    }
*/
    const mc_setup = (qData = currentQuestion) => {
        // Reset choice option buttons (styles and disabled state)
        document.querySelectorAll('.mc_option').forEach(btn => {
            btn.style.backgroundColor = '';
            btn.disabled = false;
        });
        setExplanationText("");

        document.getElementById('explanation').hidden = true;
        document.getElementById('submit').hidden = false;
        const submitBtn = document.getElementById('submit');
        if (submitBtn) {
            submitBtn.disabled = true;
        }
        document.getElementById('next-question').hidden = true;

    };

    const mc_select = (choice) => {
        // set current question state with selected choice
        setCurrentQuestion(prev => [prev[0], prev[1], prev[2], prev[3], choice, prev[5], prev[6], prev[7]]);
        const submitBtn = document.getElementById('submit');
        if (submitBtn) {
            submitBtn.disabled = false;
        }
    };

    const mc_check = async () => {
        // check if current answer equals correct answer
        if (currentQuestion[4] === currentQuestion[3].correct_answer) {
            // UI
            document.getElementById(`mc${currentQuestion[4]}`).style.backgroundColor = '#98FB98';
            setExplanationText(`Correct! ${currentQuestion[3].explanation}`);
            document.getElementById('explanation').hidden = false;
            document.getElementById('submit').hidden = true;
            document.getElementById('next-question').hidden = false;
            handleAnswerAttempt(true);
        }
        else {
            // disable answer choice 
            document.getElementById(`mc${currentQuestion[4]}`).disabled = true;
            handleAnswerAttempt(false);
            setExplanationText("Incorrect. Try again.");
            document.getElementById('explanation').hidden = false;
        }
    };


    // ========================== SHORT ANSWER QUESTION ========================== //

/*
    currentQuestion[3]
    {
        "type": "short_answer",
        "question": "the question text here",
        "correct_answers": ["answer 1", "answer 2", ...],
        "explanation": "brief explanation of the correct answer"
    }
*/
    const sa_setup = (qData = currentQuestion) => { // can also be used for code writing
        const savedVal = qData?.[4] || "";
        const sa = document.getElementById('sa_answer');
        if (sa) sa.value = savedVal;
        const cw = document.getElementById('cw_answer');
        if (cw) {
            cw.value = savedVal;
            updateLineCount(savedVal);
        }
        setExplanationText("");
        setCodeOutput(null);
        setCodeRunning(false);

        document.getElementById('explanation').hidden = true;
        document.getElementById('submit').hidden = false;
        const submitBtn = document.getElementById('submit');
        if (submitBtn) {
            submitBtn.disabled = false;
        }
        document.getElementById('next-question').hidden = true;
    };

    const sa_check = () => {
        const userVal = document.getElementById('sa_answer')?.value?.trim()?.toLowerCase();
        if (!userVal) {
            setExplanationText("Please enter an answer.");
            document.getElementById('explanation').hidden = false;
            return;
        }
        const answers = currentQuestion[3]?.correct_answers || [];
        let isCorrect = false;

        for (let answer of answers) {
            if (answer.toString().trim().toLowerCase() === userVal) {
                isCorrect = true;
                break;
            }
        }

        if (isCorrect) {
            setExplanationText(`Correct! ${currentQuestion[3].explanation}`);
            document.getElementById('explanation').hidden = false;
            document.getElementById('submit').hidden = true;
            document.getElementById('next-question').hidden = false;
            handleAnswerAttempt(true);
        } else {
            setExplanationText("Incorrect. Try again.");
            document.getElementById('explanation').hidden = false;
            handleAnswerAttempt(false);
        }
    };


    // ========================== CODE RUNNING (Pyodide) ========================== //

    const runCode = async () => {
        const code = document.getElementById('cw_answer')?.value;
        if (!code || code.trim() === "") {
            setCodeOutput({ stdout: "", stderr: "Nothing to run.", exitCode: 0 });
            return;
        }

        setCodeRunning(true);
        setCodeOutput(null);

        // Lazily create the worker on first use
        if (!pyodideWorkerRef.current) {
            pyodideWorkerRef.current = new Worker('/pyodide.worker.js');
            // The worker starts loading Pyodide immediately on creation;
            // we'll know it's ready when it responds to our first message.
        }

        const worker = pyodideWorkerRef.current;
        const id = Date.now();
        const stdinLines = stdinValue.split("\n").filter(l => l !== "");

        const result = await new Promise((resolve) => {
            let timerId = null;

            const handler = (e) => {
                if (e.data.id === id) {
                    clearTimeout(timerId);
                    worker.removeEventListener('message', handler);
                    resolve(e.data);
                }
            };

            timerId = setTimeout(() => {
                worker.removeEventListener('message', handler);
                try { worker.terminate(); } catch (err) {}
                pyodideWorkerRef.current = null; // Re-create worker on next run
                resolve({
                    stdout: "",
                    stderr: "TimeLimitExceeded: Execution timed out after 5 seconds.\nCheck for infinite loops (e.g. while True) or missing input() lines in Stdin.",
                    exitCode: 124
                });
            }, 5000);

            worker.addEventListener('message', handler);
            worker.postMessage({ id, code, stdinLines });
        });

        setCodeOutput({
            stdout: result.stdout,
            stderr: result.stderr,
            exitCode: result.exitCode
        });
        setPyodideReady(true); // warm after first successful run
        setCodeRunning(false);
    };


    // ========================== CODE WRITING QUESTION ========================== //

/*
    currentQuestion[3]
    {
        "type": "code_writing",
        "question": "the question text here"
    }
*/
    const handleCodeWritingKeyDown = (e) => {
        if (e.key === 'Tab') {
            e.preventDefault();
            const { selectionStart, selectionEnd, value } = e.target;
            const indentStr = "    ";

            if (e.shiftKey) {
                // Shift + Tab: Unindent
                const lineStart = value.lastIndexOf('\n', selectionStart - 1) + 1;
                const lineEnd = value.indexOf('\n', selectionEnd);
                const actualLineEnd = lineEnd === -1 ? value.length : lineEnd;
                const block = value.substring(lineStart, actualLineEnd);

                const unindentedBlock = block.split('\n').map(line => {
                    if (line.startsWith(indentStr)) {
                        return line.substring(indentStr.length);
                    } else if (line.startsWith('\t')) {
                        return line.substring(1);
                    } else {
                        return line.replace(/^ {1,4}/, '');
                    }
                }).join('\n');

                const diff = block.length - unindentedBlock.length;
                e.target.value = value.substring(0, lineStart) + unindentedBlock + value.substring(actualLineEnd);

                e.target.selectionStart = Math.max(lineStart, selectionStart - (block.startsWith(indentStr) ? indentStr.length : (diff > 0 ? 1 : 0)));
                e.target.selectionEnd = Math.max(lineStart, selectionEnd - diff);
            } else {
                // Tab: Indent
                if (selectionStart !== selectionEnd && value.substring(selectionStart, selectionEnd).includes('\n')) {
                    // Multi-line selection indent
                    const lineStart = value.lastIndexOf('\n', selectionStart - 1) + 1;
                    const lineEnd = value.indexOf('\n', selectionEnd);
                    const actualLineEnd = lineEnd === -1 ? value.length : lineEnd;
                    const block = value.substring(lineStart, actualLineEnd);
                    const indentedBlock = block.split('\n').map(line => indentStr + line).join('\n');

                    e.target.value = value.substring(0, lineStart) + indentedBlock + value.substring(actualLineEnd);
                    e.target.selectionStart = selectionStart + indentStr.length;
                    e.target.selectionEnd = selectionEnd + (indentedBlock.length - block.length);
                } else {
                    // Cursor or single line insertion
                    const newValue = value.substring(0, selectionStart) + indentStr + value.substring(selectionEnd);
                    e.target.value = newValue;
                    e.target.selectionStart = e.target.selectionEnd = selectionStart + indentStr.length;
                }
            }
            updateLineCount(e.target.value);
        }
    };

    const cw_check = async () => {
        const user_answer = document.getElementById('cw_answer')?.value;
        if (!user_answer || user_answer.trim() === "") {
            setExplanationText("Please enter an answer.");
            document.getElementById('explanation').hidden = false;
            return;
        }

        setExplanationText("Evaluating your code...");
        document.getElementById('explanation').hidden = false;

        try {
            const response = await fetch(`${BACKEND_URL}/api/engr102/quiz/check_answer`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    question: currentQuestion[3].question,
                    user_answer: user_answer
                }),
            });
            if (!response.ok) throw new Error("Server error evaluating answer");
            const data = await response.json();

            const is_correct = data.is_correct;
            const explanation = data.explanation || "";

            if (is_correct) {
                setExplanationText(`Correct! ${explanation}`);
                document.getElementById('explanation').hidden = false;
                document.getElementById('submit').hidden = true;
                document.getElementById('next-question').hidden = false;
                handleAnswerAttempt(true);
            } else {
                setExplanationText(`Incorrect. ${explanation || "Try again."}`);
                document.getElementById('explanation').hidden = false;
                handleAnswerAttempt(false);
            }
        } catch (err) {
            console.error("[Error] ENGR102TopicQuizzer: could not retrieve answer for code writing", err);
            setExplanationText("Error evaluating answer. Please try again.");
            document.getElementById('explanation').hidden = false;
        }
    };

    
    // ========================== MULTIPLE ANSWER QUESTION ========================== //

/*
    currentQuestion[3]:
    {
        "type": "multiple_answer",
        "question": "the question text here",
        "options": {
            "A": "first option",
            "B": "second option",
            "C": "third option",
            "D": "fourth option",
            ...
        },
        "correct_answers": ["A", "C"],
        "explanation": "brief explanation of why the answer is correct"
    }
*/
    const ma_setup = () => {
        // Reset choice option buttons (styles and disabled state)
        document.querySelectorAll('.ma_option').forEach(btn => {
            btn.style.backgroundColor = '';
            btn.disabled = false;
        });
        setCurrentQuestion(prev => [prev[0], prev[1], prev[2], prev[3], [], prev[5], prev[6], prev[7]]);
        setExplanationText("");

        const exp = document.getElementById('explanation');
        if (exp) exp.hidden = true;

        const submitBtn = document.getElementById('submit');
        if (submitBtn) {
            submitBtn.hidden = false;
            submitBtn.disabled = true;
        }

        const nextBtn = document.getElementById('next-question');
        if (nextBtn) nextBtn.hidden = true;
    };

    const ma_select = (choice) => {
        // check if choice is already selected (then deselect)
        // set current question state with selected choice
        setCurrentQuestion(prev => {
            const currentSelected = Array.isArray(prev[4]) ? prev[4] : [];
            const nextSelected = currentSelected.includes(choice)
                ? currentSelected.filter(item => item !== choice)
                : [...currentSelected, choice];

            const submitBtn = document.getElementById('submit');
            if (submitBtn) {
                submitBtn.disabled = nextSelected.length === 0;
            }

            return [prev[0], prev[1], prev[2], prev[3], nextSelected, prev[5], prev[6], prev[7]];
        });
    };

    const ma_check = () => {
        // check if the answer is correct
        let is_correct = true;
        let currentSelected = Array.isArray(currentQuestion[4]) ? currentQuestion[4] : [];
        let correctAnswers = currentQuestion[3].correct_answers;

        if (currentSelected.length !== correctAnswers.length) {
            is_correct = false;
        } else {
            correctAnswers.forEach(choice => {
                if (!currentSelected.includes(choice)) {
                    is_correct = false;
                }
            });
        }

        if (is_correct) {
            setExplanationText(`Correct! ${currentQuestion[3].explanation}`);
            document.getElementById('explanation').hidden = false;
            document.getElementById('submit').hidden = true;
            document.getElementById('next-question').hidden = false;
            handleAnswerAttempt(true);
        } else {
            setExplanationText("Incorrect. Try again.");
            document.getElementById('explanation').hidden = false;
            handleAnswerAttempt(false);
        }
    };















    // ================== USER INTERFACE =================== //

    return (
        <>

            

            <header id="center" style={{ textAlign: "center", margin: "auto" }}>
                <h1>Topic Quizzer</h1>
                <p style={{ color: "#aaa", marginTop: "-8px" }} id='select-topics-desc'>
                    Select the topics you want to be quizzed on
                </p>
            </header>

            <section id="center">
                <div id="topic-select" style={{
                    width: "60%",
                    maxWidth: "700px",
                    margin: "20px auto",
                    marginBottom: "100px",
                    textAlign: "center",
                }}>
                    <button className="toggle-all-btn" onClick={toggleAll}>
                        {allSelected ? "Deselect All" : "Select All"}
                    </button>

                    <div style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        gap: "10px",
                    }}>
                        {TOPICS.map((topic) => {
                            const isSelected = selectedTopics.includes(topic.id);
                            return (
                                <button
                                    key={topic.id}
                                    className={`topic-card${isSelected ? " selected" : ""}`}
                                    onClick={() => toggleTopic(topic.id)}
                                >
                                    <span className="topic-number">Chapter {topic.id}</span>
                                    {topic.title}
                                </button>
                            );
                        })}
                    </div>

                    <div style={{ marginTop: "20px", color: "#aaa", fontSize: "0.9rem" }}>
                        {selectedTopics.length} of {TOPICS.length} topics selected
                    </div>

                    {/* Question Type Selection */}
                    <div style={{ marginTop: "32px", textAlign: "left" }}>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "10px" }}>
                            <h3 style={{ margin: 0, fontSize: "1rem", color: "#ccc" }}>Question Types</h3>
                            <button
                                className="toggle-all-btn"
                                style={{ padding: "4px 12px", fontSize: "0.8rem" }}
                                onClick={toggleAllTypes}
                            >
                                {allTypesSelected ? "Deselect All" : "Select All"}
                            </button>
                        </div>
                        <div style={{
                            display: "grid",
                            gridTemplateColumns: "1fr 1fr",
                            gap: "8px",
                        }}>
                            {Object.entries(QUESTION_TYPE_LABELS).map(([typeKey, typeLabel]) => {
                                const isTypeSelected = selectedTypes.includes(typeKey);
                                return (
                                    <button
                                        key={typeKey}
                                        className={`topic-card${isTypeSelected ? " selected" : ""}`}
                                        onClick={() => toggleType(typeKey)}
                                        style={{ padding: "10px 14px", fontSize: "0.9rem" }}
                                    >
                                        {typeLabel}
                                    </button>
                                );
                            })}
                        </div>
                        <div style={{ marginTop: "8px", color: selectedTypes.length === 0 ? "#e07070" : "#aaa", fontSize: "0.85rem" }}>
                            {selectedTypes.length === 0
                                ? "⚠ Select at least one question type"
                                : `${selectedTypes.length} of ${Object.keys(QUESTION_TYPE_LABELS).length} question types selected`
                            }
                        </div>
                    </div>

                    <button
                        className="quiz-start-btn"
                        disabled={selectedTopics.length === 0 || selectedTypes.length === 0}
                        onClick={ async () => {
                            toggleUI();
                            const qData = await getQuestion();
                            start_question_setup(qData);
                        }}
                    >
                        Start Quiz
                    </button>
                </div>



                <div id="quiz" style={{
                    width: "60%",
                    maxWidth: "700px",
                    margin: "20px auto",
                    marginBottom: "100px",
                    textAlign: "center",
                }} hidden={true}>
                    <button className='toggle-all-btn'
                        onClick={() => {
                            toggleUI(true);
                        }}>
                            Select Topics
                    </button>

                    <h2><span className='definition' id='topic-num'>Topic {currentQuestion[0]}.{currentQuestion[1]}</span> &nbsp;<span id='topic-title'>{currentQuestion[2]}</span></h2>
                    <div id='question' style={{ margin: "16px 0", fontSize: "1.1rem" }}>
                        {currentQuestion[3]?.question ? (
                            <>
                                <strong>{QUESTION_TYPE_LABELS[currentQuestion[3]?.type] || ""}: </strong>
                                {renderFormattedText(currentQuestion[3].question)}
                            </>
                        ) : (
                            "Loading question..."
                        )}
                    </div>

                    {/* Multiple Choice Options */}
                    {currentQuestion[3]?.type === 'multiple_choice' && currentQuestion[3]?.options && (
                        <div className='block' id='multiple choice'>
                            {Object.entries(currentQuestion[3].options).map(([key, value]) => (
                                <div key={key} style={{ margin: "8px 0" }}>
                                    <button
                                        id={`mc${key}`}
                                        className={`mc_option ${currentQuestion[4] === key ? 'selected' : ''}`}
                                        onClick={() => mc_select(key)}
                                    >
                                        {key}. {renderFormattedText(value)}
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Short Answer Input */}
                    {currentQuestion[3]?.type === 'short_answer' && (
                        <div className='block' id='short answer'>
                            <textarea
                                id='sa_answer'
                                className='sa_box'
                                placeholder='Your answer here'
                                value={currentQuestion[4] || ''}
                                onChange={(e) => {
                                    const val = e.target.value;
                                    setCurrentQuestion(prev => [prev[0], prev[1], prev[2], prev[3], val, prev[5], prev[6], prev[7]]);
                                }}
                            ></textarea>
                        </div>
                    )}

                    {/* Code Writing Input */}
                    {currentQuestion[3]?.type === 'code_writing' && (
                        <div className='block' id='code writing'>
                            <div className='cw_wrapper'>
                                <div className='cw_line_numbers' ref={lineNumbersRef}>
                                    {Array.from({ length: lineCount }, (_, i) => (
                                        <div key={i + 1}>{i + 1}</div>
                                    ))}
                                </div>
                                <textarea
                                    id='cw_answer'
                                    className='cw_box'
                                    ref={textareaRef}
                                    value={currentQuestion[4] || ''}
                                    onKeyDown={handleCodeWritingKeyDown}
                                    onChange={(e) => {
                                        const val = e.target.value;
                                        updateLineCount(val);
                                        setCurrentQuestion(prev => [prev[0], prev[1], prev[2], prev[3], val, prev[5], prev[6], prev[7]]);
                                    }}
                                    onScroll={handleCwScroll}
                                ></textarea>
                            </div>

                            {/* Stdin textarea */}
                            <div className='cw_stdin_wrapper'>
                                <span className='cw_stdin_label'>Stdin <span style={{ fontWeight: 400, fontSize: "0.8rem", color: "#888" }}>(one value per line — for input() calls)</span></span>
                                <textarea
                                    className='cw_stdin_box'
                                    placeholder={"e.g.\nAlice\n25\n3.14"}
                                    value={stdinValue}
                                    onChange={(e) => setStdinValue(e.target.value)}
                                />
                            </div>

                            {/* Run Code button */}
                            <button
                                className='toggle-all-btn'
                                style={{ marginBottom: "8px" }}
                                disabled={codeRunning}
                                onClick={runCode}
                            >
                                {codeRunning
                                    ? (pyodideReady ? "Running..." : "Loading Python...")
                                    : "▶ Run Code"
                                }
                            </button>
                            <button
                                className='toggle-all-btn'
                                style={{ marginLeft: '8px' }}
                                onClick={() => window.open('/other/how-to-use-stdin', '_blank')}
                            >
                                How to use Stdin
                            </button>

                            {/* Output box */}
                            {codeOutput !== null && (
                                <div className='cw_output'>
                                    <span className='cw_output_label'>Output</span>
                                    {codeOutput.stdout && (
                                        <pre className='cw_output_stdout'>{codeOutput.stdout}</pre>
                                    )}
                                    {codeOutput.stderr && (
                                        <pre className='cw_output_stderr'>{codeOutput.stderr}</pre>
                                    )}
                                    {!codeOutput.stdout && !codeOutput.stderr && (
                                        <pre className='cw_output_stdout' style={{ color: '#888' }}>(no output)</pre>
                                    )}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Multiple Answer Input */}
                    {currentQuestion[3]?.type === 'multiple_answer' && currentQuestion[3]?.options && (
                        <div className='block' id='multiple answer'>
                            {Object.entries(currentQuestion[3].options).map(([key, value]) => (
                                <div key={key} style={{ margin: "8px 0" }}>
                                    <button
                                        id={`ma${key}`}
                                        className={`ma_option ${Array.isArray(currentQuestion[4]) && currentQuestion[4].includes(key) ? 'selected' : ''}`}
                                        onClick={() => ma_select(key)}
                                    >
                                        {key}. {renderFormattedText(value)}
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}

                    <p id='explanation' hidden={true}>{renderFormattedText(explanationText)}</p>

                    {/* Read About It — always visible during quiz */}
                    {moduleUrl && (
                        <div>
                            <br></br>
                            <button
                                className="toggle-all-btn"
                                style={{ marginTop: "4px" }}
                                onClick={() => window.open(moduleUrl, '_blank')}
                            >
                                Read About It
                            </button> 
                        </div>
                    )}

                    <button id='submit' className='quiz-start-btn'
                        disabled={loading || (currentQuestion[3]?.type === 'multiple_choice' && currentQuestion[4] == null)} 
                        hidden={false}
                        onClick={() => {
                            const qType = currentQuestion[3]?.type;
                            if (qType === 'multiple_choice') {
                                mc_check();
                            } else if (qType === 'short_answer') {
                                sa_check();
                            } else if (qType === 'code_writing') {
                                cw_check();
                            } else if (qType === 'multiple_answer') {
                                ma_check();
                            }
                        }}>
                            Submit</button>


                    <button id='next-question' className='quiz-start-btn' 
                        hidden={true}
                        disabled={loading}
                        onClick={ async () => {
                            // Clear question immediately so it disappears while the next one loads
                            setCurrentQuestion(prev => [prev[0], prev[1], prev[2], {}, null, false, false, false]);
                            const nextBtn = document.getElementById('next-question');
                            if (nextBtn) nextBtn.hidden = true;
                            const sub = document.getElementById('submit');
                            if (sub) sub.hidden = false;
                            const exp = document.getElementById('explanation');
                            if (exp) exp.hidden = true;
                            const qData = await getQuestion();
                            start_question_setup(qData);
                        }}>
                            Next Question</button>

                    {prefetchLoading && (
                        <p style={{ color: "#aaa", marginTop: "15px", fontStyle: "italic" }}>
                            Loading next question...
                        </p>
                    )}

                    {loading && (
                        <p style={{ color: "#aaa", marginTop: "15px", fontStyle: "italic" }}>
                            Loading question...
                        </p>
                    )}

                    <p style={{ color: "#888", fontSize: "0.8rem", marginTop: "30px", fontStyle: "italic" }}>
                        AI can make mistakes. Double-check important facts and concepts.
                    </p>

                </div>
            </section>
        </>
    );

}
export default ENGR102TopicQuizzer;