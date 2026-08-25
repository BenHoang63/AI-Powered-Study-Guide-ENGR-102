import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

// Define which pages get a back button and where it goes
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

    const backRoute = getBackRoute(location.pathname);

    return (
        <>
            <nav style={{
                padding: '10px 20px',
                borderBottom: '1px solid #333',
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                zIndex: 1000,
                background: '#1a1a1a',
                boxSizing: 'border-box',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
            }}>
                {/* Left: Back button (only shown when applicable) */}
                <div style={{ width: '140px' }}>
                    {backRoute && (
                        <button
                            onClick={() => navigate(backRoute)}
                            style={{
                                cursor: 'pointer',
                                background: 'none',
                                border: '1px solid #666',
                                borderRadius: '4px',
                                color: 'white',
                                padding: '6px 14px',
                                fontSize: '0.9rem',
                            }}
                        >
                            ← Back
                        </button>
                    )}
                </div>

                {/* Center / Right: Nav links */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <button
                        onClick={() => navigate('/home')}
                        style={{
                            cursor: 'pointer',
                            background: 'none',
                            border: 'none',
                            color: 'white',
                            fontSize: '0.95rem',
                            padding: '6px 10px',
                        }}
                    >
                        Home
                    </button>

                    {/* Pages dropdown */}
                    <div style={{ position: 'relative' }}>
                        <button
                            onClick={() => setDropdownOpen(!dropdownOpen)}
                            style={{
                                cursor: 'pointer',
                                background: 'none',
                                border: 'none',
                                color: 'white',
                                fontSize: '0.95rem',
                                padding: '6px 10px',
                            }}
                        >
                            Pages ▾
                        </button>

                        {dropdownOpen && (
                            <div style={{
                                position: 'absolute',
                                top: '100%',
                                left: 0,
                                background: '#2a2a2a',
                                border: '1px solid #444',
                                borderRadius: '4px',
                                minWidth: '140px',
                                marginTop: '4px',
                            }}>
                                <button
                                    onClick={() => { navigate('/engr102'); setDropdownOpen(false); }}
                                    style={{
                                        display: 'block',
                                        width: '100%',
                                        padding: '8px 14px',
                                        background: 'none',
                                        border: 'none',
                                        color: 'white',
                                        textAlign: 'left',
                                        cursor: 'pointer',
                                        fontSize: '0.9rem',
                                    }}
                                    onMouseEnter={(e) => e.target.style.background = '#3a3a3a'}
                                    onMouseLeave={(e) => e.target.style.background = 'none'}
                                >
                                    ENGR 102
                                </button>
                                <button
                                    onClick={() => { setDropdownOpen(false); }}
                                    style={{
                                        display: 'block',
                                        width: '100%',
                                        padding: '8px 14px',
                                        background: 'none',
                                        border: 'none',
                                        color: '#888',
                                        textAlign: 'left',
                                        cursor: 'default',
                                        fontSize: '0.9rem',
                                    }}
                                >
                                    ETAM (coming soon)
                                </button>
                            </div>
                        )}
                    </div>
                    
                        {/* User Progress */}
                        <button
                            onClick={() => navigate('/userprofile')}
                            style={{
                                cursor: 'pointer',
                                background: 'none',
                                border: 'none',
                                color: 'white',
                                fontSize: '0.95rem',
                                padding: '6px 10px',
                            }}>
                            User Progress
                        </button>

                        {/* Feedback */}
                        <button
                            onClick={() => navigate('/feedback')}
                            style={{
                                cursor: 'pointer',
                                background: 'none',
                                border: 'none',
                                color: 'white',
                                fontSize: '0.95rem',
                                padding: '6px 10px',
                            }}>
                                Feedback
                        </button>
                </div>
            </nav>
            <div style={{ height: '50px' }} />
        </>
    );
};

export default Navbar;
