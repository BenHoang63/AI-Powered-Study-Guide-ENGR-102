// Demo mode helpers
// A recruiter can access the site by visiting /?demo=<VITE_DEMO_TOKEN>
// The token is validated on the login page and stored as a sessionStorage flag.
// All auth-gated pages check this flag alongside the real TAMU email check.

const DEMO_FLAG = 'engr102_demo_mode';

/** Returns true if the current session was started via a valid demo token. */
export const isDemoMode = () => sessionStorage.getItem(DEMO_FLAG) === 'true';

/** Call this when a valid demo token is detected — enables demo mode for the session. */
export const enableDemoMode = () => sessionStorage.setItem(DEMO_FLAG, 'true');

/** Returns true if the user is authorized — either a TAMU student or in demo mode. */
export const isAuthorized = (email) =>
    isDemoMode() || (typeof email === 'string' && email.includes('@tamu.edu'));
