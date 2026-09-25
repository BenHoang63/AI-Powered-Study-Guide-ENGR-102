import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, ExternalLink, ShieldCheck, Mail, Calendar, Sparkles } from 'lucide-react';
import Footer from '../components/Footer.jsx';
import ThemeToggle from '../components/ThemeToggle.jsx';

const TOC_ITEMS = [
    { id: 'infocollect', label: '1. What information do we collect?' },
    { id: 'infouse', label: '2. How do we process your information?' },
    { id: 'whoshare', label: '3. When and with whom do we share your personal information?' },
    { id: 'cookies', label: '4. Do we use cookies and other tracking technologies?' },
    { id: 'ai', label: '5. Do we offer artificial intelligence-based products?' },
    { id: 'sociallogins', label: '6. How do we handle your social logins?' },
    { id: 'inforetain', label: '7. How long do we keep your information?' },
    { id: 'infosafe', label: '8. How do we keep your information safe?' },
    { id: 'infominors', label: '9. Do we collect information from minors?' },
    { id: 'privacyrights', label: '10. What are your privacy rights?' },
    { id: 'dnt', label: '11. Controls for do-not-track features' },
    { id: 'uslaws', label: '12. Do United States residents have specific privacy rights?' },
    { id: 'policyupdates', label: '13. Do we make updates to this notice?' },
    { id: 'contact', label: '14. How can you contact us about this notice?' },
    { id: 'request', label: '15. How can you review, update, or delete data we collect from you?' },
];

