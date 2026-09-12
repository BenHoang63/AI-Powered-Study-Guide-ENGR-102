import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
    BookOpen, 
    FileText, 
    Layers, 
    ArrowRight, 
    ChevronRight,
    Terminal, 
    GraduationCap,
    Download,
    ListChecks,
    CheckCircle2,
    PenLine
} from 'lucide-react';
import { authClient } from '../../scripts/auth';
import { isAuthorized, isDemoMode } from '../../scripts/demo';
import { MODULES } from './modules/index.js';

const ENGR102Home = () => {
    const [user, setUser] = useState(null);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        authClient.getSession().then(({ data }) => {
            if (data?.user) {
                if (isAuthorized(data.user.email)) {
                    setUser(data.user);
                    return;
                } else {
                    setError("Please sign in with your @tamu.edu email.");
                    authClient.signOut();
                }
            } else if (!isDemoMode()) {
                navigate('/');
            }
        }).catch((err) => {
            console.error(err);
            if (!isDemoMode()) navigate('/');
        });
    }, [navigate]);

    return (
        <div className="min-h-screen bg-so-bg text-so-text-body pb-24">
            {/* Top brand accent stripe */}
            <div className="h-0.5 bg-[#500000]" />

            {/* Header / Breadcrumbs */}
            <div className="border-b border-so-border bg-[#161616] py-8 px-4 sm:px-6">
                <div className="max-w-6xl mx-auto">
                    <div className="flex items-center gap-2 text-xs text-so-text-muted mb-3 font-mono">
                        <Link to="/home" className="hover:text-white transition-colors">Home</Link>
                        <span>/</span>
                        <span className="text-white font-semibold">ENGR 102</span>
                    </div>

                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                            ENGR 102: Engineering Lab I – Computation
                        </h1>
                    </div>
                </div>
            </div>

            <main className="max-w-6xl mx-auto px-4 sm:px-6 pt-8 space-y-10">
                
                {/* Topic Quizzer Featured Section */}
                <section>
                    <div className="flex items-center justify-between border-b border-so-border pb-2 mb-3">
                        <div>
                            <h2 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                                <PenLine className="w-4 h-4 text-white" />
                                <span>Quizzer</span>
                            </h2>
                        </div>
                    </div>
                    <div
                        onClick={() => navigate('/engr102/topicquizzer')}
                        className="so-card p-6 border-so-border bg-[#181818] hover:border-[#500000] hover:bg-[#1a1a1a] transition-all cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-6 group"
                    >
                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 rounded-lg bg-[#222222] border border-so-border flex items-center justify-center shrink-0 text-white group-hover:border-[#500000] group-hover:bg-[#500000]/20 transition-colors">
                                <ListChecks className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-white tracking-tight group-hover:text-white transition-colors">
                                    Topic Quizzer
                                </h3>
                                <p className="text-xs sm:text-sm text-so-text-muted mt-1 leading-relaxed max-w-2xl">
                                    Practice questions organized by lecture topic across all 12 modules. Test your understanding with conceptual multiple-choice checks and browser-evaluated Python code writing.
                                </p>
                                <div className="flex flex-wrap items-center gap-3 text-xs text-so-text-muted mt-3">
                                    <span>12 Topic Modules</span>
                                    <span className="text-so-border">&bull;</span>
                                    <span>Multiple Choice & Code Writing</span>
                                    <span className="text-so-border">&bull;</span>
                                    <span>Instant Evaluation</span>
                                </div>
                            </div>
                        </div>

                        <div className="shrink-0 self-start md:self-center">
                            <button
                                onClick={(e) => { e.stopPropagation(); navigate('/engr102/topicquizzer'); }}
                                className="so-btn-primary px-5 py-2.5 text-xs sm:text-sm font-semibold"
                            >
                                <span>Open Topic Quizzer</span>
                                <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>
                    </div>
                </section>
                
                {/* 1. Exam Milestones & Practice Hub */}
                <section>
                    <div className="flex items-center justify-between mb-4 border-b border-so-border pb-2">
                        <div>
                            <h2 className="text-sm font-bold text-white tracking-tight flex items-center gap-2 uppercase tracking-wider text-xs">
                                <FileText className="w-4 h-4 text-white" />
                                <span>Midterm Exam Preparation & Official Review Packets</span>
                            </h2>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        
                        {/* Exam 1 Practice */}
                        <div className="so-card p-5 border-so-border flex flex-col justify-between">
                            <div>
                                <div className="flex items-center justify-between text-xs text-so-text-muted mb-2">
                                    <span className="font-mono text-[#fca5a5] font-semibold">MIDTERM 01</span>
                                    <span>Weekly Modules 1–7</span>
                                </div>
                                <h3 className="text-base font-bold text-white mb-1.5">
                                    Exam 1: Fundamentals & Iteration
                                </h3>
                                <p className="text-xs text-so-text-muted leading-relaxed mb-4">
                                    Covers computer architecture fundamentals, Python syntax, numeric and string types, boolean logic, if/elif/else branching, while and for loops, and list manipulation.
                                </p>
                            </div>

                            <div className="pt-3 border-t border-so-borderSubtle flex items-center justify-between">
                                <a 
                                    href="/exam1review.pdf" 
                                    download 
                                    className="text-xs text-so-text-muted hover:text-white flex items-center gap-1.5 transition-colors"
                                >
                                    <Download className="w-3.5 h-3.5 text-white" />
                                    <span>Download Exam 1 Review PDF</span>
                                </a>
                                <button
                                    onClick={() => navigate('/engr102/exam1')}
                                    className="so-btn-primary text-xs"
                                >
                                    <span>Take Exam 1 Quiz</span>
                                    <span>→</span>
                                </button>
                            </div>
                        </div>

                        {/* Exam 2 Practice */}
                        <div className="so-card p-5 border-so-border flex flex-col justify-between">
                            <div>
                                <div className="flex items-center justify-between text-xs text-so-text-muted mb-2">
                                    <span className="font-mono text-[#7aa7c7] font-semibold">MIDTERM 02</span>
                                    <span>Comprehensive (Modules 1–12)</span>
                                </div>
                                <h3 className="text-base font-bold text-white mb-1.5">
                                    Exam 2: Functions, Data Structures & Files
                                </h3>
                                <p className="text-xs text-so-text-muted leading-relaxed mb-4">
                                    Cumulative midterm covering top-down design, key-value dictionaries, user-defined functions, exception handling (try/except), file input/output, and Python standard modules.
                                </p>
                            </div>

                            <div className="pt-3 border-t border-so-borderSubtle flex items-center justify-between">
                                <a 
                                    href="/ENGR102_ReferenceSheet.pdf" 
                                    download 
                                    className="text-xs text-so-text-muted hover:text-white flex items-center gap-1.5 transition-colors"
                                >
                                    <Download className="w-3.5 h-3.5 text-white" />
                                    <span>Download Formula Sheet PDF</span>
                                </a>
                                <button
                                    onClick={() => navigate('/engr102/exam2')}
                                    className="so-btn-primary text-xs"
                                >
                                    <span>Take Exam 2 Quiz</span>
                                    <span>→</span>
                                </button>
                            </div>
                        </div>

                    </div>
                </section>

                {/* 2. Structured 12-Module Matrix */}
                <section>
                    <div className="flex items-center justify-between mb-4 border-b border-so-border pb-2">
                        <div>
                            <h2 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                                <BookOpen className="w-4 h-4 text-white" />
                                <span>Weekly Course Lecture Modules (1–12)</span>
                            </h2>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                        {MODULES.map((mod) => (
                            <div
                                key={mod.id}
                                onClick={() => navigate(`/engr102/module${mod.id}`)}
                                className="so-card so-card-hover p-4 cursor-pointer flex flex-col justify-between group"
                            >
                                <div>
                                    <div className="flex items-center justify-between mb-1.5">
                                        <span className="text-xs font-mono text-so-text-muted uppercase tracking-wider">
                                            Module {mod.id}
                                        </span>
                                        <ChevronRight className="w-3.5 h-3.5 text-so-text-muted group-hover:text-white group-hover:translate-x-0.5 transition-transform" />
                                    </div>
                                    <h3 className="text-xs sm:text-sm font-semibold text-white group-hover:text-[#fca5a5] transition-colors mb-1">
                                        {mod.title}
                                    </h3>
                                </div>
                                <div className="text-[11px] text-so-text-muted pt-2.5 mt-2 border-t border-so-borderSubtle flex items-center justify-between">
                                    <span>Lecture notes & syntax reference</span>
                                    <span className="text-white font-medium group-hover:translate-x-0.5 transition-transform">Read Notes →</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* 3. Runtime Guide */}
                <section className="so-card p-5 border-so-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-start gap-3">
                        <div className="w-9 h-9 rounded bg-so-surface border border-so-border flex items-center justify-center shrink-0">
                            <Terminal className="w-4 h-4 text-white" />
                        </div>
                        <div>
                            <h4 className="text-xs font-semibold text-white">Browser Python Execution (Pyodide WebAssembly)</h4>
                            <p className="text-xs text-so-text-muted mt-0.5">
                                Learn how browser-based standard input (stdin) simulation evaluates your code writing submissions locally.
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={() => navigate('/other/how-to-use-stdin')}
                        className="so-btn-outline text-xs shrink-0"
                    >
                        <span>View STDIN Documentation</span>
                        <span>→</span>
                    </button>
                </section>

            </main>
        </div>
    );
};

export default ENGR102Home;