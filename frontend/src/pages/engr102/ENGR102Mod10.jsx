import { authClient } from '../../scripts/auth';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/styles.css';

const ENGR102Mod10 = () => {

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
                <h1>Module 10 : Exceptions & Errors</h1>
            </header>

            <section id="center">
                <div style={{
                    padding: "auto",
                    textAlign: "left",
                    width: "50%",
                    margin: "auto",
                    marginBottom: "500px"
                }}>

                    <p>Welcome to module 10! This is where we talk about what exceptions and errors.</p>
                    <h2>Errors</h2>
                    <div className='block'>
                        <h3>Syntax Errors</h3>
                        <div className='block'>
                            <p>A <span className='definition'>syntax error</span> is an error that happens when we make a typo in our code.</p>
                            <p>Try to find the syntax errors:</p>
                            <div className='code'>
                                <span className='comment'>1 &nbsp;</span>x = 0<br></br>
                                <span className='comment'>2 &nbsp;</span>whie x &lt;= 3:<br></br>
                                <span className='comment'>3 &nbsp;</span>&nbsp;&nbsp;&nbsp;&nbsp;x += 1u<br></br>
                                <span className='comment'>4 &nbsp;</span>&nbsp;&nbsp;&nbsp;&nbsp;if x = 4:<br></br>
                                <span className='comment'>5 &nbsp;</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;print(x is 4")<br></br>
                            </div>
                            <p>Syntax errors from the above is the following
                                <ul>
                                    <li>line 2, spelled <code>while</code> incorrectly</li>
                                    <li>line 3, typed a "u" after <code>x += 1</code></li>
                                    <li>line 4, used assignment operator instead of equality comparator</li>
                                    <li>line 5, forgot the beginning quotation mark</li>
                                </ul>
                            </p>
                        </div>
                        <h3>Runtime Errors</h3>
                        <div className='block'>
                            <p>A <span className='definition'>runtime error</span> (AKA <span className='definition'>exception</span>) is 
                                an error that happens during the time the computer runs the code.</p>
                            <p>Examples of this could be
                                <ul>
                                    <li>Inputting the wrong data type into a function, leading to error</li>
                                    <li>Indexing lists out of bounds</li>
                                    <li>Dividing by zero</li>
                                </ul>
                            </p>
                        </div>
                        <h3>Logic Errors</h3>
                        <div className='block'>
                            <p>A <span className='definition'>logic error</span> is where the code runs perfectly, but we get an output that we
                                did not expect.</p>
                            <p>Examples of this would be
                                <ul>
                                    <li>Incorrect order of operations</li>
                                    <li>Misunderstanding of logic/plan</li>
                                    <li>Wrong numbers</li>
                                    <li>Wrong indentations</li>
                                </ul>
                            </p>
                        </div>
                    </div>


                    <h2>Handling Runtime Errors & Exceptions</h2>
                    <div className='block'>
                        <h3>The try-except statement</h3>
                        <p>We can use the <span className='definition'>try-except statement</span> to prevent the code from exiting
                            when there is an error.</p>
                        <p>It contains 2 blocks: the <code>try</code> block and the <code>except</code> block.</p>
                        <ul>
                            <li><p>Whatever code we put in the <code>try</code> block will be protected from errors. Whenever an error 
                                occurs in this block, the computer will immediately start running the code in 
                                the <code>except</code> block.</p></li>
                            <li><p>The <code>except</code> block should contain the code that will run when an error occurs 
                                in the <code>try</code> block.</p></li>
                        </ul>
                        <div className='code'>
                            my_list = [1,2,3,4]<br></br>
                            try:<br></br>
                            &nbsp;&nbsp;&nbsp;&nbsp;my_list[5] = 5 <span className='comment'> # Normally this would error</span><br></br>
                            &nbsp;&nbsp;&nbsp;&nbsp;print( my_list )<br></br>
                            except:<br></br>
                            &nbsp;&nbsp;&nbsp;&nbsp;print( "could not update my_list" )<br></br><br></br>
                            <span className='comment'> # Result:<br></br>could not update my_list</span>
                        </div>
                        <p>We can make it look for a certain type of error:</p>
                        <div className='code'>
                            x = 0<br></br>
                            try:<br></br>
                            &nbsp;&nbsp;&nbsp;&nbsp;print( 10 / x ) <span className='comment'> # Normally this would error</span><br></br>
                            except ZeroDivisionError:<br></br>
                            &nbsp;&nbsp;&nbsp;&nbsp;print( "could not divide 10 by x" )<br></br><br></br>
                            <span className='comment'> # Result:<br></br>could not divide 10 by x</span>
                        </div>
                        <p>Error types include:
                            <ul>
                                <li><code>TypeError</code>: performing an operation on the wrong data type</li>
                                <li><code>IndexError</code>: trying to access an out-of-bounds index</li>
                                <li><code>ZeroDivisionError</code>: trying to divide by 0</li>
                                <li><code>NameError</code>: trying to access a variable that does not exist</li>
                            </ul>
                        </p>
                        <p>But honestly you don't have to use those </p>
                    </div>
                    <h2>Handling Other Errors & Bugs</h2>
                    <div className='block'>
                        <h3>The DRIFT Debugging Process</h3>
                        <div className='block'>
                            <p>Note that debugging shouldn't be randomly guessing where the bug might come from. Instead, we use
                                a structured method.
                            </p>
                            <p><span className='definition'>Discover</span>: find a repeatable problem</p>
                            <p><span className='definition'>Reproduce</span>: make a test case that reliably gives the wrong answer</p>
                            <p><span className='definition'>Isolate</span>: narrow down the location of the bug</p>
                            <p><span className='definition'>Fix</span>: try to fix the bug</p>
                            <p><span className='definition'>Test</span>: make sure the new code works for all test cases</p>
                        </div>

                        <h3>Debugging Tool</h3>
                        <div className='block'>
                            <p>Totally optional to know btw</p>
                            <p>With VSCode or Spyder or whatever you have, you are likely to have a debugging mode for Python. It 
                                basically just helps trace your code.</p>
                            <p>You can set <span className='definition'>breakpoints</span> (the little red dots next to the line number) so 
                                the code will pause there, and you can
                                click the <span className='definition'>step</span> or <span className='definition'>step-into</span> buttons
                                to run the next line of code.</p>
                            <p>The <span className='definition'>continue</span> button allows us to run all the code until the next
                                set breakpoint (or until the end of the code).</p>
                            <p>And if you don't have a debugging mode, then place print statements in your code to see how variables change
                                and what kind of values are being used as the code runs.
                            </p>
                        </div>
                        
                        <h3>Using the <code>assert</code> statement</h3>
                        <div className='block'>
                            <p>The <code>assert</code> statement basically checks if a value is what it's expected to be, and if not 
                                it will output whatever you set.</p>
                            <p>If the value is not what it's expected to be, it will give us an <code>AssertionError</code>, which will
                                contain the message we set it to have.</p>
                            <div className='code'>
                                x = 5<br></br>
                                y = 7<br></br>
                                assert x &gt; 2, "x is not greater than 2"<br></br>
                                assert y &lt; 4, "y is not less than 4"<br></br><br></br>
                                <span className='comment'> # Result:<br></br>AssertionError: y is not less than 4</span>
                            </div>
                        </div>
                    </div>


                    <h2>Module 10 Quiz Prep</h2>
                    <p>Here's some points you need to know for the quiz:</p>
                    <ul>
                        <li>Know how to distinguish syntax, runtime, and logic errors</li>
                        <li>Know how to spot syntax, runtime, and logic errors</li>
                    </ul>
                    
                </div>
            </section>
        </>
    );

}
export default ENGR102Mod10;