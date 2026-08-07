import { authClient } from '../../scripts/auth';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/styles.css';


const ENGR102Mod5 = () => {

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
                <h1>Module 5 : Program Design & Testing</h1>
            </header>

            <section id="center">
                <div style={{
                    padding: "auto",
                    textAlign: "left",
                    width: "60%",
                    margin: "auto",
                    marginBottom: "500px"
                }}>
                    <p>Engineering is all about designing solutions to problems, and this process includes testing. I won't go into depth
                        about this module, but there's a bit to take away from here.
                    </p>

                    <h2>Comments</h2>
                    <div className="block">
                        <p><span className='definition'>Comments</span> are used to provide explanations for code.
                        </p>
                        <p>A good way to design a program is to plan it out with comments first, then write the code. 
                            This will help you catch any errors in your logic early on. </p>
                        <p>In this example, we're planning what we're going to do in the code before writing it:</p>
                        <div className="code">
                            <pre className="comment"><code>
                                # import math module<br></br>
                                # get input from user<br></br>
                                # convert input to a float<br></br>
                                # calculate the square root<br></br>
                                # print the result<br></br>
                            </code></pre>
                        </div>
                        <p>Using this plan, we can now write the code:</p>
                        <div className="code">
                            <pre className="code-block"><code>
                                <span className='comment'># import math module</span><br></br>
                                import math<br></br><br></br>
                                <span className="comment"># get input from user</span><br></br>
                                user_input = input("Enter a number: ")<br></br><br></br>
                                <span className="comment"># convert input to a float</span><br></br>
                                num = float(user_input)<br></br><br></br>
                                <span className="comment"># calculate the square root</span><br></br>
                                num = math.sqrt(num)<br></br><br></br>
                                <span className="comment"># print the result</span><br></br>
                                print(num)
                            </code></pre>
                        </div>
                        
                    </div>


                    <h2>Testing</h2>
                    <div className="block">
                        <p><span className='definition'>Testing</span> is a crucial part of the program design process. It involves 
                            testing your code with different inputs to make sure it works as expected.
                        </p>
                        <p>Some good measures for testing include:
                            <ul>
                                <li>Use a variety of different test cases with different possible inputs.</li>
                                <li>Use boundary cases (edge cases).</li>
                                <li>Use invalid cases to see how the program handles errors.</li>
                                <li>When building a program, try to test each step of the program, rather than once at the end.</li>
                            </ul>
                        </p>
                        
                    </div>


                    <h2>Module 5 Quiz Prep</h2>
                    <p>Here's some points you need to know for the quiz:</p>
                    <ul>
                        <li>
                            To get the ones digit of an <code>int</code>, use the modulo operator (%) and divide by 10.<br></br>
                            <ul>
                                <li>Then, to get the next left digit, floor divide the number by 10 and use the same process described above.<br></br>
                                <div className="code">
                                    print(1234 % 10)<span className="comment"> # Result: 4</span><br></br>
                                    print(1234 // 10 % 10) <span className="comment"> # Result: 3</span><br></br>
                                    print(1234 // 10 // 10 % 10) <span className="comment"> # Result: 2</span><br></br>
                                </div>
                                </li>
                            </ul>
                        </li>
                        <li>Know how to use exponents. For cube root, use <code>(x ** (1/3))</code>, or <code>(cbrt(x))</code> from 
                            the math module
                        </li>
                        <li>Know how to write an if-statement</li>
                    </ul>

                </div>

            </section>

        </>
    );
};

export default ENGR102Mod5;