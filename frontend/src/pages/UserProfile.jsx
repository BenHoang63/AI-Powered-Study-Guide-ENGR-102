import { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
    BarChart3, 
    RotateCw, 
    CheckCircle2, 
    Target, 
    BookOpen, 
    Layers, 
    ArrowRight,
    AlertCircle,
    ListChecks,
    Filter,
    Play,
    ChevronDown,
    GraduationCap
} from 'lucide-react';
import { authClient } from '../scripts/auth';
import { isAuthorized, isDemoMode } from '../scripts/demo';

const COURSES = [
    {
        id: 'engr102',
        label: 'ENGR 102',
        name: 'Engineering Lab I',
        quizzerUrl: '/engr102/topicquizzer',
        chapters: [
            { num: 1,  title: 'Intro to Computing & Python' },
            { num: 2,  title: 'Variables & Expressions' },
            { num: 3,  title: 'Types & Strings' },
            { num: 4,  title: 'Boolean Expressions & Conditionals' },
            { num: 5,  title: 'Program Design & Testing' },
            { num: 6,  title: 'Loops' },
            { num: 7,  title: 'Lists' },
            { num: 8,  title: 'Top-Down Design & Dictionaries' },
            { num: 9,  title: 'User-Designed Functions & Mutable/Immutable Data Types' },
            { num: 10, title: 'Exceptions & Errors' },
            { num: 11, title: 'Files' },
            { num: 12, title: 'Modules' },
        ]
    },
];

const getStatus = (accuracy_pct, attempts) => {
    if (!attempts || attempts === 0) return 'none';
    if (accuracy_pct >= 80 && attempts >= 10) return 'strong';
    if (accuracy_pct >= 50) return 'ok';
    return 'weak';
};

const BADGE_CONFIG = {
    strong: { label: 'Mastered', badgeClass: 'bg-emerald-950/60 text-emerald-300 border-emerald-800/60', barClass: 'bg-emerald-500' },
    ok:     { label: 'Progressing', badgeClass: 'bg-amber-950/60 text-amber-300 border-amber-800/60', barClass: 'bg-amber-500' },
    weak:   { label: 'Needs Practice', badgeClass: 'bg-rose-950/60 text-rose-300 border-rose-800/60', barClass: 'bg-rose-500' },
    none:   { label: 'Unattempted', badgeClass: 'bg-neutral-800 text-neutral-400 border-neutral-700', barClass: 'bg-neutral-700' },
};

