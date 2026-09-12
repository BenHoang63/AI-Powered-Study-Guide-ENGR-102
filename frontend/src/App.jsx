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

function App() {
	const location = useLocation();
	const showNavbar = location.pathname !== '/';

	return (
		<div className="min-h-screen bg-so-bg text-so-text-body font-sans antialiased selection:bg-[#500000]/60 selection:text-white">
			{showNavbar && <Navbar />}
			<Routes>
				{/* Main Routes */}
				<Route path="/" element={<LoginPage />} />
				<Route path="/home" element={<HomePage />} />
				<Route path="/feedback" element={<FeedbackPage />} />
				<Route path="/engr102" element={<ENGR102Home />} />
				<Route path="/userprofile" element={<UserProfile />} />

				{/* Exam & Practice Routes (prioritized over dynamic segments) */}
				<Route path="/engr102/exam1" element={<ENGR102Exam1 />} />
				<Route path="/engr102/exam2" element={<ENGR102Exam2 />} />
				<Route path="/engr102/topicquizzer" element={<ENGR102TopicQuizzer />} />

				{/* Unified Module Routes (handles /engr102/module/1, /engr102/module1, etc.) */}
				<Route path="/engr102/module/:id" element={<ModulePage />} />
				<Route path="/engr102/:id" element={<ModulePage />} />

				{/* Other Routes */}
				<Route path="/other/how-to-use-stdin" element={<HowToUseSTDIn />} />
			</Routes>
		</div>
	);
}

export default App;
