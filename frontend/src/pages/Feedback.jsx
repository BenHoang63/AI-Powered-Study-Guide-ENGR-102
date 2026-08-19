import { authClient } from '../scripts/auth';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/styles.css';
import '../styles/feedback.css';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';

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
                if (data.user.email?.includes('@tamu.edu')) {
                    setUser(data.user);
                } else {
                    setError('Please sign in with your @tamu.edu email.');
                    authClient.signOut();
                }
            } else {
                navigate('/');
            }
        });
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!message.trim()) {
            setStatus('error');
            setStatusMsg('Please enter a message before submitting.');
            return;
        }

        setStatus('loading');
        setStatusMsg('');

        try {
            const res = await fetch(`${BACKEND_URL}/api/feedback`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    user_email: user?.email,
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
                setStatusMsg('Thank you! Your feedback has been submitted.');
                setMessage('');
                setCategory('general');
                setPage('engr102');
            }
        } catch (err) {
            setStatus('error');
            setStatusMsg('Could not reach the server. Please try again later.');
        }
    };

    return (
        <div className="feedback-page">
            <div className="feedback-container">
                <h1 className="feedback-title">Feedback</h1>
                <p className="feedback-subtitle">
                    Yo wsg
                </p>
                <p className='feedback-subtitle'>
                    This is a solo project and it would be helpful to get feedback 🥺
                </p>
                <p className='feedback-subtitle'>
                    Any bugs, suggestions, etc. would help me alot. thanks
                </p>

                {error && <p className="feedback-banner feedback-banner--error">{error}</p>}

                <form className="feedback-form" onSubmit={handleSubmit} noValidate>

                    {/* Related Page */}
                    <label className="feedback-label" htmlFor="feedback-page">
                        Related Page
                    </label>
                    <select
                        id="feedback-page"
                        className="feedback-select"
                        value={page}
                        onChange={e => setPage(e.target.value)}
                        disabled={status === 'loading'}
                    >
                        {PAGES.map(p => (
                            <option key={p.value} value={p.value} disabled={p.disabled}>{p.label}</option>
                        ))}
                    </select>

                    {/* Category */}
                    <label className="feedback-label" htmlFor="feedback-category">
                        Category
                    </label>
                    <select
                        id="feedback-category"
                        className="feedback-select"
                        value={category}
                        onChange={e => setCategory(e.target.value)}
                        disabled={status === 'loading'}
                    >
                        {CATEGORIES.map(c => (
                            <option key={c.value} value={c.value}>{c.label}</option>
                        ))}
                    </select>

                    {/* Message */}
                    <label className="feedback-label" htmlFor="feedback-message">
                        Message
                    </label>
                    <textarea
                        id="feedback-message"
                        className="feedback-textarea"
                        placeholder="Describe the issue or share your thoughts..."
                        value={message}
                        onChange={e => setMessage(e.target.value)}
                        disabled={status === 'loading'}
                        rows={6}
                    />

                    {/* Status banner */}
                    {status === 'success' && (
                        <p className="feedback-banner feedback-banner--success">{statusMsg}</p>
                    )}
                    {status === 'error' && (
                        <p className="feedback-banner feedback-banner--error">{statusMsg}</p>
                    )}

                    <button
                        id="feedback-submit"
                        type="submit"
                        className="feedback-submit-btn"
                        disabled={status === 'loading' || status === 'success'}
                    >
                        {status === 'loading' ? 'Submitting...' : status === 'success' ? 'Submitted ✓' : 'Submit Feedback'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default FeedbackPage;