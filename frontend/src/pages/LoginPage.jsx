import { authClient } from '../scripts/auth'
import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'

const LoginPage = () => {
	const [user, setUser] = useState(null);
	const [error, setError] = useState(null);
	const navigate = useNavigate();

	const handleGoogleSignIn = async () => {
		try {
			await authClient.signIn.social({
				provider: "google",
				callbackURL: window.location.origin,
			});
		} catch (error) {
			console.error("Google sign-in error:", error);
			setError("Sign-in failed. Please try again.");
		}
	};

	const handleSignOut = async () => {
		try {
			await authClient.signOut();
			setUser(null);
		} catch (error) {
			console.error("Sign-out error:", error);
		}
	};

	useEffect(() => {
		authClient.getSession().then(({ data }) => {
			if (data?.user) {
				// Check if TAMU email
				if (data.user.email?.includes("@tamu.edu")) {
					setUser(data.user);
					// redirect user
					navigate('/home');
				} else {
					// Not a TAMU student — sign them out
					console.log("Not a TAMU student:", data.user.email);
					setError("Please sign in with your @tamu.edu email.");
					authClient.signOut();
				}
			}
		});
	}, []);

    return (
        <>
		<header>
			<div style={{
				padding: "auto",
				textAlign: "center",
				width: "50%",
				margin: "auto"
			}}>
				<h1>ENGR 102 Study Helper</h1>
				<p>By Benjamin Hoang :)</p><br></br><br></br>
			</div>
		</header>



		<section id="center">
			<div style={{
				padding: "auto",
				textAlign: "center",
				width: "25%",
				margin: "auto"
			}}>
				{user ? (
					<div>
						<p>Welcome, {user.name}!</p>
						<button onClick={handleSignOut}>Sign Out</button>
					</div>
				) : (
					<div>
						<h2>Sign In With Your TAMU Email</h2>
						{error && <p style={{ color: "red" }}>{error}</p>}
						<button onClick={handleGoogleSignIn}>
							Sign in with Google
						</button>
					</div>
				)}
			</div>
		</section>
        
        </>
    );
};

export default LoginPage;