import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authClient } from '../scripts/auth';
import { isAuthorized, isDemoMode } from '../scripts/demo';
import Footer from '../components/Footer.jsx';

const AccountPage = () => {
    const [user, setUser] = useState(null);
    const [confirmEmail, setConfirmEmail] = useState('');
    const [isDeleting, setIsDeleting] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        authClient.getSession().then(({ data }) => {
            if (data?.user) {
                if (isAuthorized(data.user.email)) {
                    setUser(data.user);
                } else {
                    authClient.signOut();
                    navigate('/');
                }
            } else if (!isDemoMode()) {
                navigate('/');
            } else {
                setUser({
                    name: 'Engineering Aggie',
                    email: 'engineeringaggie@tamu.edu'
                });
            }
        }).catch((err) => {
            console.error('Session error:', err);
            if (!isDemoMode()) navigate('/');
        });
    }, [navigate]);

    const userEmail = user?.email || (isDemoMode() ? 'demo@tamu.edu' : '');
    const userName = user?.name || (isDemoMode() ? 'Demo' : 'Student');
    const isEmailMatched = confirmEmail.trim().toLowerCase() === userEmail.toLowerCase() && userEmail.length > 0;

    const handleDeleteAccount = async () => {
        if (!isEmailMatched || isDeleting) return;

        setIsDeleting(true);
        setError(null);

        try {
            const res = await fetch('/api/account', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: userEmail })
            });

            if (!res.ok) {
                const data = await res.json().catch(() => ({}));
                throw new Error(data.error || 'Failed to delete account. Please try again.');
            }

            // Successfully deleted data from backend; sign out and redirect
            await authClient.signOut();
            navigate('/');
        } catch (err) {
            console.error('Error deleting account:', err);
            setError(err.message || 'An error occurred while deleting your account.');
            setIsDeleting(false);
        }
    };

    return (
        <div className="min-h-screen bg-so-bg text-so-text-body flex flex-col justify-between">
            {/* Header / Breadcrumb */}
            <div className="border-b border-so-border bg-[#161616] py-8 px-4 sm:px-6">
                <div className="max-w-2xl mx-auto">
                    <div className="flex items-center gap-2 text-xs text-so-text-muted mb-3 font-mono">
                        <Link to="/home" className="hover:text-slate-900 dark:hover:text-white transition-colors">Home</Link>
                        <span>/</span>
                        <span className="text-white font-medium">Account</span>
                    </div>
                    <h1 className="text-2xl font-bold text-white tracking-tight">
                        Account Settings
                    </h1>
                    <p className="text-xs sm:text-sm text-so-text-muted mt-1">
                        Manage your profile information and data privacy preferences.
                    </p>
                </div>
            </div>

            {/* Main Content */}
            <main className="max-w-2xl mx-auto w-full px-4 sm:px-6 pt-8 space-y-6">
                {/* Profile Information Card */}
                <div className="so-card p-6 border-so-border">
                    <h2 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
                        Profile Information
                    </h2>
                    <div className="space-y-3 text-xs">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between py-2 border-b border-so-borderSubtle">
                            <span className="text-so-text-muted">Display Name</span>
                            <span className="text-white font-medium mt-1 sm:mt-0">{userName}</span>
                        </div>
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between py-2 border-b border-so-borderSubtle">
                            <span className="text-so-text-muted">Email Address</span>
                            <span className="text-white font-mono mt-1 sm:mt-0">{userEmail}</span>
                        </div>
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between py-2">
                            <span className="text-so-text-muted">Status</span>
                            <span className="text-emerald-400 font-medium">Active</span>
                        </div>
                    </div>
                </div>

                {/* Data & Privacy Card */}
                <div className="so-card p-6 border-so-border">
                    <h2 className="text-sm font-bold text-white uppercase tracking-wider mb-3">
                        Data & Privacy
                    </h2>
                    <p className="text-xs text-so-text-muted leading-relaxed mb-4">
                        We retain study activity associated with your email (topic quiz progress, problem attempts, accuracy stats, and feedback submissions) to personalize your study helper experience. You can review our policies below.
                    </p>
                    <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs">
                        <Link to="/privacy-policy" className="text-zinc-300 hover:text-white underline underline-offset-2 transition-colors">
                            Privacy Policy
                        </Link>
                        <Link to="/cookie-policy" className="text-zinc-300 hover:text-white underline underline-offset-2 transition-colors">
                            Cookie Policy
                        </Link>
                        <Link to="/terms-and-conditions" className="text-zinc-300 hover:text-white underline underline-offset-2 transition-colors">
                            Terms & Conditions
                        </Link>
                    </div>
                </div>

                {/* Danger Zone: Delete Account */}
                <div className="so-card p-6 border-red-900/40 bg-red-950/10">
                    <h2 className="text-sm font-bold text-red-400 uppercase tracking-wider mb-2">
                        Delete Account
                    </h2>
                    <p className="text-xs text-so-text-muted leading-relaxed mb-4">
                        Permanently deletes your account and all associated records, including topic quiz progress, question attempts, accuracy metrics, and feedback entries. This action is irreversible.
                    </p>

                    {error && (
                        <div className="mb-4 p-3 rounded bg-red-950/40 border border-red-800 text-xs text-red-200">
                            {error}
                        </div>
                    )}

                    <div className="space-y-3 pt-2">
                        <label className="block text-xs text-so-text-muted">
                            To confirm deletion, type your email address <span className="font-mono text-white select-all">({userEmail})</span>:
                        </label>
                        <input
                            type="email"
                            value={confirmEmail}
                            onChange={(e) => setConfirmEmail(e.target.value)}
                            placeholder={userEmail}
                            className="so-input"
                            autoComplete="off"
                            disabled={isDeleting}
                        />
                        <div className="pt-2">
                            <button
                                onClick={handleDeleteAccount}
                                disabled={!isEmailMatched || isDeleting}
                                className="so-btn-danger"
                            >
                                {isDeleting ? 'Deleting Account...' : 'Permanently Delete Account'}
                            </button>
                        </div>
                    </div>
                </div>
            </main>

            <Footer className="mt-12" />
        </div>
    );
};

export default AccountPage;