const PrivacyPolicy = () => {
    const navigate = useNavigate();

    const handleBack = () => {
        if (window.history.state && window.history.state.idx > 0) {
            navigate(-1);
        } else {
            navigate('/');
        }
    };

    return (
        <div className="min-h-screen bg-so-bg text-so-text-body font-sans antialiased selection:bg-[#990000]/60 selection:text-white flex flex-col">
            {/* Header / Navigation Bar */}
            <header className="sticky top-0 z-40 bg-[#161616]/95 backdrop-blur border-b border-so-border">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={handleBack}
                            className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-700 dark:text-white/90 hover:text-slate-900 dark:hover:text-white bg-so-surface hover:bg-so-hover border border-so-border rounded px-2.5 py-1.5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#990000]"
                            title="Go back"
                        >
                            <ArrowLeft className="w-3.5 h-3.5 text-slate-700 dark:text-white" />
                            <span>Back</span>
                        </button>

                        <div className="h-4 w-px bg-so-border" />

                        <Link to="/" className="flex items-center gap-2 group">
                            {/* <div className="w-7 h-7 rounded bg-[#990000] border border-[#b30000]/50 flex items-center justify-center transition-colors">
                                <span className="text-white font-bold text-xs tracking-tighter">≡</span>
                            </div> */}
                            <span className="text-sm font-semibold text-white tracking-tight group-hover:text-neutral-200 transition-colors">
                                ENGR Study Helper
                            </span>
                        </Link>
                    </div>

                    <div className="flex items-center gap-3">
                        <ThemeToggle />
                        <Link
                            to="/"
                            className="text-xs font-medium text-so-text-muted hover:text-white transition-colors"
                        >
                            Sign In Portal
                        </Link>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-12">
                <div className="so-card p-6 sm:p-10 border-so-border shadow-so-md space-y-8">
                    
                    {/* Document Header */}
                    <div className="border-b border-so-border pb-6 space-y-3">
                        <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                            Privacy Policy
                        </h1>
                        <div className="flex items-center gap-2 text-xs text-so-text-muted">
                            <Calendar className="w-3.5 h-3.5" />
                            <span>Last updated: <strong className="text-white font-medium">September 21, 2026</strong></span>
                        </div>
                    </div>

                    {/* Overview */}
                    <section className="space-y-3 text-sm leading-relaxed text-so-text-body">
                        <p>
                            This Privacy Notice for <strong className="text-white font-semibold">Benjamin Hoang</strong> ("<strong>we</strong>," "<strong>us</strong>," or "<strong>our</strong>") describes how and why we might access, collect, store, use, and/or share ("<strong>process</strong>") your personal information when you use our services ("<strong>Services</strong>"), including when you:
                        </p>
                        <ul className="list-disc pl-5 space-y-1.5 text-xs text-so-text-muted">
                            <li>
                                Visit our website at{' '}
                                <a 
                                    href="https://engr-study-helper.onrender.com" 
                                    target="_blank" 
                                    rel="noopener noreferrer" 
                                    className="text-blue-400 hover:text-blue-300 underline underline-offset-2 inline-flex items-center gap-1"
                                >
                                    https://engr-study-helper.onrender.com
                                    <ExternalLink className="w-3 h-3" />
                                </a>{' '}
                                or any website of ours that links to this Privacy Notice.
                            </li>
                            <li>
                                Use <strong className="text-white">ENGR Study Helper</strong>, an AI-powered educational web application created to assist Texas A&M first-year engineering students in learning Python and mastering ENGR 102 concepts.
                            </li>
                            <li>
                                Engage with us in other related ways, including submitting feedback or reporting technical issues.
                            </li>
                        </ul>
                        <p className="text-xs text-so-text-muted pt-2">
                            <strong>Questions or concerns?</strong> Reading this Privacy Notice will help you understand your privacy rights and choices. If you do not agree with our policies and practices, please do not use our Services. If you have questions or concerns, please contact us at{' '}
                            <a href="mailto:benhoangsuper@gmail.com" className="text-blue-400 hover:text-blue-300 underline underline-offset-2 font-mono">
                                benhoangsuper@gmail.com
                            </a>.
                        </p>
                    </section>

                    {/* Summary of Key Points Card */}
                    <div className="p-4 sm:p-5 rounded bg-so-surface border border-so-border space-y-3">
                        <div className="flex items-center gap-2 text-white font-semibold text-sm">
                            <ShieldCheck className="w-4 h-4 text-emerald-400" />
                            <span>Summary of Key Points</span>
                        </div>
                        <ul className="space-y-2 text-xs text-so-text-body">
                            <li>
                                <strong className="text-white">Personal Information Processed:</strong> We only collect names and university email addresses (@tamu.edu) provided voluntarily when you authenticate via Google OAuth.
                            </li>
                            <li>
                                <strong className="text-white">Sensitive Information:</strong> We do <span className="text-white underline">not</span> collect or process sensitive personal information (such as racial or ethnic origins, sexual orientation, financial data, or health data).
                            </li>
                            <li>
                                <strong className="text-white">No Selling of Data:</strong> We do <span className="text-white underline">not</span> sell your personal information or share it with third parties for marketing purposes.
                            </li>
                            <li>
                                <strong className="text-white">AI Technologies:</strong> Our study aids use AI service providers (such as DeepSeek, OpenAI, and NVIDIA AI) to generate customized practice questions and feedback based on academic course topics.
                            </li>
                            <li>
                                <strong className="text-white">Your Rights:</strong> You can review, update, or request the deletion of your account and personal information at any time.
                            </li>
                        </ul>
                    </div>

                    {/* Table of Contents */}
                    <section className="border-t border-so-borderSubtle pt-6 space-y-3">
                        <h2 className="text-xs font-semibold text-so-text-muted uppercase tracking-wider">
                            Table of Contents
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                            {TOC_ITEMS.map((item) => (
                                <a
                                    key={item.id}
                                    href={`#${item.id}`}
                                    className="p-2 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 border border-slate-200 dark:bg-so-surface/60 dark:hover:bg-so-hover dark:border-so-borderSubtle dark:text-so-text-body dark:hover:text-white transition-colors truncate"
                                >
                                    {item.label}
                                </a>
                            ))}
                        </div>
                    </section>

                    {/* Section 1: What information do we collect */}
                    <section id="infocollect" className="space-y-3 text-sm leading-relaxed text-so-text-body border-t border-so-borderSubtle pt-6 scroll-mt-20">
                        <h2 className="text-lg font-bold text-white tracking-tight">
                            What information do we collect?
                        </h2>
                        <p className="text-xs text-so-text-muted italic">
                            <strong>In Short:</strong> We collect personal information that you provide to us.
                        </p>
                        <p>
                            We collect personal information that you voluntarily provide to us when you register on the Services via Google OAuth, express an interest in obtaining information about us or our study resources, or submit feedback.
                        </p>
                        <p>
                            The personal information we collect is strictly limited to:
                        </p>
                        <ul className="list-disc pl-5 space-y-1 text-xs text-white">
                            <li><strong>Names</strong> (as provided in your institutional Google profile)</li>
                            <li><strong>Email addresses</strong> (your student <code className="text-white bg-[#990000]/25 border border-[#990000]/50 px-1.5 py-0.5 rounded font-mono">@tamu.edu</code> email address)</li>
                        </ul>
                        <p className="pt-1">
                            <strong>Sensitive Information:</strong> We do not process sensitive personal information.
                        </p>

                        <div className="p-3.5 rounded bg-so-surface border border-so-border text-xs space-y-1.5 mt-2">
                            <strong className="text-white block">Google API Limited Use Disclosure</strong>
                            <p className="text-so-text-muted">
                                Our use and transfer of information received from Google APIs to any other app will adhere to the{' '}
                                <a 
                                    href="https://developers.google.com/terms/api-services-user-data-policy" 
                                    target="_blank" 
                                    rel="noopener noreferrer" 
                                    className="text-blue-400 hover:text-blue-300 underline"
                                >
                                    Google API Services User Data Policy
                                </a>
                                , including the{' '}
                                <a 
                                    href="https://developers.google.com/terms/api-services-user-data-policy#limited-use" 
                                    target="_blank" 
                                    rel="noopener noreferrer" 
                                    className="text-blue-400 hover:text-blue-300 underline"
                                >
                                    Limited Use requirements
                                </a>
                                .
                            </p>
                        </div>
                    </section>

                    {/* Section 2: How do we process your information */}
                    <section id="infouse" className="space-y-3 text-sm leading-relaxed text-so-text-body border-t border-so-borderSubtle pt-6 scroll-mt-20">
                        <h2 className="text-lg font-bold text-white tracking-tight">
                            How do we process your information?
                        </h2>
                        <p className="text-xs text-so-text-muted italic">
                            <strong>In Short:</strong> We process your information to provide, improve, and administer our Services, authenticate student sessions, and comply with law.
                        </p>
                        <ul className="list-disc pl-5 space-y-2 text-xs">
                            <li>
                                <strong className="text-white">To facilitate account creation and authentication:</strong> We process your information so you can log in securely via Google OAuth and keep your study progress session active.
                            </li>
                            <li>
                                <strong className="text-white">To deliver study materials and services:</strong> To provide personalized practice quizzes, code execution feedback, and accuracy tracking across Python topics.
                            </li>
                            <li>
                                <strong className="text-white">To request feedback:</strong> We may process information when necessary to respond to technical bug reports or user suggestions submitted through our feedback portal.
                            </li>
                        </ul>
                    </section>

                    {/* Section 3: When and with whom do we share info */}
                    <section id="whoshare" className="space-y-3 text-sm leading-relaxed text-so-text-body border-t border-so-borderSubtle pt-6 scroll-mt-20">
                        <h2 className="text-lg font-bold text-white tracking-tight">
                            When and with whom do we share your personal information?
                        </h2>
                        <p className="text-xs text-so-text-muted italic">
                            <strong>In Short:</strong> We do not sell or rent your personal data. We only share information in specific situations with service providers necessary to operate the application.
                        </p>
                        <p>
                            We may share information in connection with hosting infrastructure (such as Render and database services) and AI model providers used to process curriculum queries. We do not sell your personal data to any third party for marketing or monetary compensation.
                        </p>
                    </section>

                    {/* Section 4: Cookies and tracking */}
                    <section id="cookies" className="space-y-3 text-sm leading-relaxed text-so-text-body border-t border-so-borderSubtle pt-6 scroll-mt-20">
                        <h2 className="text-lg font-bold text-white tracking-tight">
                            Do we use cookies and other tracking technologies?
                        </h2>
                        <p className="text-xs text-so-text-muted italic">
                            <strong>In Short:</strong> We use essential cookies to maintain secure authenticated student sessions.
                        </p>
                        <p>
                            We use cookies and similar technologies to recognize you when you visit our website. For full details regarding our use of cookies and how to manage them, please review our{' '}
                            <Link to="/cookie-policy" className="text-blue-400 hover:text-blue-300 underline underline-offset-2">
                                Cookie Policy
                            </Link>.
                        </p>
                    </section>

                    {/* Section 5: AI-Based Products */}
                    <section id="ai" className="space-y-3 text-sm leading-relaxed text-so-text-body border-t border-so-borderSubtle pt-6 scroll-mt-20">
                        <div className="flex items-center gap-2">
                            <h2 className="text-lg font-bold text-white tracking-tight">
                                Do we offer artificial intelligence-based products?
                            </h2>
                        </div>
                        <p className="text-xs text-so-text-muted italic">
                            <strong>In Short:</strong> We offer practice quizzing and study assistance tools powered by AI and machine learning.
                        </p>
                        <p>
                            As part of our Services, we offer tools powered by artificial intelligence and machine learning ("<strong>AI Products</strong>"). These tools generate tailored Python coding challenges, multiple-choice questions, and answer explanations aligned with ENGR 102 coursework.
                        </p>
                        <p>
                            We provide these tools through third-party AI service providers (including DeepSeek, OpenAI, and NVIDIA AI). Your input prompts and curriculum topic queries are processed by these providers solely to return educational practice questions and explanations.
                        </p>
                    </section>

                    {/* Section 6: Social Logins */}
                    <section id="sociallogins" className="space-y-3 text-sm leading-relaxed text-so-text-body border-t border-so-borderSubtle pt-6 scroll-mt-20">
                        <h2 className="text-lg font-bold text-white tracking-tight">
                            How do we handle your social logins?
                        </h2>
                        <p className="text-xs text-so-text-muted italic">
                            <strong>In Short:</strong> When you log in with Google, we receive basic profile info (name and email) to verify Texas A&M student status.
                        </p>
                        <p>
                            When you choose to authenticate via Google OAuth, we receive your name and verified email address. We use this information solely to verify student eligibility (@tamu.edu domain) and to maintain your user account and practice records.
                        </p>
                    </section>

                    {/* Section 7: Retention */}
                    <section id="inforetain" className="space-y-3 text-sm leading-relaxed text-so-text-body border-t border-so-borderSubtle pt-6 scroll-mt-20">
                        <h2 className="text-lg font-bold text-white tracking-tight">
                            How long do we keep your information?
                        </h2>
                        <p className="text-xs text-so-text-muted italic">
                            <strong>In Short:</strong> We keep your information for as long as your account remains active.
                        </p>
                        <p>
                            We retain your personal data and quiz performance statistics for as long as you maintain an account with our Services. When we have no ongoing legitimate educational need to process your personal data, we will delete or anonymize it upon request.
                        </p>
                    </section>

                    {/* Section 8: Security */}
                    <section id="infosafe" className="space-y-3 text-sm leading-relaxed text-so-text-body border-t border-so-borderSubtle pt-6 scroll-mt-20">
                        <h2 className="text-lg font-bold text-white tracking-tight">
                            How do we keep your information safe?
                        </h2>
                        <p className="text-xs text-so-text-muted italic">
                            <strong>In Short:</strong> We protect your data with standard organizational and technical security measures.
                        </p>
                        <p>
                            We have implemented industry-standard security measures designed to protect the integrity of personal information processed by our platform, including encrypted HTTPS connections and secure session management.
                        </p>
                    </section>

                    {/* Section 9: Minors */}
                    <section id="infominors" className="space-y-3 text-sm leading-relaxed text-so-text-body border-t border-so-borderSubtle pt-6 scroll-mt-20">
                        <h2 className="text-lg font-bold text-white tracking-tight">
                            Do we collect information from minors?
                        </h2>
                        <p className="text-xs text-so-text-muted italic">
                            <strong>In Short:</strong> We do not knowingly collect data from individuals under 18 years of age.
                        </p>
                        <p>
                            Our Services are designed for university students enrolled in collegiate engineering courses. If we learn that personal data from individuals under 18 has been collected without parental consent, we will promptly delete it.
                        </p>
                    </section>

                    {/* Section 10: Privacy Rights */}
                    <section id="privacyrights" className="space-y-3 text-sm leading-relaxed text-so-text-body border-t border-so-borderSubtle pt-6 scroll-mt-20">
                        <h2 className="text-lg font-bold text-white tracking-tight">
                            What are your privacy rights?
                        </h2>
                        <p className="text-xs text-so-text-muted italic">
                            <strong>In Short:</strong> You may review, change, or request deletion of your account data at any time.
                        </p>
                        <p>
                            Depending on your state or jurisdiction, you have the right to request access to and receive details about the personal data we maintain, correct inaccuracies, or request the deletion of your account. You may also withdraw your consent to data processing at any time.
                        </p>
                    </section>

                    {/* Section 11: Do Not Track */}
                    <section id="dnt" className="space-y-3 text-sm leading-relaxed text-so-text-body border-t border-so-borderSubtle pt-6 scroll-mt-20">
                        <h2 className="text-lg font-bold text-white tracking-tight">
                            Controls for do-not-track features
                        </h2>
                        <p>
                            Most web browsers include a Do-Not-Track ("DNT") signal. Because no uniform technological standard has been finalized for recognizing DNT signals, our platform does not currently respond to automated DNT browser signals.
                        </p>
                    </section>

                    {/* Section 12: US State Rights */}
                    <section id="uslaws" className="space-y-3 text-sm leading-relaxed text-so-text-body border-t border-so-borderSubtle pt-6 scroll-mt-20">
                        <h2 className="text-lg font-bold text-white tracking-tight">
                            Do United States residents have specific privacy rights?
                        </h2>
                        <p className="text-xs text-so-text-muted italic">
                            <strong>In Short:</strong> Residents of Texas (under the Texas Data Privacy and Security Act / TDPSA), California, and other states have specific statutory privacy rights.
                        </p>
                        <p>
                            Under applicable state laws, you have the right to know whether we process your data, access your data, correct errors, obtain a portable copy of your data, and delete your data. We do not sell your personal data or engage in profiling for commercial purposes.
                        </p>
                        <p>
                            To submit a request under applicable US state laws, you can submit a{' '}
                            <a 
                                href="https://app.termly.io/dsar/234e097e-df77-4ef7-a566-fc4e7e0bef48" 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="text-blue-400 hover:text-blue-300 underline underline-offset-2 inline-flex items-center gap-1"
                            >
                                Data Subject Access Request (DSAR)
                                <ExternalLink className="w-3 h-3" />
                            </a>{' '}
                            or email us at{' '}
                            <a href="mailto:benhoangsuper@gmail.com" className="text-blue-400 hover:text-blue-300 underline font-mono">
                                benhoangsuper@gmail.com
                            </a>.
                        </p>
                    </section>

                    {/* Section 13: Policy Updates */}
                    <section id="policyupdates" className="space-y-3 text-sm leading-relaxed text-so-text-body border-t border-so-borderSubtle pt-6 scroll-mt-20">
                        <h2 className="text-lg font-bold text-white tracking-tight">
                            Do we make updates to this notice?
                        </h2>
                        <p className="text-xs text-so-text-muted italic">
                            <strong>In Short:</strong> Yes, we will update this notice as necessary to remain compliant with relevant laws.
                        </p>
                        <p>
                            We may update this Privacy Notice from time to time. The revised date at the top of this document indicates when the latest version took effect.
                        </p>
                    </section>

                    {/* Section 14: Contact */}
                    <section id="contact" className="space-y-3 text-sm leading-relaxed text-so-text-body border-t border-so-borderSubtle pt-6 scroll-mt-20">
                        <h2 className="text-lg font-bold text-white tracking-tight">
                            How can you contact us about this notice?
                        </h2>
                        <p>
                            If you have questions, feedback, or comments about this privacy policy, you can contact:
                        </p>
                        <div className="p-4 rounded bg-so-surface border border-so-border space-y-2 text-xs">
                            <div className="font-semibold text-white text-sm">Benjamin Hoang</div>
                            <div className="text-so-text-muted">Sugar Land, TX 77498, United States</div>
                            <div className="flex items-center gap-2 text-so-text-body pt-1">
                                <Mail className="w-3.5 h-3.5 text-so-text-muted" />
                                <span>Email: </span>
                                <a 
                                    href="mailto:benhoangsuper@gmail.com" 
                                    className="text-blue-400 hover:text-blue-300 underline underline-offset-2 font-mono"
                                >
                                    benhoangsuper@gmail.com
                                </a>
                            </div>
                        </div>
                    </section>

                    {/* Section 15: Review, Update, or Delete Data */}
                    <section id="request" className="space-y-3 text-sm leading-relaxed text-so-text-body border-t border-so-borderSubtle pt-6 scroll-mt-20">
                        <h2 className="text-lg font-bold text-white tracking-tight">
                            How can you review, update, or delete the data we collect from you?
                        </h2>
                        <p>
                            Based on applicable laws, you may have the right to request access to the personal information we collect, request correction of inaccuracies, or request complete deletion of your account and quiz data.
                        </p>
                        <p>
                            To submit a request, please fill out and submit a{' '}
                            <a 
                                href="https://app.termly.io/dsar/234e097e-df77-4ef7-a566-fc4e7e0bef48" 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="text-blue-400 hover:text-blue-300 underline underline-offset-2 inline-flex items-center gap-1 font-medium"
                            >
                                Termly Data Subject Access Request (DSAR)
                                <ExternalLink className="w-3 h-3" />
                            </a>{' '}
                            or email us directly at{' '}
                            <a href="mailto:benhoangsuper@gmail.com" className="text-blue-400 hover:text-blue-300 underline font-mono">
                                benhoangsuper@gmail.com
                            </a>.
                        </p>
                    </section>

                    {/* Attribution footer */}
                    <div className="border-t border-so-borderSubtle pt-4 text-center text-xs text-so-text-muted">
                        <span>This Privacy Policy was generated using </span>
                        <a 
                            href="https://termly.io/products/privacy-policy-generator/" 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="text-so-text-muted hover:text-white underline underline-offset-2 transition-colors"
                        >
                            Termly's Privacy Policy Generator
                        </a>
                        .
                    </div>
                </div>
            </main>

            {/* Global Footer */}
            <Footer />
        </div>
    );
};

export default PrivacyPolicy;
