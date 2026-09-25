import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import LoginPage from './pages/LoginPage.jsx';
import HomePage from './pages/HomePage.jsx';
import FeedbackPage from './pages/Feedback.jsx';
import ENGR102Home from './pages/engr102/ENGR102Home.jsx';
import ModulePage from './pages/engr102/ModulePage.jsx';
import ENGR102Exam1 from './pages/engr102/ENGR102Exam1.jsx';
import ENGR102Exam2 from './pages/engr102/ENGR102Exam2.jsx';
import ENGR102TopicQuizzer from './pages/engr102/ENGR102TopicQuizzer.jsx';
import HowToUseSTDIn from './pages/other/stdinTutorialPage.jsx';
import Navbar from './components/navbar/Navbar.jsx';
import UserProfile from './pages/UserProfile.jsx';
import CookiePolicy from './pages/CookiePolicy.jsx';
import PrivacyPolicy from './pages/PrivacyPolicy.jsx';
import TermsConditions from './pages/TermsConditions.jsx';
import NotFoundPage from './pages/NotFoundPage.jsx';
import AccountPage from './pages/AccountPage.jsx';

function App() {
	const location = useLocation();
	const isPolicyRoute = 
		location.pathname === '/cookie-policy' || 
		location.pathname === '/cookies' ||
		location.pathname === '/privacy-policy' ||
		location.pathname === '/privacy' ||
		location.pathname === '/terms-and-conditions' ||
		location.pathname === '/terms-conditions' ||
		location.pathname === '/terms-of-service' ||
		location.pathname === '/terms';
	const showNavbar = location.pathname !== '/' && !isPolicyRoute;

	return (
		<div className="min-h-screen bg-so-bg text-so-text-body font-sans antialiased selection:bg-[#990000]/60 selection:text-white">
			{showNavbar && <Navbar />}
			<Routes>
				{/* Main Routes */}
				<Route path="/" element={<LoginPage />} />
				<Route path="/home" element={<HomePage />} />
				<Route path="/feedback" element={<FeedbackPage />} />
				<Route path="/engr102" element={<ENGR102Home />} />
				<Route path="/userprofile" element={<UserProfile />} />
				<Route path="/account" element={<AccountPage />} />

				{/* Exam & Practice Routes (prioritized over dynamic segments) */}
				<Route path="/engr102/exam1" element={<ENGR102Exam1 />} />
				<Route path="/engr102/exam2" element={<ENGR102Exam2 />} />
				<Route path="/engr102/topicquizzer" element={<ENGR102TopicQuizzer />} />

				{/* Unified Module Routes (handles /engr102/module/1, /engr102/module1, etc.) */}
				<Route path="/engr102/module/:id" element={<ModulePage />} />
				<Route path="/engr102/:id" element={<ModulePage />} />

				{/* Legal & Policy Routes */}
				<Route path="/cookie-policy" element={<CookiePolicy />} />
				<Route path="/cookies" element={<CookiePolicy />} />
				<Route path="/privacy-policy" element={<PrivacyPolicy />} />
				<Route path="/privacy" element={<PrivacyPolicy />} />
				<Route path="/terms-and-conditions" element={<TermsConditions />} />
				<Route path="/terms-conditions" element={<TermsConditions />} />
				<Route path="/terms-of-service" element={<TermsConditions />} />
				<Route path="/terms" element={<TermsConditions />} />

				{/* Other Routes */}
				<Route path="/other/how-to-use-stdin" element={<HowToUseSTDIn />} />

				{/* 404 Catch-All */}
				<Route path="*" element={<NotFoundPage />} />
			</Routes>
		</div>
	);
}

export default App;
