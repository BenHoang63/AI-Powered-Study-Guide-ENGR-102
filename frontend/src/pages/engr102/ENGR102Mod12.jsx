import { authClient } from '../../scripts/auth';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/styles.css';

const ENGR102Mod12 = () => {

    const [user, setUser] = useState(null);
    const [error, setError] = useState(null);
    const navigate = useNavigate();


    useEffect(() => {
        authClient.getSession().then(({ data }) => {
            if (data?.user) {
                // Check if TAMU email
                if (data.user.email?.includes("@tamu.edu")) {
                    setUser(data.user);
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
            
            <header id="center" style={{ textAlign: "center", margin: "auto"}}>
                <h1>Module 12 : Modules</h1>
            </header>

            <section id="center">
                <div style={{
                    padding: "auto",
                    textAlign: "left",
                    width: "50%",
                    margin: "auto",
                    marginBottom: "500px"
                }}>
                    


{/* 
                    <h2>Module 7 Quiz Prep</h2>
                    <p>Here's some points you need to know for the quiz:</p>
                    <ul>
                        <li>Know how to use <code>for</code> and <code>while</code> loops</li>
                    </ul> */}
                    
                </div>
            </section>
        </>
    );

}
export default ENGR102Mod12;