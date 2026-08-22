import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import LoginPage from './pages/LoginPage.jsx'
import HomePage from './pages/HomePage.jsx'
import FeedbackPage from './pages/Feedback.jsx';
import ENGR102Home from './pages/engr102/ENGR102Home.jsx'
import ENGR102Mod1 from './pages/engr102/ENGR102Mod1.jsx';
import ENGR102Mod2 from './pages/engr102/ENGR102Mod2.jsx';
import ENGR102Mod3 from './pages/engr102/ENGR102Mod3.jsx';
import ENGR102Mod4 from './pages/engr102/ENGR102Mod4.jsx';
import ENGR102Mod5 from './pages/engr102/ENGR102Mod5.jsx';
import ENGR102Mod6 from './pages/engr102/ENGR102Mod6.jsx';
import ENGR102Mod7 from './pages/engr102/ENGR102Mod7.jsx';
import ENGR102Mod8 from './pages/engr102/ENGR102Mod8.jsx';
import ENGR102Mod9 from './pages/engr102/ENGR102Mod9.jsx';
import ENGR102Mod10 from './pages/engr102/ENGR102Mod10.jsx';
import ENGR102Mod11 from './pages/engr102/ENGR102Mod11.jsx';
import ENGR102Mod12 from './pages/engr102/ENGR102Mod12.jsx';
import ENGR102Exam1 from './pages/engr102/ENGR102Exam1.jsx';
import ENGR102Exam2 from './pages/engr102/ENGR102Exam2.jsx';
import ENGR102TopicQuizzer from './pages/engr102/ENGR102TopicQuizzer.jsx';
import HowToUseSTDIn from './pages/other/stdinTutorialPage.jsx'
import Navbar from './components/navbar/Navbar.jsx';

function App() {
	const location = useLocation();
	const showNavbar = location.pathname !== '/';

	return (
		<>
			{showNavbar && <Navbar />}
			<Routes>
				<Route path="/" element={<LoginPage />} />
				<Route path="/home" element={<HomePage />} />
				<Route path="/feedback" element={<FeedbackPage />} />
				<Route path="/engr102" element={<ENGR102Home />} />
				<Route path="/engr102/module1" element={<ENGR102Mod1 />} />
				<Route path="/engr102/module2" element={<ENGR102Mod2 />} />
				<Route path="/engr102/module3" element={<ENGR102Mod3 />} />
				<Route path="/engr102/module4" element={<ENGR102Mod4 />} />
				<Route path="/engr102/module5" element={<ENGR102Mod5 />} />
				<Route path="/engr102/module6" element={<ENGR102Mod6 />} />
				<Route path="/engr102/module7" element={<ENGR102Mod7 />} />
				<Route path="/engr102/module8" element={<ENGR102Mod8 />} />
				<Route path="/engr102/module9" element={<ENGR102Mod9 />} />
				<Route path="/engr102/module10" element={<ENGR102Mod10 />} />
				<Route path="/engr102/module11" element={<ENGR102Mod11 />} />
				<Route path="/engr102/module12" element={<ENGR102Mod12 />} />
				<Route path="/engr102/exam1" element={<ENGR102Exam1 />} />
				<Route path="/engr102/exam2" element={<ENGR102Exam2 />} />
				<Route path="/engr102/topicquizzer" element={<ENGR102TopicQuizzer />} />
				<Route path="/other/how-to-use-stdin" element={<HowToUseSTDIn />} />
			</Routes>
		</>
	)
}

export default App
