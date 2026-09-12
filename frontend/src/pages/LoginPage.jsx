import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Terminal, BookOpen, ShieldCheck, ArrowRight, CheckCircle2, Code2 } from 'lucide-react';
import { authClient } from '../scripts/auth';
import { enableDemoMode, isAuthorized } from '../scripts/demo';

const LoginPage = () => {
    const [user, setUser] = useState(null);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleGoogleSignIn = async () => {
        setIsLoading(true);
        setError(null);
        try {
            await authClient.signIn.social({
                provider: "google",
                callbackURL: window.location.origin,
            });
        } catch (err) {
            console.error("Google sign-in error:", err);
            setError("Sign-in failed. Please try again.");
            setIsLoading(false);
        }
    };

    const handleSignOut = async () => {
        try {
            await authClient.signOut();
            setUser(null);
        } catch (err) {
            console.error("Sign-out error:", err);
        }
    };

    useEffect(() => {
        // Demo mode check
        const params = new URLSearchParams(window.location.search);
        const token = params.get('demo');
        if (token && token === import.meta.env.VITE_DEMO_TOKEN) {
            enableDemoMode();
            navigate('/home');
            return;
        }

        // Auth session check
        authClient.getSession().then(({ data }) => {
            if (data?.user) {
                if (isAuthorized(data.user.email)) {
                    setUser(data.user);
                    navigate('/home');
                } else {
                    console.log("Not a TAMU student:", data.user.email);
                    setError("Access restricted. Please sign in with your @tamu.edu student email.");
                    authClient.signOut();
                }
            }
        }).catch((err) => console.error(err));
    }, [navigate]);

    return (
        <div className="min-h-screen flex flex-col justify-between bg-so-bg text-so-text-body px-4 py-8">
            {/* Header branding */}
            <header className="max-w-4xl mx-auto w-full flex items-center justify-between py-4 border-b border-so-border">
                <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded bg-[#500000] border border-[#6b0000] flex items-center justify-center">
                        <span className="text-white font-bold text-base tracking-tighter">≡</span>
                    </div>
                    <div>
                        <div className="font-semibold text-white tracking-tight text-sm">
                            ENGR Study Helper
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Institutional Portal Card */}
            <main className="max-w-lg mx-auto w-full my-auto py-8">
                <div className="so-card p-6 sm:p-8 border-so-border shadow-so-md">
                    
                    {/* Header Details */}
                    <div className="border-b border-so-border pb-5 mb-6">
                        <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                            Student Authentication
                        </h1>
                    </div>

                    {error && (
                        <div className="mb-5 p-3 rounded bg-red-950/40 border border-red-800/50 text-red-300 text-xs flex items-start gap-2">
                            <ShieldCheck className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                            <div>{error}</div>
                        </div>
                    )}

                    {user ? (
                        <div className="space-y-4 text-center">
                            <div className="p-3 bg-so-surface border border-so-border rounded text-xs text-white">
                                Active session: <strong className="text-white font-mono">{user.email}</strong>
                            </div>
                            <div className="flex gap-2">
                                <button 
                                    onClick={() => navigate('/home')} 
                                    className="so-btn-primary flex-1"
                                >
                                    <span>Enter Study Guide</span>
                                    <ArrowRight className="w-3.5 h-3.5" />
                                </button>
                                <button 
                                    onClick={handleSignOut} 
                                    className="so-btn-secondary"
                                >
                                    Sign Out
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-5">
                            <button
                                onClick={handleGoogleSignIn}
                                disabled={isLoading}
                                className="w-full flex items-center justify-center gap-3 py-2 px-4 rounded-md text-xs font-semibold text-white bg-[#222222] hover:bg-[#2b2b2b] active:bg-[#1a1a1a] border border-so-border shadow-so-sm transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#800000] disabled:opacity-50 group"
                            >
                                <svg className="w-4 h-4" viewBox="0 0 24 24">
                                    <path
                                        fill="#4285F4"
                                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                    />
                                    <path
                                        fill="#34A853"
                                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                    />
                                    <path
                                        fill="#FBBC05"
                                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                                    />
                                    <path
                                        fill="#EA4335"
                                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                                    />
                                </svg>
                                <span>{isLoading ? 'Verifying authentication...' : 'Sign in with your TAMU email'}</span>
                            </button>
                        </div>
                    )}
                </div>
            </main>

            {/* Institutional Disclaimer Footer */}
            <footer className="max-w-2xl mx-auto text-center text-xs text-so-text-muted py-4 space-y-1">
                <p>
                    Supplemental engineering study tool developed for Texas A&M ENGR 102 students.
                </p>
                <p className="text-[11px] text-so-text-muted/60">
                    Not affiliated with or officially endorsed by Texas A&M University.
                </p>
            </footer>
        </div>
    );
};

export default LoginPage;