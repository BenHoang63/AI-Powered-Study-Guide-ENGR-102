import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import LoginPage from './pages/LoginPage.jsx'
import HomePage from './pages/HomePage.jsx'
import ENGR102Home from './pages/engr102/ENGR102Home.jsx'
import ENGR102Mod1 from './pages/engr102/ENGR102Mod1.jsx';
import ENGR102Mod2 from './pages/engr102/ENGR102Mod2.jsx';
import ENGR102Mod3 from './pages/engr102/ENGR102Mod3.jsx';

function App() {
	return (
		<>
			<Routes>
				<Route path="/" element={<LoginPage />} />
				<Route path="/home" element={<HomePage />} />
				<Route path="/engr102" element={<ENGR102Home />} />
				<Route path="/engr102/module1" element={<ENGR102Mod1 />} />
				<Route path="/engr102/module2" element={<ENGR102Mod2 />} />
				<Route path="/engr102/module3" element={<ENGR102Mod3 />} />
			</Routes>
		</>
	)
}

export default App
