import { Link } from 'react-router-dom';

const Footer = ({ className = '' }) => {
    return (
        <footer className={`max-w-4xl mx-auto w-full text-center text-xs text-zinc-300 py-8 px-4 space-y-2 border-t border-so-border/50 ${className}`}>
            <p>
                Supplemental engineering study tool developed for Texas A&M ENGR 102 students.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-[11px] text-zinc-400">
                <span>Not affiliated with or officially endorsed by Texas A&M University.</span>
                <span>•</span>
                <Link to="/privacy-policy" className="text-zinc-300 hover:text-white underline underline-offset-2 transition-colors">
                    Privacy Policy
                </Link>
                <span>•</span>
                <Link to="/cookie-policy" className="text-zinc-300 hover:text-white underline underline-offset-2 transition-colors">
                    Cookie Policy
                </Link>
                <span>•</span>
                <Link to="/terms-and-conditions" className="text-zinc-300 hover:text-white underline underline-offset-2 transition-colors">
                    Terms & Conditions
                </Link>
            </div>
        </footer>
    );
};

export default Footer;