const UserProfile = () => {
    const [user, setUser]                                 = useState(null);
    const [error, setError]                               = useState(null);
    const [stats, setStats]                               = useState([]);
    const [loading, setLoading]                           = useState(false);
    const [activeCourse, setActiveCourse]                 = useState(COURSES[0].id);
    const [courseDropdownOpen, setCourseDropdownOpen]     = useState(false);
    const [filterStatus, setFilterStatus]                 = useState('all'); // 'all' | 'weak' | 'strong'
    const courseDropdownRef = useRef(null);
    const navigate = useNavigate();

    // Close dropdown on click outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (courseDropdownRef.current && !courseDropdownRef.current.contains(event.target)) {
                setCourseDropdownOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        authClient.getSession().then(({ data }) => {
            if (data?.user) {
                if (isAuthorized(data.user.email)) {
                    setUser(data.user);
                } else {
                    setError('Please sign in with your @tamu.edu email.');
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

    const fetchStats = () => {
        if (!user?.email && !isDemoMode()) return;
        const targetEmail = user?.email || 'demo@tamu.edu';
        setLoading(true);
        fetch(`/api/stats/${activeCourse}/${encodeURIComponent(targetEmail)}`)
            .then(r => r.json())
            .then(data => {
                setStats(data.stats || []);
                setLoading(false);
            })
            .catch(err => {
                console.error('[UserProfile] Failed to fetch stats:', err);
                setLoading(false);
            });
    };

    useEffect(() => {
        fetchStats();
    }, [user, activeCourse]);

    const attempted     = stats.filter(s => s.attempts > 0);
    const totalAttempts = stats.reduce((sum, s) => sum + Number(s.attempts), 0);
    const totalCorrect  = stats.reduce((sum, s) => sum + Number(s.correct),  0);
    const overallAcc    = totalAttempts > 0
        ? Math.round((totalCorrect / totalAttempts) * 100)
        : null;
    const strongCount   = stats.filter(s => getStatus(Number(s.accuracy_pct), Number(s.attempts)) === 'strong').length;

    const courseConfig   = COURSES.find(c => c.id === activeCourse);
    const statsByChapter = courseConfig?.chapters.map(ch => ({
        ...ch,
        topics: stats.filter(s => Number(s.chapter) === ch.num)
    })) || [];

    return (
        <div className="min-h-screen bg-so-bg text-so-text-body pb-24">
            {/* Top brand accent stripe */}
            <div className="h-0.5 bg-[#500000]" />

            {/* Header / Breadcrumb */}
            <div className="border-b border-so-border bg-[#161616] py-8 px-4 sm:px-6">
                <div className="max-w-6xl mx-auto">
                    <div className="flex items-center gap-2 text-xs text-so-text-muted mb-3 font-mono">
                        <Link to="/home" className="hover:text-white transition-colors">Home</Link>
                        <span>/</span>
                        <span className="text-white font-semibold">Student Performance & Mastery</span>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                            {/* <div className="text-xs font-mono text-so-text-muted mb-1">
                                {user?.email || 'STUDENT RECORD'} &bull; {courseConfig?.label || 'ENGR 102'}
                            </div> */}
                            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                                Topic Mastery & Analytics
                            </h1>
                            <p className="text-xs sm:text-sm text-so-text-muted mt-1 max-w-xl leading-relaxed">
                                See what you need to work on, what you're good at, and your overall progress through the course.
                            </p>
                        </div>

                        {/* Course Selector & Actions */}
                        <div className="flex flex-wrap items-center gap-2.5">
                            {/* Course Dropdown (matches Navbar courses menu UI) */}
                            <div className="relative" ref={courseDropdownRef}>
                                <button
                                    onClick={() => setCourseDropdownOpen(!courseDropdownOpen)}
                                    className="px-3 py-1.5 text-xs font-medium rounded-md bg-so-surface hover:bg-so-hover border border-so-border text-white transition-colors flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#800000]"
                                    aria-haspopup="true"
                                    aria-expanded={courseDropdownOpen}
                                >
                                    <Layers className="w-3.5 h-3.5 text-white" />
                                    <span>Course: <strong className="text-white font-semibold">{courseConfig?.label || 'ENGR 102'}</strong></span>
                                    <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${courseDropdownOpen ? 'rotate-180 text-white' : 'text-so-text-muted'}`} />
                                </button>

                                {courseDropdownOpen && (
                                    <div className="absolute top-full left-0 sm:left-auto sm:right-0 mt-1.5 w-56 bg-[#1c1c1c] border border-so-border rounded-md shadow-so-md py-1.5 z-50">
                                        <div className="px-3 py-1 text-[11px] font-semibold text-so-text-muted uppercase tracking-wider">
                                            Select Course
                                        </div>
                                        {COURSES.map((course) => {
                                            const isSelected = course.id === activeCourse;
                                            return (
                                                <button
                                                    key={course.id}
                                                    onClick={() => {
                                                        setActiveCourse(course.id);
                                                        setCourseDropdownOpen(false);
                                                    }}
                                                    className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between transition-colors ${
                                                        isSelected
                                                            ? 'bg-[#500000]/25 text-white border-l-2 border-[#800000]'
                                                            : 'text-white hover:bg-so-hover hover:text-white'
                                                    }`}
                                                >
                                                    <div className="flex items-center gap-2">
                                                        <GraduationCap className="w-4 h-4 text-white" />
                                                        <div>
                                                            <div className="font-medium">{course.label}</div>
                                                            <div className="text-[10px] text-so-text-muted">{course.name || `${course.chapters.length} Modules`}</div>
                                                        </div>
                                                    </div>
                                                    {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                                                </button>
                                            );
                                        })}

                                        <div className="my-1 border-t border-so-borderSubtle" />

                                        <div className="px-3 py-1 text-[11px] font-semibold text-so-text-muted uppercase tracking-wider">
                                            Upcoming
                                        </div>
                                        <div className="px-3 py-2 text-xs text-so-text-muted flex items-center justify-between cursor-not-allowed opacity-70">
                                            <div className="flex items-center gap-2">
                                                <div className="w-4 h-4 rounded bg-[#242424] border border-so-borderSubtle flex items-center justify-center text-[10px] text-so-text-muted font-bold">E</div>
                                                <div>
                                                    <div className="font-medium text-so-text-muted">ETAM Preparation</div>
                                                    <div className="text-[10px] text-so-text-muted">Coming Soon</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <button
                                onClick={fetchStats}
                                disabled={loading}
                                className="so-btn-secondary text-xs"
                            >
                                <RotateCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-white' : ''}`} />
                                <span>{loading ? 'Refreshing...' : 'Refresh'}</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <main className="max-w-6xl mx-auto px-4 sm:px-6 pt-8 space-y-8">
                
                {error && (
                    <div className="p-3 rounded bg-red-950/40 border border-red-800/50 text-red-300 text-xs flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                        <span>{error}</span>
                    </div>
                )}

                {/* Grounded Summary Metric Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="so-card p-4 sm:p-5 border-so-border">
                        <div className="flex items-center justify-between text-so-text-muted mb-2">
                            <span className="text-xs font-medium">Attempted Topics</span>
                            {/* <BookOpen className="w-4 h-4 text-white" /> */}
                        </div>
                        <div className="text-2xl font-bold text-white tracking-tight font-mono">
                            {attempted.length}
                        </div>
                        <div className="text-[11px] text-so-text-muted mt-1">
                            across {courseConfig?.chapters?.length || 12} modules
                        </div>
                    </div>

                    <div className="so-card p-4 sm:p-5 border-so-border">
                        <div className="flex items-center justify-between text-so-text-muted mb-2">
                            <span className="text-xs font-medium">Questions Answered</span>
                            {/* <Target className="w-4 h-4 text-[#7aa7c7]" /> */}
                        </div>
                        <div className="text-2xl font-bold text-white tracking-tight font-mono">
                            {totalAttempts}
                        </div>
                        <div className="text-[11px] text-so-text-muted mt-1">
                            {totalCorrect} answered correctly
                        </div>
                    </div>

                    <div className="so-card p-4 sm:p-5 border-so-border">
                        <div className="flex items-center justify-between text-so-text-muted mb-2">
                            <span className="text-xs font-medium">Cumulative Accuracy</span>
                            {/* <BarChart3 className="w-4 h-4 text-amber-400" /> */}
                        </div>
                        <div className="text-2xl font-bold text-white tracking-tight font-mono">
                            {overallAcc !== null ? `${overallAcc}%` : '—'}
                        </div>
                        <div className="text-[11px] text-so-text-muted mt-1">
                            across all submissions
                        </div>
                    </div>

                    <div className="so-card p-4 sm:p-5 border-so-border">
                        <div className="flex items-center justify-between text-so-text-muted mb-2">
                            <span className="text-xs font-medium">Topics Mastered</span>
                            {/* <CheckCircle2 className="w-4 h-4 text-emerald-400" /> */}
                        </div>
                        <div className="text-2xl font-bold text-emerald-400 tracking-tight font-mono">
                            {strongCount}
                        </div>
                        <div className="text-[11px] text-so-text-muted mt-1">
                            ≥ 80% accuracy (10+ attempts)
                        </div>
                    </div>
                </div>

                {/* Filter Toolbar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-so-border pb-3">
                    <div className="flex items-center gap-1.5">
                        <span className="text-xs text-so-text-muted font-medium mr-2">Filter View:</span>
                        <button
                            onClick={() => setFilterStatus('all')}
                            className={`px-2.5 py-1 text-xs rounded transition-colors ${
                                filterStatus === 'all'
                                    ? 'bg-so-surface text-white border border-so-border font-semibold'
                                    : 'text-so-text-muted hover:text-white'
                            }`}
                        >
                            All Modules
                        </button>
                        <button
                            onClick={() => setFilterStatus('weak')}
                            className={`px-2.5 py-1 text-xs rounded transition-colors ${
                                filterStatus === 'weak'
                                    ? 'bg-rose-950/40 text-rose-300 border border-rose-800/60 font-semibold'
                                    : 'text-so-text-muted hover:text-white'
                            }`}
                        >
                            Needs Practice (&lt; 70%)
                        </button>
                        <button
                            onClick={() => setFilterStatus('strong')}
                            className={`px-2.5 py-1 text-xs rounded transition-colors ${
                                filterStatus === 'strong'
                                    ? 'bg-emerald-950/40 text-emerald-300 border border-emerald-800/60 font-semibold'
                                    : 'text-so-text-muted hover:text-white'
                            }`}
                        >
                            Mastered (&ge; 80%)
                        </button>
                    </div>

                    <div className="text-xs text-so-text-muted font-mono">
                        Showing {courseConfig?.label || 'ENGR 102'} Coursework
                    </div>
                </div>

                {/* Empty State */}
                {!loading && attempted.length === 0 && (
                    <div className="so-card p-8 text-center border-so-border max-w-lg mx-auto my-8">
                        {/* <div className="w-10 h-10 rounded bg-so-surface border border-so-border flex items-center justify-center mx-auto mb-3">
                            <ListChecks className="w-5 h-5 text-white" />
                        </div> */}
                        <h3 className="text-sm font-bold text-white mb-1.5">
                            No Quiz History Recorded
                        </h3>
                        <p className="text-xs text-so-text-muted mb-5 max-w-sm mx-auto leading-relaxed">
                            Submissions from the {courseConfig?.label || 'course'} Topic Quizzer and Exam Review sandboxes will automatically populate your mastery analytics here.
                        </p>
                        <button
                            onClick={() => navigate(courseConfig?.quizzerUrl || '/engr102/topicquizzer')}
                            className="so-btn-primary text-xs"
                        >
                            <span>Open {courseConfig?.label ? `${courseConfig.label} ` : ''}Topic Quizzer</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                    </div>
                )}

                {/* Dense Student Gradebook Table */}
                {!loading && (
                    <div className="space-y-6">
                        {statsByChapter.map((ch) => {
                            let visibleTopics = ch.topics;
                            if (filterStatus === 'weak') {
                                visibleTopics = ch.topics.filter(t => {
                                    const acc = Number(t.accuracy_pct);
                                    return Number(t.attempts) > 0 && acc < 70;
                                });
                            } else if (filterStatus === 'strong') {
                                visibleTopics = ch.topics.filter(t => {
                                    const acc = Number(t.accuracy_pct);
                                    return Number(t.attempts) >= 10 && acc >= 80;
                                });
                            }

                            if (visibleTopics.length === 0 && filterStatus !== 'all') return null;

                            return (
                                <div key={ch.num} className="so-card border-so-border overflow-hidden">
                                    {/* Table Header Bar */}
                                    <div className="bg-[#181818] px-4 py-3 border-b border-so-border flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <span className="font-mono text-xs text-[#fca5a5] font-semibold">
                                                Chapter {ch.num}
                                            </span>
                                            <span className="text-xs font-bold text-white">
                                                {ch.title}
                                            </span>
                                        </div>
                                        <span className="text-[11px] text-so-text-muted font-mono">
                                            {visibleTopics.length} topic records
                                        </span>
                                    </div>

                                    {/* Table Content */}
                                    {visibleTopics.length === 0 ? (
                                        <div className="p-4 text-xs text-so-text-muted text-center italic">
                                            No questions attempted in this chapter yet.
                                        </div>
                                    ) : (
                                        <div className="divide-y divide-so-borderSubtle">
                                            {visibleTopics.map((t, i) => {
                                                const attempts = Number(t.attempts);
                                                const accuracy = attempts > 0 ? Number(t.accuracy_pct) : null;
                                                const status   = getStatus(accuracy, attempts);
                                                const badge    = BADGE_CONFIG[status];
                                                const fillPct  = accuracy !== null ? accuracy : 0;

                                                return (
                                                    <div 
                                                        key={i} 
                                                        className="px-4 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs hover:bg-[#202020] transition-colors"
                                                    >
                                                        {/* Topic ID and Title */}
                                                        <div className="sm:w-2/5 flex items-center gap-2.5">
                                                            <span className="font-mono text-so-text-muted text-[11px] bg-so-surface px-1.5 py-0.5 rounded border border-so-border shrink-0">
                                                                {ch.num}.{t.topic}
                                                            </span>
                                                            <span className="font-medium text-white truncate">
                                                                {t.topic_name || `Topic ${t.topic}`}
                                                            </span>
                                                        </div>

                                                        {/* Progress bar container */}
                                                        <div className="sm:flex-1 flex items-center gap-3">
                                                            <div className="w-full bg-[#111111] h-1.5 rounded-sm overflow-hidden border border-[#2d2d2d]">
                                                                <div
                                                                    className={`h-full transition-all duration-200 ${badge.barClass}`}
                                                                    style={{ width: `${fillPct}%` }}
                                                                />
                                                            </div>
                                                            <span className="font-mono text-[11px] text-white w-10 text-right shrink-0">
                                                                {accuracy !== null ? `${accuracy}%` : '—'}
                                                            </span>
                                                        </div>

                                                        {/* Attempts & Status Badge */}
                                                        <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
                                                            <span className="text-[11px] text-so-text-muted font-mono">
                                                                {attempts > 0 ? `${t.correct}/${attempts} correct` : '0 tries'}
                                                            </span>
                                                            <span className={`px-2 py-0.5 rounded text-[10px] font-medium border ${badge.badgeClass}`}>
                                                                {badge.label}
                                                            </span>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}

            </main>
        </div>
    );
};

export default UserProfile;