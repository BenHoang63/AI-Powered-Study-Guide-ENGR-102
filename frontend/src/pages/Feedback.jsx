import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
    MessageSquare, 
    Send, 
    CheckCircle2, 
    AlertCircle, 
    Loader2, 
    HelpCircle,
    ChevronLeft
} from 'lucide-react';
import { authClient } from '../scripts/auth';
import { isAuthorized, isDemoMode } from '../scripts/demo';

const CATEGORIES = [
    { value: 'bug',        label: 'Bug Report' },
    { value: 'suggestion', label: 'Feature / Suggestion' },
    { value: 'general',    label: 'General Feedback' },
    { value: 'other',      label: 'Other' },
];

const PAGES = [
    { value: 'engr102', label: 'ENGR 102' },
    { value: 'etam',    label: 'ETAM (Coming Soon)', disabled: true },
    { value: 'general', label: 'General / Not Page-Specific' },
];

const FeedbackPage = () => {
    const [user, setUser]           = useState(null);
    const [error, setError]         = useState(null);
    const [message, setMessage]     = useState('');
    const [category, setCategory]   = useState('general');
    const [page, setPage]           = useState('engr102');
    const [status, setStatus]       = useState('idle'); // 'idle' | 'loading' | 'success' | 'error'
    const [statusMsg, setStatusMsg] = useState('');

    const navigate = useNavigate();

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

    const MAX_CHARS = 1000;

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!message.trim()) {
            setStatus('error');
            setStatusMsg('Please enter a message before submitting.');
            return;
        }

        if (message.length > MAX_CHARS) {
            setStatus('error');
            setStatusMsg(`Message exceeds character limit of ${MAX_CHARS} characters.`);
            return;
        }

        setStatus('loading');
        setStatusMsg('');

        try {
            const res = await fetch('/api/feedback', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    user_email: user?.email || (isDemoMode() ? 'demo@tamu.edu' : 'anonymous'),
                    message: message.trim(),
                    category,
                    page,
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                setStatus('error');
                setStatusMsg(data.error || 'Something went wrong. Please try again.');
            } else {
                setStatus('success');
                setStatusMsg('Thank you! Your feedback has been recorded.');
                setMessage('');
                setCategory('general');
                setPage('engr102');
            }
        } catch (err) {
            console.error(err);
            setStatus('error');
            setStatusMsg('Could not reach the server. Please try again later.');
        }
    };

    return (
        <div className="min-h-screen bg-so-bg text-so-text-body pb-24">
            
            {/* Header / Breadcrumb */}
            <div className="border-b border-so-border bg-[#161616] py-8 px-4 sm:px-6">
                <div className="max-w-2xl mx-auto">
                    <div className="flex items-center gap-2 text-xs text-so-text-muted mb-3 font-mono">
                        <Link to="/home" className="hover:text-white transition-colors">Home</Link>
                        <span>/</span>
                        <span className="text-white font-medium">Feedback</span>
                    </div>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 rounded-md bg-[#202020] border border-so-border flex items-center justify-center shrink-0">
                            <MessageSquare className="w-4 h-4 text-white" />
                        </div>
                        <h1 className="text-2xl font-bold text-white tracking-tight">
                            Feedback & Suggestions
                        </h1>
                    </div>
                    <p className="text-xs sm:text-sm text-so-text-muted">
                        This is an independent personal project created for Aggie engineers. Any bug reports, feature suggestions, or study note corrections are greatly appreciated!
                    </p>
                </div>
            </div>

            {/* Form Section */}
            <main className="max-w-2xl mx-auto px-4 sm:px-6 pt-8">
                <div className="so-card p-6 sm:p-8 border-so-border shadow-so-lg">
                    
                    {error && (
                        <div className="mb-6 p-3 rounded-md bg-red-950/40 border border-red-800/50 text-red-300 text-xs flex items-center gap-2">
                            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                            <span>{error}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} noValidate className="space-y-5">
                        
                        {/* 2-column selects */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label 
                                    htmlFor="feedback-page" 
                                    className="block text-xs font-semibold text-white mb-1.5"
                                >
                                    Related Section / Course
                                </label>
                                <select
                                    id="feedback-page"
                                    value={page}
                                    onChange={(e) => setPage(e.target.value)}
                                    disabled={status === 'loading'}
                                    className="so-input"
                                >
                                    {PAGES.map((p) => (
                                        <option key={p.value} value={p.value} disabled={p.disabled} className="bg-so-card text-white">
                                            {p.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label 
                                    htmlFor="feedback-category" 
                                    className="block text-xs font-semibold text-white mb-1.5"
                                >
                                    Feedback Type
                                </label>
                                <select
                                    id="feedback-category"
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                    disabled={status === 'loading'}
                                    className="so-input"
                                >
                                    {CATEGORIES.map((c) => (
                                        <option key={c.value} value={c.value} className="bg-so-card text-white">
                                            {c.label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Message Textarea */}
                        <div>
                            <div className="flex items-center justify-between mb-1.5">
                                <label 
                                    htmlFor="feedback-message" 
                                    className="text-xs font-semibold text-white"
                                >
                                    Your Message
                                </label>
                                <span className={`text-[11px] font-mono ${message.length >= MAX_CHARS ? 'text-red-400 font-bold' : 'text-so-text-muted'}`}>
                                    {message.length} / {MAX_CHARS}
                                </span>
                            </div>
                            <textarea
                                id="feedback-message"
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                maxLength={MAX_CHARS}
                                disabled={status === 'loading'}
                                rows={6}
                                placeholder="Describe the bug, module question, or feature idea in detail..."
                                className="so-input resize-none"
                            />
                        </div>

                        {/* Status feedback banners */}
                        {status === 'success' && (
                            <div className="p-3 rounded-md bg-emerald-950/40 border border-emerald-800/50 text-emerald-300 text-xs flex items-center gap-2 animate-in fade-in">
                                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                                <span>{statusMsg}</span>
                            </div>
                        )}

                        {status === 'error' && (
                            <div className="p-3 rounded-md bg-red-950/40 border border-red-800/50 text-red-300 text-xs flex items-center gap-2 animate-in fade-in">
                                <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                                <span>{statusMsg}</span>
                            </div>
                        )}

                        {/* Action buttons */}
                        <div className="flex items-center justify-between pt-2">
                            <button
                                type="button"
                                onClick={() => navigate(-1)}
                                className="so-btn-outline text-xs"
                            >
                                Cancel
                            </button>

                            <button
                                id="feedback-submit"
                                type="submit"
                                disabled={status === 'loading' || status === 'success'}
                                className="so-btn-primary text-xs px-5"
                            >
                                {status === 'loading' ? (
                                    <>
                                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                        <span>Submitting...</span>
                                    </>
                                ) : status === 'success' ? (
                                    <>
                                        <CheckCircle2 className="w-3.5 h-3.5" />
                                        <span>Submitted!</span>
                                    </>
                                ) : (
                                    <>
                                        <Send className="w-3.5 h-3.5" />
                                        <span>Send Feedback</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </main>
        </div>
    );
};

export default FeedbackPage;