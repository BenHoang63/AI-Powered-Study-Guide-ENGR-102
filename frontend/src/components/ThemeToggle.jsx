import { useState, useEffect } from 'react';
import { Sun, Moon } from 'lucide-react';

const ThemeToggle = ({ className = '' }) => {
    const [theme, setTheme] = useState(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('theme');
            if (saved) return saved;
            return document.documentElement.classList.contains('dark') ? 'dark' : 'light';
        }
        return 'dark';
    });

    useEffect(() => {
        const syncTheme = () => {
            const current = localStorage.getItem('theme') || (document.documentElement.classList.contains('dark') ? 'dark' : 'light');
            setTheme(current);
        };
        window.addEventListener('storage', syncTheme);
        window.addEventListener('theme-change', syncTheme);
        return () => {
            window.removeEventListener('storage', syncTheme);
            window.removeEventListener('theme-change', syncTheme);
        };
    }, []);

    const toggleTheme = () => {
        const nextTheme = theme === 'dark' ? 'light' : 'dark';
        setTheme(nextTheme);
        const root = document.documentElement;
        if (nextTheme === 'dark') {
            root.classList.add('dark');
            root.classList.remove('light');
        } else {
            root.classList.remove('dark');
            root.classList.add('light');
        }
        try {
            localStorage.setItem('theme', nextTheme);
            window.dispatchEvent(new Event('theme-change'));
        } catch (e) {}
    };

    return (
        <button
            onClick={toggleTheme}
            className={`p-1.5 text-so-text-muted hover:text-white bg-so-surface hover:bg-so-hover rounded border border-so-border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#990000] ${className}`}
            title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
        >
            {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400" />
            ) : (
                <Moon className="w-4 h-4 text-indigo-400" />
            )}
        </button>
    );
};

export default ThemeToggle;
