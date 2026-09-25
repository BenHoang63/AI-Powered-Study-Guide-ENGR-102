import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Cookie, ExternalLink, ShieldCheck, Mail, Phone, Calendar } from 'lucide-react';
import Footer from '../components/Footer.jsx';
import ThemeToggle from '../components/ThemeToggle.jsx';

const BROWSER_LINKS = [
    { name: 'Google Chrome', url: 'https://support.google.com/chrome/answer/95647#zippy=%2Callow-or-block-cookies' },
    { name: 'Mozilla Firefox', url: 'https://support.mozilla.org/en-US/kb/enhanced-tracking-protection-firefox-desktop?redirectslug=enable-and-disable-cookies-website-preferences&redirectlocale=en-US' },
    { name: 'Apple Safari', url: 'https://support.apple.com/en-ie/guide/safari/sfri11471/mac' },
    { name: 'Microsoft Edge', url: 'https://support.microsoft.com/en-us/windows/microsoft-edge-browsing-data-and-privacy-bb8174ba-9d73-dcf2-9b4a-c582b4e640dd' },
    { name: 'Opera', url: 'https://help.opera.com/en/latest/web-preferences/' },
    { name: 'Internet Explorer', url: 'https://support.microsoft.com/en-us/windows/delete-and-manage-cookies-168dab11-0753-043d-7c16-ede5947fc64d' },
];

const OPT_OUT_LINKS = [
    { name: 'Digital Advertising Alliance (DAA)', url: 'http://www.aboutads.info/choices/' },
    { name: 'Digital Advertising Alliance of Canada (DAAC)', url: 'https://youradchoices.ca/' },
    { name: 'European Interactive Digital Advertising Alliance (EDAA)', url: 'http://www.youronlinechoices.com/' },
];

