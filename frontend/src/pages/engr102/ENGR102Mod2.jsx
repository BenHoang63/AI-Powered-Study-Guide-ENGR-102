import { authClient } from '../../scripts/auth';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/styles.css';

const ENGR102Mod2 = () => {

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
                <h1>Module 2 : Variables and Expressions</h1>
            </header>

            <section id="center">
                <div style={{
                    padding: "auto",
                    textAlign: "left",
                    width: "50%",
                    margin: "auto",
                    marginBottom: "500px"
                }}>
                    <h2>Variables</h2>
                    <div className="block">
                    <p>In code, a <a className="definition">variable</a> is basically a storage 
                    place for a value. You can think of it like a labeled box. This is a variable:</p>
                    <p className="code">x = 2</p>
                    <p>Here, the variable is named <code>x</code> and it holds the value of 2. The equals sign means we want
                    to set the value of <code>x</code> to 2. (we are not comparing x and 2 for equality). You can also use variables
                        in expressions, and you can reassign variables to new values.</p>
                    <p className="code">
                        x = 2 <br></br>
                        y = 3 <br></br>
                        print(x + y)<br></br>
                        x = 5
                    </p>
                    <p>In this example, <code>x</code> is first assigned to hold the value 2, and <code>y</code> is first assigned to 
                    hold the value of 3. Then, the print statement adds <code>x</code> and <code>y</code> together, and prints 
                    the result to the terminal. Finally, <code>x</code> is reassigned to hold the value of 5.</p>
                    <p>By the way, the left side of the equals sign can only have one variable.</p>

                    <h3>Variable Names</h3>
                    <div className="block">
                    <p>While you can name variables whatever you want, there are some guidelines you should follow.</p>
                    <ul>
                        <li>Variable names can only contain letters, numbers, and underscores ( _ ).</li>
                        <li>Variable names cannot start with a number.</li>
                        <li>Variable names cannot be exact Python keywords (such as print, if, else, for, while, etc.).</li>
                        <li>Variable names are case-sensitive (myVariable is different from myvariable).</li>
                    </ul>
                    </div>
                    </div><br></br>






                    <h2>Expressions</h2>
                    <div className="block">
                    <p>An <a className="definition">expression</a> is a piece of code that evaluates to a value. Think about expressions
                    in the same way you would think about math problems. Examples:</p>
                    <div className="code">
                        x<br></br>
                        x + 2<br></br>
                        x + 2 * 4
                    </div>
                    <p>Just make sure to include an arithmetic operator between each value.</p>
                    <div className="code">
                        <span className="comment"># examples of what NOT to do:</span><br></br>
                        2x<br></br>
                        xy
                    </div>
                    <p>And remember, the order of operations (PEMDAS) applies to programming as well!</p>


                    <h3>A Shortcut for Reassigning Values</h3>
                    <div className="block">
                        <p>Sometimes, you may want to update a variable based on its current value. For example:</p>
                        <div className="code">
                            x = 2<br></br>
                            x = x + 1
                        </div>
                        <p>Instead of doing that, you can use a shortcut by combining the arithmetic and assignment operators:</p>
                        <div className="code">
                            x = 2<br></br>
                            x += 1
                        </div>
                        <p>The same logic applies for subtraction, multiplication, and division.</p>
                        <p><a className="definition">Note</a>: the specified arithmetic operator is applied after the right side of the
                            equals sign is evaluated.</p>
                        <p className="code">
                            x = 2<br></br>
                            y = 3<br></br>
                            z = 0<br></br><br></br>
                            <span className="comment"># the following two lines are equivalent:</span><br></br>
                            z *= x + y<br></br>
                            z = z * (x + y)
                        </p>
                    </div>
                    </div>
                    
                    <br></br>




                    <h2>Module 2 Quiz Prep</h2>
                    <p>Here's some points you need to know for the quiz:</p>
                    <ul>
                        <li>Order of operations matters!</li>
                        <li>Know how to evaluate expressions</li>
                        <li>Resulting data types from math operations (see <a href="/engr102/module1">module 1</a>, resulting 
                            data types section)</li>
                        <li>Know each of the variable naming rules</li>
                        <li>Know how to use the math module</li>
                        <li>Know the shortcut operators for reassigning values (<code>+=</code>, <code>-=</code>, etc.)</li>
                        
                        
                    </ul>

                </div>
            </section>
        </>
    );

}
export default ENGR102Mod2;