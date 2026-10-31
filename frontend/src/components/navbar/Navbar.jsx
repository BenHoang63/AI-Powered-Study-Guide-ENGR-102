import { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
    ChevronLeft, 
    ChevronDown, 
    Home, 
    Layers, 
    BarChart3, 
    MessageSquare, 
    Menu, 
    X,
    GraduationCap,
    LogOut,
    Sun,
    Moon
} from 'lucide-react';
import { authClient } from '../../scripts/auth';
import { isDemoMode } from '../../scripts/demo';

const BACK_ROUTES = {
    '/engr102/module': '/engr102',
    '/engr102/exam': '/engr102',
    '/engr102/topicquizzer': '/engr102',
};

function getBackRoute(pathname) {
    for (const [prefix, target] of Object.entries(BACK_ROUTES)) {
        if (pathname.startsWith(prefix)) return target;
    }
    return null;
}

const Navbar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [userEmail, setUserEmail] = useState(null);
    const [theme, setTheme] = useState(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('theme');
            if (saved) return saved;
            return document.documentElement.classList.contains('dark') ? 'dark' : 'light';
        }
        return 'dark';
    });
    const dropdownRef = useRef(null);

    const backRoute = getBackRoute(location.pathname);

    // Sync theme class and persistence
    useEffect(() => {
        const root = document.documentElement;
        if (theme === 'dark') {
            root.classList.add('dark');
            root.classList.remove('light');
        } else {
            root.classList.remove('dark');
            root.classList.add('light');
        }
        try {
            localStorage.setItem('theme', theme);
            window.dispatchEvent(new Event('theme-change'));
        } catch (e) {}
    }, [theme]);

    useEffect(() => {
        const handleSync = () => {
            const current = localStorage.getItem('theme') || (document.documentElement.classList.contains('dark') ? 'dark' : 'light');
            setTheme(current);
        };
        window.addEventListener('storage', handleSync);
        window.addEventListener('theme-change', handleSync);
        return () => {
            window.removeEventListener('storage', handleSync);
            window.removeEventListener('theme-change', handleSync);
        };
    }, []);

    const toggleTheme = () => {
        setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
    };

    // Fetch session for subtle user indicator
    useEffect(() => {
        authClient.getSession().then(({ data }) => {
            if (data?.user?.email) {
                setUserEmail(data.user.email);
            } else if (isDemoMode()) {
                setUserEmail('demo@tamu.edu');
            }
        }).catch(() => {});
    }, [location.pathname]);

    // Close dropdown on click outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Close mobile menu when route changes
    useEffect(() => {
        setMobileMenuOpen(false);
        setDropdownOpen(false);
    }, [location.pathname]);

    const handleSignOut = async () => {
        try {
            sessionStorage.removeItem('engr102_demo_mode');
            await authClient.signOut();
        } catch (e) {
            console.error(e);
        }
        navigate('/');
    };

    const isActive = (path) => location.pathname === path;

    return (
        <>
            <header className="sticky top-0 left-0 w-full z-50 bg-[#161616] border-b border-so-border">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
                    
                    {/* Left side: Back Button & Logo */}
                    <div className="flex items-center gap-3">
                        {backRoute && (
                            <button
                                onClick={() => navigate(backRoute)}
                                className="inline-flex items-center gap-1 text-xs font-medium text-slate-700 dark:text-white/90 hover:text-slate-900 dark:hover:text-white bg-so-surface hover:bg-so-hover border border-so-border rounded px-2.5 py-1.5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#990000]"
                                title="Back to previous page"
                            >
                                <ChevronLeft className="w-4 h-4 text-slate-700 dark:text-white" />
                                <span>Back</span>
                            </button>
                        )}

                        <button 
                            onClick={() => navigate('/home')}
                            className="flex items-center gap-2.5 text-left group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#990000] rounded p-1"
                        >
                            {/* <div className="w-7 h-7 rounded bg-[#990000] border border-[#b30000]/50 flex items-center justify-center transition-colors">
                                <span className="text-white font-bold text-sm tracking-tighter">≡</span>
                            </div> */}
                            <div>
                                <div className="text-sm font-semibold text-white tracking-tight">
                                    ENGR Study Helper
                                </div>
                            </div>
                        </button>
                    </div>

                    {/* Center: Desktop Nav Links */}
                    <nav className="hidden md:flex items-center gap-1">
                        <button
                            onClick={() => navigate('/home')}
                            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors flex items-center gap-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#990000] ${
                                isActive('/home')
                                    ? 'bg-[#990000]/15 dark:bg-[#990000]/25 text-[#990000] dark:text-white border border-[#990000]/40 dark:border-[#990000]/60 shadow-sm font-semibold'
                                    : 'text-slate-600 dark:text-zinc-200 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-so-surface/70'
                            }`}
                        >
                            {/* <Home className="w-3.5 h-3.5" /> */}
                            <span>Home</span>
                        </button>

                        {/* Pages Dropdown */}
                        <div className="relative" ref={dropdownRef}>
                            <button
                                onClick={() => setDropdownOpen(!dropdownOpen)}
                                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors flex items-center gap-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#990000] ${
                                    location.pathname.startsWith('/engr102')
                                        ? 'bg-[#990000]/15 dark:bg-[#990000]/25 text-[#990000] dark:text-white border border-[#990000]/40 dark:border-[#990000]/60 shadow-sm font-semibold'
                                        : 'text-slate-600 dark:text-zinc-200 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-so-surface/70'
                                }`}
                            >
                                {/* <Layers className="w-3.5 h-3.5" /> */}
                                <span>Courses</span>
                                <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} />
                            </button>

                            {dropdownOpen && (
                                <div className="absolute top-full left-0 mt-1.5 w-52 bg-white dark:bg-[#1c1c1c] border border-slate-200 dark:border-so-border rounded-md shadow-so-md py-1.5 z-50">
                                    <div className="px-3 py-1 text-[11px] font-semibold text-slate-400 dark:text-so-text-muted uppercase tracking-wider">
                                        Active Course
                                    </div>
                                    <button
                                        onClick={() => { navigate('/engr102'); setDropdownOpen(false); }}
                                        className="w-full text-left px-3 py-2 text-xs text-slate-800 dark:text-white hover:bg-slate-100 dark:hover:bg-so-hover hover:text-slate-900 dark:hover:text-white flex items-center justify-between transition-colors"
                                    >
                                        <div className="flex items-center gap-2">
                                            {/* <GraduationCap className="w-4 h-4 text-white" /> */}
                                            <div>
                                                <div className="font-medium">ENGR 102</div>
                                                <div className="text-[10px] text-slate-500 dark:text-so-text-muted">Engineering Lab I</div>
                                            </div>
                                        </div>
                                    </button>

                                    <div className="my-1 border-t border-slate-200 dark:border-so-borderSubtle" />

                                    <div className="px-3 py-1 text-[11px] font-semibold text-slate-400 dark:text-so-text-muted uppercase tracking-wider">
                                        Upcoming
                                    </div>
                                    <div className="px-3 py-2 text-xs text-slate-400 dark:text-so-text-muted flex items-center justify-between cursor-not-allowed opacity-70">
                                        <span>ETAM Preparation</span>
                                    </div>
                                </div>
                            )}
                        </div>

                        <button
                            onClick={() => navigate('/userprofile')}
                            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors flex items-center gap-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#990000] ${
                                isActive('/userprofile')
                                    ? 'bg-[#990000]/15 dark:bg-[#990000]/25 text-[#990000] dark:text-white border border-[#990000]/40 dark:border-[#990000]/60 shadow-sm font-semibold'
                                    : 'text-slate-600 dark:text-zinc-200 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-so-surface/70'
                            }`}
                        >
                            {/* <BarChart3 className="w-3.5 h-3.5" /> */}
                            <span>Progress</span>
                        </button>

                        <button
                            onClick={() => navigate('/feedback')}
                            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors flex items-center gap-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#990000] ${
                                isActive('/feedback')
                                    ? 'bg-[#990000]/15 dark:bg-[#990000]/25 text-[#990000] dark:text-white border border-[#990000]/40 dark:border-[#990000]/60 shadow-sm font-semibold'
                                    : 'text-slate-600 dark:text-zinc-200 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-so-surface/70'
                            }`}
                        >
                            {/* <MessageSquare className="w-3.5 h-3.5" /> */}
                            <span>Feedback</span>
                        </button>
                    </nav>

                    {/* Right: User Status & Sign Out */}
                    <div className="hidden sm:flex items-center gap-2">
                        {userEmail && (
                            <button
                                onClick={() => navigate('/account')}
                                className={`flex items-center gap-2 text-xs px-2.5 py-1 rounded border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#990000] cursor-pointer ${
                                    isActive('/account')
                                        ? 'bg-[#990000]/15 dark:bg-[#990000]/25 text-[#990000] dark:text-white border-[#990000]/40 dark:border-[#990000]/60 shadow-sm font-semibold'
                                        : 'text-so-text-muted hover:text-slate-900 dark:hover:text-white bg-so-surface hover:bg-so-hover border-so-border'
                                }`}
                                title="Account Settings"
                            >
                                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                <span className="max-w-[150px] truncate text-so-text-body">{userEmail}</span>
                            </button>
                        )}
                        <button
                            onClick={toggleTheme}
                            className="p-1.5 text-so-text-muted hover:text-white bg-so-surface hover:bg-so-hover rounded border border-so-border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#990000]"
                            title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
                            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
                        >
                            {theme === 'dark' ? (
                                <Sun className="w-4 h-4 text-amber-400" />
                            ) : (
                                <Moon className="w-4 h-4 text-indigo-400" />
                            )}
                        </button>
                        <button
                            onClick={handleSignOut}
                            className="p-1.5 text-so-text-muted hover:text-so-red hover:bg-so-surface rounded transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-so-red"
                            title="Sign out"
                        >
                            <LogOut className="w-4 h-4" />
                        </button>
                    </div>

                    {/* Mobile Hamburger Button */}
                    <div className="flex md:hidden items-center gap-2">
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="p-1.5 text-so-text-body hover:text-white hover:bg-so-surface rounded border border-so-border"
                        >
                            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                        </button>
                    </div>
                </div>

                {/* Mobile Dropdown Drawer */}
                {mobileMenuOpen && (
                    <div className="md:hidden bg-so-card border-b border-so-border px-4 py-3 space-y-2 animate-in slide-in-from-top-2">
                        <button
                            onClick={() => navigate('/home')}
                            className="w-full text-left px-3 py-2 text-sm text-slate-800 dark:text-so-text-bright hover:bg-slate-100 dark:hover:bg-so-hover rounded flex items-center gap-2"
                        >
                            <Home className="w-4 h-4 text-slate-700 dark:text-white" />
                            <span>Home</span>
                        </button>
                        <button
                            onClick={() => navigate('/engr102')}
                            className="w-full text-left px-3 py-2 text-sm text-slate-800 dark:text-so-text-bright hover:bg-slate-100 dark:hover:bg-so-hover rounded flex items-center gap-2"
                        >
                            <GraduationCap className="w-4 h-4 text-slate-700 dark:text-white" />
                            <span>ENGR 102 Portal</span>
                        </button>
                        <button
                            onClick={() => navigate('/userprofile')}
                            className="w-full text-left px-3 py-2 text-sm text-slate-800 dark:text-so-text-bright hover:bg-slate-100 dark:hover:bg-so-hover rounded flex items-center gap-2"
                        >
                            <BarChart3 className="w-4 h-4 text-slate-700 dark:text-white" />
                            <span>User Progress</span>
                        </button>
                        <button
                            onClick={() => navigate('/feedback')}
                            className="w-full text-left px-3 py-2 text-sm text-slate-800 dark:text-so-text-bright hover:bg-slate-100 dark:hover:bg-so-hover rounded flex items-center gap-2"
                        >
                            <MessageSquare className="w-4 h-4 text-slate-700 dark:text-white" />
                            <span>Feedback</span>
                        </button>
                        <div className="pt-2 border-t border-so-border flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => {
                                        setMobileMenuOpen(false);
                                        navigate('/account');
                                    }}
                                    className="text-xs text-so-text-muted hover:text-slate-900 dark:hover:text-white truncate max-w-[170px] text-left underline-offset-2 hover:underline cursor-pointer"
                                    title="Account Settings"
                                >
                                    {userEmail}
                                </button>
                                <button
                                    onClick={toggleTheme}
                                    className="p-1 text-so-text-muted hover:text-white bg-so-surface hover:bg-so-hover rounded border border-so-border transition-colors"
                                    title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
                                    aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
                                >
                                    {theme === 'dark' ? (
                                        <Sun className="w-3.5 h-3.5 text-amber-400" />
                                    ) : (
                                        <Moon className="w-3.5 h-3.5 text-indigo-400" />
                                    )}
                                </button>
                            </div>
                            <button
                                onClick={handleSignOut}
                                className="text-xs text-so-red hover:underline flex items-center gap-1"
                            >
                                <LogOut className="w-3.5 h-3.5" />
                                <span>Sign Out</span>
                            </button>
                        </div>
                        <div className="pt-2 border-t border-so-borderSubtle flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-[11px] text-zinc-400">
                            <button onClick={() => navigate('/privacy-policy')} className="text-zinc-300 hover:text-white underline underline-offset-2">
                                Privacy Policy
                            </button>
                            <span>•</span>
                            <button onClick={() => navigate('/cookie-policy')} className="text-zinc-300 hover:text-white underline underline-offset-2">
                                Cookie Policy
                            </button>
                            <span>•</span>
                            <button onClick={() => navigate('/terms-and-conditions')} className="text-zinc-300 hover:text-white underline underline-offset-2">
                                Terms & Conditions
                            </button>
                        </div>
                    </div>
                )}
            </header>
        </>
    );
};

export default Navbar;
