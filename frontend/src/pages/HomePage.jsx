import { authClient } from '../scripts/auth';
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
                if (data.user.email?.includes("@tamu.edu")) {
                    setUser(data.user);
                    // redirect user
                    navigate('/home');
                    return;
                } else {
                    // Not a TAMU student — sign them out
                    console.log("Not a TAMU student:", data.user.email);
                    setError("Please sign in with your @tamu.edu email.");
                    authClient.signOut();
                }
            } else {
                navigate('/');
            }
        });
    }, []);

    return (
        <>
            <div>
                <h1>Home</h1>
                <h2>Welcome, {user?.name}!</h2>
                <p>{user?.email}</p>
                <button onClick={() => { authClient.signOut(); navigate('/'); }}>Sign Out</button>
                <br></br>
                <br></br>
            </div>

            <section id="center">
                <div style={{
                    padding: "auto",
                    textAlign: "center",
                    width: "25%",
                    margin: "auto"
                }}>
                    <h3>Select Topic</h3>
                    <button style={{ padding: '10%', margin: '5%'}}>ENGR 102</button>
                    <button style={{ padding: '10%', margin: '5%'}}>ETAM</button>
                </div>
            </section>
        </>
    )

}

export default HomePage;