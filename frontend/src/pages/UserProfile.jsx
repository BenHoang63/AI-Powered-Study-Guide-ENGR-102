import { authClient } from '../scripts/auth';
import { isAuthorized, isDemoMode } from '../scripts/demo';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/user_profile.css';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';

// ── Course definitions ──
// Add new courses here as the app grows.
const COURSES = [
    {
        id: 'engr102',
        label: 'ENGR 102',
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
    // Add future courses here:
    // { id: 'engr216', label: 'ENGR 216', chapters: [...] },
];

// ── Helpers ──

const getStatus = (accuracy_pct, attempts) => {
    if (!attempts || attempts === 0) return 'none';
    if (accuracy_pct >= 80 && attempts >= 10) return 'strong';
    if (accuracy_pct >= 50) return 'ok';
    return 'weak';
};

const BADGE_CONFIG = {
    strong: { label: '✓ Strong',    cls: 'badge-strong', barColor: '#3cb371' },
    ok:     { label: '~ Getting There', cls: 'badge-ok', barColor: '#d4a017' },
    weak:   { label: '✗ Needs Work', cls: 'badge-weak', barColor: '#c0392b' },
    none:   { label: '— Not Tried', cls: 'badge-none', barColor: '#333'    },
};


// ── Component ──

const UserProfile = () => {

    const [user, setUser]         = useState(null);
    const [error, setError]       = useState(null);
    const [stats, setStats]       = useState([]);   // flat array of topic rows from API
    const [loading, setLoading]   = useState(false);
    const [activeCourse, setActiveCourse] = useState(COURSES[0].id);
    const navigate = useNavigate();

    // ── Auth check ──
    useEffect(() => {
        authClient.getSession().then(({ data }) => {
            if (data?.user) {
                if (isAuthorized(data.user.email)) {
                    setUser(data.user);
                } else {
                    console.log('Not a TAMU student:', data.user.email);
                    setError('Please sign in with your @tamu.edu email.');
                    authClient.signOut();
                }
            } else if (!isDemoMode()) {
                navigate('/');
            }
        });
    }, []);

    const fetchStats = () => {
        if (!user?.email) return;
        setLoading(true);
        fetch(`${BACKEND_URL}/api/stats/${activeCourse}/${encodeURIComponent(user.email)}`)
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

    // ── Fetch stats whenever user or course changes ──
    useEffect(() => {
        fetchStats();
    }, [user, activeCourse]);

    // ── Derived summary numbers ──
    const attempted   = stats.filter(s => s.attempts > 0);
    const totalAttempts = stats.reduce((sum, s) => sum + Number(s.attempts), 0);
    const totalCorrect  = stats.reduce((sum, s) => sum + Number(s.correct),  0);
    const overallAcc    = totalAttempts > 0
        ? Math.round((totalCorrect / totalAttempts) * 100)
        : null;
    const strongCount = stats.filter(s => getStatus(Number(s.accuracy_pct), Number(s.attempts)) === 'strong').length;

    // ── Group stats by chapter for display ──
    const courseConfig   = COURSES.find(c => c.id === activeCourse);
    const statsByChapter = courseConfig?.chapters.map(ch => ({
        ...ch,
        topics: stats.filter(s => Number(s.chapter) === ch.num)
    })) || [];

    // ── Render ──
    return (
        <>
            <header style={{ textAlign: 'center', margin: '32px auto 24px' }}>
                <h1 style={{ marginBottom: 4 }}>User Progress</h1>
                {user && (
                    <p style={{ color: '#888', marginTop: 0, fontSize: '0.9rem' }}>
                        {user.email}
                    </p>
                )}
                {error && (
                    <p style={{ color: '#c0392b' }}>{error}</p>
                )}
                <button
                    className="refresh-btn"
                    onClick={fetchStats}
                    disabled={loading}
                >
                    {loading ? 'Refreshing...' : '↻ Refresh'}
                </button>
            </header>

            <section className="profile-wrapper">

                {/* ── Course tabs ── */}
                {COURSES.length > 1 && (
                    <div className="course-tabs">
                        {COURSES.map(c => (
                            <button
                                key={c.id}
                                className={`course-tab${activeCourse === c.id ? ' active' : ''}`}
                                onClick={() => setActiveCourse(c.id)}
                            >
                                {c.label}
                            </button>
                        ))}
                    </div>
                )}

                {/* ── Summary cards ── */}
                <div className="profile-summary">
                    <div className="profile-stat-card">
                        <span className="stat-value">{attempted.length}</span>
                        <span className="stat-label">Topics Tried</span>
                    </div>
                    <div className="profile-stat-card">
                        <span className="stat-value">{totalAttempts}</span>
                        <span className="stat-label">Total Attempts</span>
                    </div>
                    <div className="profile-stat-card">
                        <span className="stat-value">
                            {overallAcc !== null ? `${overallAcc}%` : '—'}
                        </span>
                        <span className="stat-label">Overall Accuracy</span>
                    </div>
                    <div className="profile-stat-card">
                        <span className="stat-value" style={{ color: '#3cb371' }}>{strongCount}</span>
                        <span className="stat-label">Topics Strong</span>
                    </div>
                </div>

                {/* ── Loading state ── */}
                {loading && (
                    <p className="profile-loading">Loading your progress...</p>
                )}

                {/* ── Empty state ── */}
                {!loading && attempted.length === 0 && (
                    <div className="profile-empty">
                        <p>No quiz data yet.</p>
                    </div>
                )}

                {/* ── Per-chapter topic breakdown ── */}
                {!loading && statsByChapter.map(ch => {
                    // Only render chapters that have any attempts
                    const hasActivity = ch.topics.some(t => Number(t.attempts) > 0);
                    if (!hasActivity) return null;

                    return (
                        <div key={ch.num} className="chapter-section">
                            <div className="chapter-heading">
                                {courseConfig?.label} — Chapter {ch.num} — {ch.title}
                            </div>

                            {ch.topics.map((t, i) => {
                                const attempts  = Number(t.attempts);
                                const accuracy  = attempts > 0 ? Number(t.accuracy_pct) : null;
                                const status    = getStatus(accuracy, attempts);
                                const badge     = BADGE_CONFIG[status];
                                const fillPct   = accuracy !== null ? accuracy : 0;

                                return (
                                    <div key={i} className="topic-row">
                                        <div className="topic-label">
                                            <span className="topic-num">{ch.num}.{t.topic}</span>
                                            {t.topic_name || `Topic ${t.topic}`}
                                        </div>

                                        {/* Progress bar */}
                                        <div className="topic-bar-wrap">
                                            <div
                                                className="topic-bar-fill"
                                                style={{
                                                    width: `${fillPct}%`,
                                                    backgroundColor: badge.barColor
                                                }}
                                            />
                                        </div>

                                        {/* Accuracy % */}
                                        <span className="topic-accuracy">
                                            {accuracy !== null ? `${accuracy}%` : '—'}
                                        </span>

                                        {/* Attempts */}
                                        <span style={{ width: 52, textAlign: 'right', fontSize: '0.8rem', color: '#666', flexShrink: 0 }}>
                                            {attempts > 0 ? `${t.correct}/${attempts}` : ''}
                                        </span>

                                        {/* Status badge */}
                                        <span className={`topic-badge ${badge.cls}`}>
                                            {badge.label}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    );
                })}

            </section>
        </>
    );
};

export default UserProfile;