import { authClient } from '../scripts/auth';
import { isAuthorized, isDemoMode } from '../scripts/demo';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {

    const [user, setUser] = useState(null);
    const [error, setError] = useState(null);
    const navigate = useNavigate();


    useEffect(() => {
        authClient.getSession().then(({ data }) => {
            if (data?.user) {
                // Check if TAMU email
                if (isAuthorized(data.user.email)) {
                    setUser(data.user);
                    return;
                } else {
                    // Not a TAMU student — sign them out
                    console.log("Not a TAMU student:", data.user.email);
                    setError("Please sign in with your @tamu.edu email.");
                    authClient.signOut();
                }
            } else if (!isDemoMode()) {
                navigate('/');
            }
        });
    }, []);

    return (
        <>
            <div style={{
                    padding: "auto",
                    textAlign: "center",
                    width: "25%",
                    margin: "auto"
                }}>
                <h1>Home</h1>
                <h2>Welcome, {user?.name || (isDemoMode() && "Demo User")}!</h2>
                <p>{user?.email}</p>
                <button onClick={() => { authClient.signOut(); navigate('/'); }}>Sign Out</button>
                <br></br>
                <br></br>
                <style>{`
                    section div button {
                        padding: 10%; 
                        margin: 5%;
                        cursor: pointer;
                    }
                `}</style>
            </div>

            <section id="center">
                <div style={{
                    padding: "auto",
                    textAlign: "center",
                    width: "25%",
                    margin: "auto"
                }}>
                    <h3>Select Topic</h3>
                    <button onClick={() => { navigate('/engr102'); }}>ENGR 102</button>
                    <button>ETAM</button>
                </div>
            </section>
        </>
    )

}

export default HomePage;