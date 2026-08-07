import { authClient } from '../../scripts/auth';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const ENGR102Home = () => {

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
            <header id="center" style={{ textAlign: "center", margin: "auto" }}>
                <h1>ENGR 102</h1>
                <style>{`
                    section#center button {
                        padding: 10%; 
                        margin: 5%;
                        cursor: pointer;
                    }
                `}</style>
            </header>

            <section id="center">
                <div style={{
                    padding: "auto",
                    textAlign: "center",
                    width: "25%",
                    margin: "auto"
                }}>
                    <h3>Select Topic</h3>
                    <button onClick={() => { navigate('/engr102/topicquizzer'); }}>Topic Quizzer</button>
                    <button onClick={() => { navigate('/engr102/module1'); }}>Module 1 : Intro to Computing & Python</button>
                    <button onClick={() => { navigate('/engr102/module2'); }}>Module 2 : Variables & Expressions</button>
                    <button onClick={() => { navigate('/engr102/module3'); }}>Module 3 : Types & Strings</button>
                    <button onClick={() => { navigate('/engr102/module4'); }}>Module 4 : Boolean Expressions & Conditionals</button>
                    <button onClick={() => { navigate('/engr102/module5'); }}>Module 5 : Program Design & Testing</button>
                    <button onClick={() => { navigate('/engr102/module6'); }}>Module 6 : Loops</button>
                    <button onClick={() => { navigate('/engr102/module7'); }}>Module 7 : Lists</button>
                    <button onClick={() => { navigate('/engr102/module8'); }}>Module 8 : Top-Down Design & Dictionaries</button>
                    <button onClick={() => { navigate('/engr102/module9'); }}>Module 9 : User-Designed Functions & Mutable/Immutable Data Types</button>
                    <button onClick={() => { navigate('/engr102/module10'); }}>Module 10 : Exceptions & Errors</button>
                    <button onClick={() => { navigate('/engr102/module11'); }}>Module 11 : Files</button>
                    <button onClick={() => { navigate('/engr102/module12'); }}>Module 12 : Modules</button>
                </div>
            </section>
        </>
    );
};

export default ENGR102Home;