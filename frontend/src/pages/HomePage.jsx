import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { GraduationCap, Compass, ArrowRight } from 'lucide-react';
import { authClient } from '../scripts/auth';
import { isAuthorized, isDemoMode } from '../scripts/demo';

const HomePage = () => {
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

    const displayName = user?.name || (isDemoMode() ? "Engineering Aggie" : "Student");

    return (
        <div className="min-h-[calc(100vh-3.5rem)] bg-so-bg text-so-text-body flex flex-col justify-center items-center px-4 py-12">
            <div className="max-w-2xl w-full">
                {/* Header */}
                <div className="text-center mb-8">
                    {/* <div className="inline-block text-[11px] font-semibold text-white/50 tracking-wider uppercase mb-1.5">
                        Texas A&M University
                    </div> */}
                    <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                        Select Subject
                    </h1>
                    <p className="text-xs sm:text-sm text-so-text-muted mt-2">
                        Welcome, {displayName}. Choose a course to access study materials and practice tools.
                    </p>
                </div>

                {/* Course Selection Buttons */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* ENGR 102 Button */}
                    <button
                        onClick={() => navigate('/engr102')}
                        className="so-card p-6 border-so-border hover:border-[#500000] hover:bg-[#1a1a1a] active:scale-[0.99] transition-all text-left flex flex-col justify-between group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#800000] cursor-pointer"
                    >
                        <div>
                            <div className="w-11 h-11 rounded-lg bg-[#222222] border border-so-border flex items-center justify-center mb-4 text-white group-hover:border-[#500000] group-hover:bg-[#500000]/20 transition-colors">
                                <GraduationCap className="w-5 h-5 text-white" />
                            </div>

                            <div className="text-lg font-bold text-white group-hover:text-white transition-colors">
                                ENGR 102
                            </div>
                            <div className="text-xs text-so-text-muted mt-1">
                                Engineering Lab I - Computation
                            </div>
                        </div>

                        <div className="mt-8 pt-4 border-t border-so-borderSubtle flex items-center justify-between text-xs font-semibold text-white">
                            <span>Open ENGR 102</span>
                            <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                        </div>
                    </button>

                    {/* ETAM Button */}
                    <div
                        className="so-card p-6 border-so-border bg-[#181818]/60 opacity-60 text-left flex flex-col justify-between cursor-not-allowed select-none"
                    >
                        <div>
                            <div className="w-11 h-11 rounded-lg bg-[#222222] border border-so-border flex items-center justify-center mb-4 text-so-text-muted">
                                <Compass className="w-5 h-5 text-so-text-muted" />
                            </div>

                            <div className="text-lg font-bold text-white/80">
                                ETAM
                            </div>
                            <div className="text-xs text-so-text-muted mt-1">
                                Entry to a Major Resources
                            </div>
                        </div>

                        <div className="mt-8 pt-4 border-t border-so-borderSubtle flex items-center justify-between text-xs font-medium text-so-text-muted">
                            <span>Coming Soon</span>
                            <span className="text-[10px] px-2 py-0.5 rounded bg-[#202020] border border-so-border">In Development</span>
                        </div>
                    </div>
                </div>

                {error && (
                    <div className="mt-6 p-3 rounded bg-red-950/40 border border-red-800 text-xs text-red-200 text-center">
                        {error}
                    </div>
                )}
            </div>
        </div>
    );
};

export default HomePage;