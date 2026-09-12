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
    LogOut
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
    const dropdownRef = useRef(null);

    const backRoute = getBackRoute(location.pathname);

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
                                className="inline-flex items-center gap-1 text-xs font-medium text-so-text-body hover:text-white bg-so-surface hover:bg-so-hover border border-so-border rounded px-2.5 py-1.5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#800000]"
                                title="Back to previous page"
                            >
                                <ChevronLeft className="w-4 h-4 text-white" />
                                <span>Back</span>
                            </button>
                        )}

                        <button 
                            onClick={() => navigate('/home')}
                            className="flex items-center gap-2.5 text-left group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#800000] rounded p-1"
                        >
                            <div className="w-7 h-7 rounded bg-[#500000] border border-[#6b0000] flex items-center justify-center transition-colors">
                                <span className="text-white font-bold text-sm tracking-tighter">≡</span>
                            </div>
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
                            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors flex items-center gap-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#800000] ${
                                isActive('/home')
                                    ? 'bg-[#500000]/25 text-white border border-[#7a0000]/60'
                                    : 'text-so-text-body hover:text-white hover:bg-so-surface/70'
                            }`}
                        >
                            <Home className="w-3.5 h-3.5" />
                            <span>Home</span>
                        </button>

                        {/* Pages Dropdown */}
                        <div className="relative" ref={dropdownRef}>
                            <button
                                onClick={() => setDropdownOpen(!dropdownOpen)}
                                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors flex items-center gap-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#800000] ${
                                    location.pathname.startsWith('/engr102')
                                        ? 'bg-[#500000]/25 text-white border border-[#7a0000]/60'
                                        : 'text-so-text-body hover:text-white hover:bg-so-surface/70'
                                }`}
                            >
                                <Layers className="w-3.5 h-3.5" />
                                <span>Courses</span>
                                <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${dropdownOpen ? 'rotate-180 text-white' : ''}`} />
                            </button>

                            {dropdownOpen && (
                                <div className="absolute top-full left-0 mt-1.5 w-52 bg-[#1c1c1c] border border-so-border rounded-md shadow-so-md py-1.5 z-50">
                                    <div className="px-3 py-1 text-[11px] font-semibold text-so-text-muted uppercase tracking-wider">
                                        Active Course
                                    </div>
                                    <button
                                        onClick={() => { navigate('/engr102'); setDropdownOpen(false); }}
                                        className="w-full text-left px-3 py-2 text-xs text-white hover:bg-so-hover hover:text-white flex items-center justify-between transition-colors"
                                    >
                                        <div className="flex items-center gap-2">
                                            <GraduationCap className="w-4 h-4 text-white" />
                                            <div>
                                                <div className="font-medium">ENGR 102</div>
                                                <div className="text-[10px] text-so-text-muted">Engineering Lab I</div>
                                            </div>
                                        </div>
                                    </button>

                                    <div className="my-1 border-t border-so-borderSubtle" />

                                    <div className="px-3 py-1 text-[11px] font-semibold text-so-text-muted uppercase tracking-wider">
                                        Upcoming
                                    </div>
                                    <div className="px-3 py-2 text-xs text-so-text-muted flex items-center justify-between cursor-not-allowed opacity-70">
                                        <span>ETAM Preparation</span>
                                    </div>
                                </div>
                            )}
                        </div>

                        <button
                            onClick={() => navigate('/userprofile')}
                            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors flex items-center gap-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#800000] ${
                                isActive('/userprofile')
                                    ? 'bg-[#500000]/25 text-white border border-[#7a0000]/60'
                                    : 'text-so-text-body hover:text-white hover:bg-so-surface/70'
                            }`}
                        >
                            <BarChart3 className="w-3.5 h-3.5" />
                            <span>Progress</span>
                        </button>

                        <button
                            onClick={() => navigate('/feedback')}
                            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors flex items-center gap-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#800000] ${
                                isActive('/feedback')
                                    ? 'bg-[#500000]/25 text-white border border-[#7a0000]/60'
                                    : 'text-so-text-body hover:text-white hover:bg-so-surface/70'
                            }`}
                        >
                            <MessageSquare className="w-3.5 h-3.5" />
                            <span>Feedback</span>
                        </button>
                    </nav>

                    {/* Right: User Status & Sign Out */}
                    <div className="hidden sm:flex items-center gap-2">
                        {userEmail && (
                            <div className="flex items-center gap-2 text-xs text-so-text-muted bg-so-surface px-2.5 py-1 rounded border border-so-border">
                                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                <span className="max-w-[150px] truncate text-so-text-body">{userEmail}</span>
                            </div>
                        )}
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
                            className="w-full text-left px-3 py-2 text-sm text-so-text-bright hover:bg-so-hover rounded flex items-center gap-2"
                        >
                            <Home className="w-4 h-4 text-white" />
                            <span>Home</span>
                        </button>
                        <button
                            onClick={() => navigate('/engr102')}
                            className="w-full text-left px-3 py-2 text-sm text-so-text-bright hover:bg-so-hover rounded flex items-center gap-2"
                        >
                            <GraduationCap className="w-4 h-4 text-white" />
                            <span>ENGR 102 Portal</span>
                        </button>
                        <button
                            onClick={() => navigate('/userprofile')}
                            className="w-full text-left px-3 py-2 text-sm text-so-text-bright hover:bg-so-hover rounded flex items-center gap-2"
                        >
                            <BarChart3 className="w-4 h-4 text-white" />
                            <span>User Progress</span>
                        </button>
                        <button
                            onClick={() => navigate('/feedback')}
                            className="w-full text-left px-3 py-2 text-sm text-so-text-bright hover:bg-so-hover rounded flex items-center gap-2"
                        >
                            <MessageSquare className="w-4 h-4 text-white" />
                            <span>Feedback</span>
                        </button>
                        <div className="pt-2 border-t border-so-border flex items-center justify-between">
                            <span className="text-xs text-so-text-muted truncate max-w-[200px]">{userEmail}</span>
                            <button
                                onClick={handleSignOut}
                                className="text-xs text-so-red hover:underline flex items-center gap-1"
                            >
                                <LogOut className="w-3.5 h-3.5" />
                                <span>Sign Out</span>
                            </button>
                        </div>
                    </div>
                )}
            </header>
        </>
    );
};

export default Navbar;
