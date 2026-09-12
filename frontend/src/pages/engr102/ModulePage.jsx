import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
    ChevronLeft, 
    ChevronRight, 
    BookOpen, 
    CheckCircle2, 
    ListFilter, 
    ArrowRight,
    HelpCircle,
    ListChecks,
    Code2
} from 'lucide-react';
import { authClient } from '../../scripts/auth';
import { isAuthorized, isDemoMode } from '../../scripts/demo';
import { MODULES, getModuleById } from './modules/index.js';

const ModulePage = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [user, setUser] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    // Auth verification
    useEffect(() => {
        authClient.getSession().then(({ data }) => {
            if (data?.user) {
                if (isAuthorized(data.user.email)) {
                    setUser(data.user);
                    setLoading(false);
                    return;
                } else {
                    setError("Please sign in with your @tamu.edu email.");
                    authClient.signOut();
                    setLoading(false);
                }
            } else if (!isDemoMode()) {
                navigate('/');
            } else {
                setLoading(false);
            }
        }).catch((err) => {
            console.error('Session error:', err);
            if (!isDemoMode()) navigate('/');
            setLoading(false);
        });
    }, [navigate]);

    // Resolve current module from URL param (e.g. "1", "module1", "12")
    const currentModule = getModuleById(id) || MODULES[0];
    const prevModule = currentModule.id > 1 ? getModuleById(currentModule.id - 1) : null;
    const nextModule = currentModule.id < 12 ? getModuleById(currentModule.id + 1) : null;

    if (error) {
        return (
            <div className="min-h-[80vh] flex items-center justify-center px-4">
                <div className="so-card max-w-md w-full p-6 text-center border-red-900/40">
                    <p className="text-so-red text-sm font-medium mb-4">{error}</p>
                    <button 
                        onClick={() => navigate('/')} 
                        className="so-btn-primary"
                    >
                        Return to Sign In
                    </button>
                </div>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="min-h-[70vh] flex items-center justify-center">
                <div className="flex items-center gap-3 text-so-text-muted text-sm">
                    <div className="w-5 h-5 border-2 border-[#500000] border-t-transparent rounded-full animate-spin" />
                    <span>Loading Module {currentModule.id}...</span>
                </div>
            </div>
        );
    }

    const { Component } = currentModule;

    return (
        <div className="min-h-screen bg-so-bg text-so-text-body pb-24">
            {/* Top Sub-Header Bar (Solid) */}
            <div className="border-b border-so-border bg-[#181818] sticky top-14 z-30">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-3">
                    
                    {/* Breadcrumbs */}
                    <div className="flex items-center gap-2 text-xs text-so-text-muted font-mono">
                        <Link to="/home" className="hover:text-white transition-colors">Home</Link>
                        <span>/</span>
                        <Link to="/engr102" className="hover:text-white transition-colors">ENGR 102</Link>
                        <span>/</span>
                        <span className="text-white font-semibold">Module {currentModule.id}</span>
                    </div>

                    {/* Quick Module Switcher Dropdown */}
                    <div className="flex items-center gap-2">
                        <div className="relative inline-block">
                            <select
                                value={currentModule.id}
                                onChange={(e) => navigate(`/engr102/module${e.target.value}`)}
                                className="bg-so-surface border border-so-border text-xs text-white rounded px-2.5 py-1 focus:outline-none focus:border-[#800000] cursor-pointer hover:bg-so-hover transition-colors"
                            >
                                {MODULES.map((m) => (
                                    <option key={m.id} value={m.id} className="bg-so-card text-white">
                                        Mod {m.id}: {m.title.length > 32 ? m.title.substring(0, 32) + '...' : m.title}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Direct Quizzer Link */}
                        <button
                            onClick={() => navigate('/engr102/topicquizzer')}
                            className="so-btn-outline gap-1.5 text-xs text-white hover:text-white hover:border-[#800000] py-1"
                            title="Test your knowledge on this module"
                        >
                            <ListChecks className="w-3.5 h-3.5 text-white" />
                            <span className="hidden sm:inline">Practice Questions</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <main className="max-w-4xl mx-auto px-4 sm:px-6 pt-8">
                
                {/* Module Hero Header */}
                <div className="so-card p-6 sm:p-8 mb-8 border-so-border">
                    <div className="text-xs font-mono text-white mb-2 font-semibold">
                        MODULE {currentModule.id.toString().padStart(2, '0')} OF 12 &bull; TEXAS A&M ENGR 102
                    </div>

                    <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mb-3">
                        {currentModule.title}
                    </h1>

                    <p className="text-xs sm:text-sm text-so-text-muted max-w-2xl leading-relaxed">
                        Weekly lecture reference notes and syntax rules. Review the Python concepts and code examples below to prepare for exams and code writing assignments.
                    </p>

                    {/* Pagination Controls */}
                    <div className="flex items-center justify-between pt-4 mt-5 border-t border-so-borderSubtle">
                        {prevModule ? (
                            <button
                                onClick={() => navigate(`/engr102/module${prevModule.id}`)}
                                className="inline-flex items-center gap-1.5 text-xs font-medium text-so-text-body hover:text-white transition-colors"
                            >
                                <ChevronLeft className="w-4 h-4" />
                                <span>Prev: Mod {prevModule.id}</span>
                            </button>
                        ) : <div />}

                        {nextModule ? (
                            <button
                                onClick={() => navigate(`/engr102/module${nextModule.id}`)}
                                className="inline-flex items-center gap-1.5 text-xs font-medium text-so-text-body hover:text-white transition-colors"
                            >
                                <span>Next: Mod {nextModule.id}</span>
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        ) : <div />}
                    </div>
                </div>

                {/* Module Body Content */}
                <article className="so-card p-6 sm:p-10 mb-10 prose prose-invert max-w-none">
                    <Component />
                </article>

                {/* Bottom Navigation & Quiz CTA */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Quiz CTA Card */}
                    <div className="so-card p-5 border-so-border bg-[#181818] sm:col-span-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div className="space-y-1">
                            <div className="flex items-center gap-2">
                                <ListChecks className="w-4 h-4 text-white" />
                                <h3 className="text-sm font-semibold text-white">Finished reviewing Module {currentModule.id}?</h3>
                            </div>
                            <p className="text-xs text-so-text-muted">
                                Test your understanding with multiple-choice questions and live Python code writing exercises.
                            </p>
                        </div>
                        <button
                            onClick={() => navigate('/engr102/topicquizzer')}
                            className="so-btn-primary shrink-0 text-xs py-2 px-4"
                        >
                            <span>Launch Topic Quizzer</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                    </div>

                    {/* Previous Module Link */}
                    {prevModule ? (
                        <button
                            onClick={() => navigate(`/engr102/module${prevModule.id}`)}
                            className="so-card so-card-hover p-4 text-left flex items-center justify-between group"
                        >
                            <div>
                                <div className="text-[11px] text-so-text-muted">← Previous Module</div>
                                <div className="text-xs font-semibold text-white group-hover:text-white transition-colors">
                                    Module {prevModule.id}: {prevModule.title}
                                </div>
                            </div>
                            <ChevronLeft className="w-4 h-4 text-so-text-muted group-hover:text-white transition-colors" />
                        </button>
                    ) : <div />}

                    {/* Next Module Link */}
                    {nextModule ? (
                        <button
                            onClick={() => navigate(`/engr102/module${nextModule.id}`)}
                            className="so-card so-card-hover p-4 text-left flex items-center justify-between group"
                        >
                            <div>
                                <div className="text-[11px] text-so-text-muted text-right">Next Module →</div>
                                <div className="text-xs font-semibold text-white group-hover:text-white transition-colors">
                                    Module {nextModule.id}: {nextModule.title}
                                </div>
                            </div>
                            <ChevronRight className="w-4 h-4 text-so-text-muted group-hover:text-white transition-colors" />
                        </button>
                    ) : <div />}
                </div>

            </main>
        </div>
    );
};

export default ModulePage;
