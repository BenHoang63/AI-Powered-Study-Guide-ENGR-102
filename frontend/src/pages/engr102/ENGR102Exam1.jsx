import { authClient } from '../../scripts/auth';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const ENGR102Exam1 = () => {

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
                <h1>Exam 1 Practice</h1>
                <style>{`
                    .definition {
                        font-weight: bold;
                        text-decoration: underline;
                    }
                    .code {
                        background-color: #f4f4f4a0;
                        border-radius: 5px;
                        padding: 2px 5px;
                    }
                `}</style>
            </header>
        </>
    );

}
export default ENGR102Exam1;