const CookiePolicy = () => {
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

            {/* Main Document Content */}
            <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-12">
                <div className="so-card p-6 sm:p-10 border-so-border shadow-so-md space-y-8">
                    
                    {/* Document Header */}
                    <div className="border-b border-so-border pb-6 space-y-3">
                        {/* <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-[#990000]/20 border border-[#990000]/40 text-white text-xs font-medium">
                            <Cookie className="w-3.5 h-3.5" />
                            <span>Legal Disclosure</span>
                        </div> */}
                        <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                            Cookie Policy
                        </h1>
                        <div className="flex items-center gap-2 text-xs text-so-text-muted">
                            <Calendar className="w-3.5 h-3.5" />
                            <span>Last updated: <strong className="text-white font-medium">September 21, 2026</strong></span>
                        </div>
                    </div>

                    {/* Section: Overview */}
                    <section className="space-y-3 text-sm leading-relaxed text-so-text-body">
                        <p>
                            This Cookie Policy explains how <strong className="text-white font-semibold">Benjamin Hoang</strong> ("<strong>Company</strong>," "<strong>we</strong>," "<strong>us</strong>," and "<strong>our</strong>") uses cookies and similar technologies to recognize you when you visit our website at{' '}
                            <a 
                                href="https://engr-study-helper.onrender.com" 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="text-blue-400 hover:text-blue-300 underline underline-offset-2 transition-colors inline-flex items-center gap-1"
                            >
                                https://engr-study-helper.onrender.com
                                <ExternalLink className="w-3 h-3" />
                            </a>{' '}
                            ("<strong>Website</strong>"). It explains what these technologies are and why we use them, as well as your rights to control our use of them.
                        </p>
                        <p>
                            In some cases we may use cookies to collect personal information, or that becomes personal information if we combine it with other information.
                        </p>
                    </section>

                    {/* Section: What are cookies */}
                    <section className="space-y-3 text-sm leading-relaxed text-so-text-body border-t border-so-borderSubtle pt-6">
                        <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
                            What are cookies?
                        </h2>
                        <p>
                            Cookies are small data files that are placed on your computer or mobile device when you visit a website. Cookies are widely used by website owners in order to make their websites work, or to work more efficiently, as well as to provide reporting information.
                        </p>
                        <p>
                            Cookies set by the website owner (in this case, <strong className="text-white font-medium">Benjamin Hoang</strong>) are called "first-party cookies." Cookies set by parties other than the website owner are called "third-party cookies." Third-party cookies enable third-party features or functionality to be provided on or through the website (e.g., advertising, interactive content, and analytics). The parties that set these third-party cookies can recognize your computer both when it visits the website in question and also when it visits certain other websites.
                        </p>
                    </section>

                    {/* Section: Why do we use cookies */}
                    <section className="space-y-3 text-sm leading-relaxed text-so-text-body border-t border-so-borderSubtle pt-6">
                        <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
                            Why do we use cookies?
                        </h2>
                        <p>
                            We use first- and third-party cookies for several reasons. Some cookies are required for technical reasons in order for our Website to operate, and we refer to these as "essential" or "strictly necessary" cookies.
                        </p>
                        <div className="p-3.5 rounded bg-so-surface border border-so-border text-xs space-y-1.5">
                            <div className="font-semibold text-white flex items-center gap-1.5">
                                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                                <span>Essential Authentication Cookies in this Application</span>
                            </div>
                            <p className="text-so-text-muted">
                                This application uses essential HTTP cookies to maintain authenticated student sessions (e.g., when you authenticate via Google OAuth using your Texas A&M email). These cookies allow the server to securely remember your signed-in state while you practice questions, review modules, and record quiz progress.
                            </p>
                        </div>
                        <p>
                            Other cookies may enable us to track and target the interests of our users to enhance the experience on our Online Properties. Third parties may also serve cookies through our Website for analytics and other operational purposes.
                        </p>
                    </section>

                    {/* Section: How can I control cookies */}
                    <section className="space-y-3 text-sm leading-relaxed text-so-text-body border-t border-so-borderSubtle pt-6">
                        <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
                            How can I control cookies?
                        </h2>
                        <p>
                            You have the right to decide whether to accept or reject cookies. You can exercise your cookie rights by setting your preferences in the Cookie Preference Center. The Cookie Preference Center allows you to select which categories of cookies you accept or reject. Essential cookies cannot be rejected as they are strictly necessary to provide you with services.
                        </p>
                        <p>
                            The Cookie Preference Center can be found in the notification banner and on our Website. If you choose to reject cookies, you may still use our Website though your access to some functionality and areas of our Website may be restricted. You may also set or amend your web browser controls to accept or refuse cookies.
                        </p>
                    </section>

                    {/* Section: Browser controls */}
                    <section className="space-y-4 text-sm leading-relaxed text-so-text-body border-t border-so-borderSubtle pt-6">
                        <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
                            How can I control cookies on my browser?
                        </h2>
                        <p>
                            As the means by which you can refuse cookies through your web browser controls vary from browser to browser, you should visit your browser's help menu for more information. Below are guides for managing cookies on the most popular web browsers:
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                            {BROWSER_LINKS.map((browser) => (
                                <a
                                    key={browser.name}
                                    href={browser.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center justify-between p-2.5 rounded bg-so-surface hover:bg-so-hover border border-so-border text-xs text-white transition-colors group"
                                >
                                    <span>{browser.name}</span>
                                    <ExternalLink className="w-3.5 h-3.5 text-so-text-muted group-hover:text-white transition-colors" />
                                </a>
                            ))}
                        </div>

                        <p className="pt-2">
                            In addition, most advertising networks offer you a way to opt out of targeted advertising. If you would like to find out more information, please visit:
                        </p>

                        <ul className="space-y-1.5 text-xs">
                            {OPT_OUT_LINKS.map((link) => (
                                <li key={link.name}>
                                    <a
                                        href={link.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-400 hover:text-blue-300 underline underline-offset-2 transition-colors inline-flex items-center gap-1"
                                    >
                                        {link.name}
                                        <ExternalLink className="w-3 h-3" />
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </section>

                    {/* Section: Web beacons & tracking technologies */}
                    <section className="space-y-3 text-sm leading-relaxed text-so-text-body border-t border-so-borderSubtle pt-6">
                        <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
                            What about other tracking technologies, like web beacons?
                        </h2>
                        <p>
                            Cookies are not the only way to recognize or track visitors to a website. We may use other, similar technologies from time to time, like web beacons (sometimes called "tracking pixels" or "clear gifs"). These are tiny graphics files that contain a unique identifier that enables us to recognize when someone has visited our Website or opened an email including them.
                        </p>
                        <p>
                            This allows us, for example, to monitor the traffic patterns of users from one page within a website to another, to deliver or communicate with cookies, to understand whether you have come to the website from an online advertisement displayed on a third-party website, to improve site performance, and to measure the success of email marketing campaigns. In many instances, these technologies are reliant on cookies to function properly, and so declining cookies will impair their functioning.
                        </p>
                    </section>

                    {/* Section: Flash cookies / LSOs */}
                    <section className="space-y-3 text-sm leading-relaxed text-so-text-body border-t border-so-borderSubtle pt-6">
                        <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
                            Do you use Flash cookies or Local Shared Objects?
                        </h2>
                        <p>
                            Websites may also use so-called "Flash Cookies" (also known as Local Shared Objects or "LSOs") to, among other things, collect and store information about your use of our services, fraud prevention, and for other site operations.
                        </p>
                        <p>
                            If you do not want Flash Cookies stored on your computer, you can adjust the settings of your Flash player to block Flash Cookies storage using the tools contained in the{' '}
                            <a 
                                href="http://www.macromedia.com/support/documentation/en/flashplayer/help/settings_manager07.html" 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="text-blue-400 hover:text-blue-300 underline underline-offset-2 transition-colors"
                            >
                                Website Storage Settings Panel
                            </a>
                            . You can also control Flash Cookies by going to the{' '}
                            <a 
                                href="http://www.macromedia.com/support/documentation/en/flashplayer/help/settings_manager03.html" 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="text-blue-400 hover:text-blue-300 underline underline-offset-2 transition-colors"
                            >
                                Global Storage Settings Panel
                            </a>{' '}
                            and following the instructions.
                        </p>
                        <p className="text-xs text-so-text-muted">
                            Please note that setting the Flash Player to restrict or limit acceptance of Flash Cookies may reduce or impede the functionality of some Flash applications.
                        </p>
                    </section>

                    {/* Section: Targeted advertising */}
                    <section className="space-y-3 text-sm leading-relaxed text-so-text-body border-t border-so-borderSubtle pt-6">
                        <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
                            Do you serve targeted advertising?
                        </h2>
                        <p>
                            Third parties may serve cookies on your computer or mobile device to serve advertising through our Website. These companies may use information about your visits to this and other websites in order to provide relevant advertisements about goods and services that you may be interested in. They may also employ technology that is used to measure the effectiveness of advertisements.
                        </p>
                        <p>
                            They can accomplish this by using cookies or web beacons to collect information about your visits to this and other sites in order to provide relevant advertisements about goods and services of potential interest to you. The information collected through this process does not enable us or them to identify your name, contact details, or other details that directly identify you unless you choose to provide these.
                        </p>
                    </section>

                    {/* Section: Updates */}
                    <section className="space-y-3 text-sm leading-relaxed text-so-text-body border-t border-so-borderSubtle pt-6">
                        <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
                             How often will you update this Cookie Policy?
                        </h2>
                        <p>
                            We may update this Cookie Policy from time to time in order to reflect, for example, changes to the cookies we use or for other operational, legal, or regulatory reasons. Please therefore revisit this Cookie Policy regularly to stay informed about our use of cookies and related technologies.
                        </p>
                        <p>
                            The date at the top of this Cookie Policy indicates when it was last updated.
                        </p>
                    </section>

                    {/* Section: Contact */}
                    <section className="space-y-3 text-sm leading-relaxed text-so-text-body border-t border-so-borderSubtle pt-6">
                        <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
                             Where can I get further information?
                        </h2>
                        <p>
                            If you have any questions about our use of cookies or other technologies, please contact us:
                        </p>
                        
                        <div className="p-4 rounded bg-so-surface border border-so-border space-y-2 text-xs">
                            <div className="font-semibold text-white text-sm">Benjamin Hoang</div>
                            <div className="flex items-center gap-2 text-so-text-body">
                                <Mail className="w-3.5 h-3.5 text-so-text-muted" />
                                <span>Email: </span>
                                <a 
                                    href="mailto:benhoangsuper@gmail.com" 
                                    className="text-blue-400 hover:text-blue-300 underline underline-offset-2 font-mono"
                                >
                                    benhoangsuper@gmail.com
                                </a>
                            </div>
                            <div className="flex items-center gap-2 text-so-text-body">
                                <Phone className="w-3.5 h-3.5 text-so-text-muted" />
                                <span>Phone: </span>
                                <span className="font-mono text-white">(+1) 832-766-5669</span>
                            </div>
                        </div>
                    </section>

                    {/* Attribution footer */}
                    <div className="border-t border-so-borderSubtle pt-4 text-center text-xs text-so-text-muted">
                        <span>This Cookie Policy was generated using </span>
                        <a 
                            href="https://termly.io/products/cookie-consent-manager/" 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="text-so-text-muted hover:text-white underline underline-offset-2 transition-colors"
                        >
                            Termly's Cookie Consent Manager
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

export default CookiePolicy;
