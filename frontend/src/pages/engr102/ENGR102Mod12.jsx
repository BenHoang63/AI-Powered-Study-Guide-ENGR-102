import { authClient } from '../../scripts/auth';
import { isAuthorized, isDemoMode } from '../../scripts/demo';
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

            
            <header id="center" style={{ textAlign: "center", margin: "auto"}}>
                <h1>Module 12 : Python Modules</h1>
            </header>

            <section id="center">
                <div style={{
                    padding: "auto",
                    textAlign: "left",
                    width: "60%",
                    margin: "auto",
                    marginBottom: "500px"
                }}>
                    <p>Welcome to module 12! This one should be pretty light</p>
                    <h2>Modules</h2>
                    <div className='block'>
                        <p>A <span className='definition'>python module</span> is like a piece of Python code that gives us functions
                            that are already written for us, so we don't have to write them.</p>
                        <p>Think of the math module. We would have to import it at the beginning of the code like this:</p>
                        <code>from math import *</code>
                        <p>Doing that would give us access to a bunch of different functions, like <code>fabs()</code> or <code>sin()</code>, as 
                            well as constants, such as pi.</p>
                        <h3>Other Ways to Import</h3>
                        <div className='block'>
                            <p>We can import the entire module. But that means we have to specify the module before using any of its functions
                                or constants.
                            </p>
                            <div className='code'>
                                import math<br></br>
                                print( math.fabs(-234) )<br></br><br></br>
                                <span className='comment'> # Result:<br></br>234.0</span>
                            </div>
                            <p>We can also name a module like a variable.</p>
                            <div className='code'>
                                import math as m<br></br>
                                print( m.sqrt(144) )<br></br><br></br>
                                <span className='comment'> # Result:<br></br>12.0</span>
                            </div>
                            <p>We can import a specific function. This saves on computational resources. And conveniently, we don't have to 
                                specify the module name here.
                            </p>
                            <div className='code'>
                                from math import sin<br></br>
                                from math import pi<br></br>
                                print( sin(pi/2) )<br></br><br></br>
                                <span className='comment'> # Result:<br></br>1.0</span>
                            </div>
                            <p>And just like we've been doing, we can import all functions from a module using the asterisk symbol.</p>
                            <div className='code'>
                                from math import *<br></br>
                                print( ceil(3.5) )<br></br><br></br>
                                <span className='comment'> # Result:<br></br>4</span>
                            </div>
                        </div>
                    </div>
                    <h2>Packages</h2>
                    <div className='block'>
                        <p>A <span className='definition'>package</span> is a group of related modules. A package we'll be using is 
                            matplotlib, which basically lets us store and plot data points</p>
                        <p>We can import modules from the package. In this example, let's import the pyplot module.</p>
                        <div className='code'>
                            import matplotlib.pyplot as plt<br></br>
                        </div>
                    </div>
                    <h2>Where to Find Packages and Modules</h2>
                    <div className='block'>
                        <p>There are modules built into Python, such as the math module.</p>
                        <p>There are other modules or packages that were written by other people. These are found 
                            at <a href="https://pypi.org/" target="_blank" rel="noopener noreferrer">https://pypi.org/</a>. For these,
                            you'll have to install them using the terminal.</p>
                        <p>Let's say we want to use the numpy package. We would have to type this in the terminal:</p>
                        <div className='code'>
                            pip install numpy
                        </div>
                    </div>
                    



                    <h2>Module 12 Quiz Prep</h2>
                    <p>Here's some points you need to know for the quiz:</p>
                    <ul>
                        <li>Know the basics of how to import different modules and packages</li>
                        <li>Know about modules and packages in general</li>
                    </ul>
                    
                </div>
            </section>
        </>
    );

}
export default ENGR102Mod12;