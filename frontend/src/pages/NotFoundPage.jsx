import { Link, useNavigate } from 'react-router-dom';
import Footer from '../components/Footer.jsx';

const NotFoundPage = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-[calc(100vh-3.5rem)] bg-so-bg text-so-text-body flex flex-col justify-between items-center px-4 pt-12">
            <div className="max-w-lg w-full my-auto text-center">
                {/* 404 Display */}
                <div className="mb-6">
                    <div className="text-[7rem] sm:text-[9rem] font-bold leading-none tracking-tighter text-white select-none">
                        404
                    </div>
                    <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight -mt-4">
                        Page Not Found
                    </h1>
                    <p className="text-xs sm:text-sm text-so-text-muted mt-3 max-w-sm mx-auto">
                        The page you're looking for doesn't exist, may have been moved, or the URL was mistyped.
                    </p>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-center gap-3 mt-6">
                    {/* <button
                        onClick={() => navigate(-1)}
                        className="so-btn-secondary"
                    >
                        Go Back
                    </button> */}
                    <Link to="/home" className="so-btn-primary">
                        Back to Home
                    </Link>
                </div>

                {/* Quick Links */}
                {/* <div className="so-card p-5 mt-10 border-so-border text-left">
                    <div className="text-[11px] font-semibold uppercase tracking-wider text-so-text-muted mb-3">
                        Quick Links
                    </div>
                    <div className="space-y-1">
                        {[
                            { to: '/engr102', label: 'ENGR 102 Course Hub' },
                            { to: '/engr102/topicquizzer', label: 'Topic Quizzer' },
                            { to: '/userprofile', label: 'Student Performance & Mastery' },
                            { to: '/feedback', label: 'Feedback & Bug Report' },
                        ].map(({ to, label }) => (
                            <Link
                                key={to}
                                to={to}
                                className="block px-3 py-2 -mx-1 rounded text-xs text-slate-700 dark:text-so-text-bright hover:bg-slate-100 dark:hover:bg-so-hover transition-colors"
                            >
                                {label}
                            </Link>
                        ))}
                    </div>
                </div> */}
            </div>

            <Footer className="mt-12" />
        </div>
    );
};

export default NotFoundPage;
