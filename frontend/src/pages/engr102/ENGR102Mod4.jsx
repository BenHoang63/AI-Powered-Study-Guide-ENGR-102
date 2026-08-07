import { authClient } from '../../scripts/auth';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/styles.css';


const ENGR102Mod4 = () => {

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
                <h1>Module 4 : Boolean Expressions and Conditionals</h1>
            </header>

            <section id="center">
                <div style={{
                    padding: "auto",
                    textAlign: "left",
                    width: "60%",
                    margin: "auto",
                    marginBottom: "500px"
                }}>

                    <h2>Boolean Expressions</h2>
                    <div className="block">
                        <p>Welcome to module 4! In this module, we will be learning about boolean expressions and conditionals. </p>
                        <p>Recall that <span className="definition">booleans</span> can be either <code>True</code> or <code>False</code>.</p>
                        <p><span className="definition">Boolean expressions</span> are 
                        expressions that evaluate to either <code>True</code> or <code>False</code>.</p>

                        <h3>Relational Operators</h3>
                        <div className="block">
                        
                            <p>Boolean expressions are created using <span className="definition">relational operators</span>. They
                                are:</p>
                            <ul>
                                <li><code>==</code> for equality (equal to)</li>
                                <li><code>!=</code> for inequality (not equal to)</li>
                                <li><code>&lt;</code> for less than</li>
                                <li><code>&gt;</code> for greater than</li>
                                <li><code>&lt;=</code> for less than or equal to</li>
                                <li><code>&gt;=</code> for greater than or equal to</li>
                            </ul>
                            <p>Let's try some examples using variables:</p>
                            <p className="code"><span className="comment"># Example:</span><br></br>
                                x = 2<br></br>
                                y = 4<br></br>
                                print(x == y) # False<br></br>
                                print(x != y) # True<br></br>
                                print(x &lt; y) # True<br></br>
                                print(x &gt; y) # False<br></br>
                                print(x &lt;= y) # True<br></br>
                                print(x &gt;= y) # False
                            </p>

                        </div>
                        
                        <h3>Boolean Operators</h3>
                        <div className="block">
                                <p><span className="definition">Boolean operators</span> are used to combine multiple boolean expressions. They are:</p>
                                <ul>
                                    <li><code>not</code> for negation</li>
                                    <li><code>and</code> for conjunction</li>
                                    <li><code>or</code> for disjunction</li>
                            </ul>
                            <p>To signify that a boolean is negated, use the <code>not</code> keyword.</p>
                            <p className="code"><span className="comment"># Example:</span><br></br>
                                print(not True) <span className="comment"># False</span><br></br>
                                print(not False) <span className="comment"># True</span>
                            </p>
                            <p>If you want to combine multiple boolean expressions, use the <code>and</code> and <code>or</code> keywords.</p>
                            <p className="code"><span className="comment"># Example:</span><br></br>
                                print(True and False) <span className="comment"># False</span><br></br>
                                print(True or False) <span className="comment"># True</span>
                            </p><p><span className="definition">Note on order of operations:</span> In computing, arithmetic operators (PEMDAS) go first, 
                        then relational operators, then boolean operators (not, and, or).</p>
                        </div>
                        

                    </div>

                    <h2>The If Statement</h2>
                    <div className="block">
                        <p><span className="definition">If statements</span> are used to conditionally execute code.</p>
                        <pre className="code">
                            <span className="comment"># Example:</span><br></br>
                            grade = 85<br></br>
                            if grade &gt;= 60:<br></br>
                                &nbsp;&nbsp;&nbsp;&nbsp;<span className="comment"># This line will only execute if the condition is true</span>
                                <br></br>
                                &nbsp;&nbsp;&nbsp;&nbsp;print("You passed!")
                        </pre>
                        <p><span className="definition">Note:</span> Notice that there is a colon at the end of the if statement, 
                        and that the print statement is indented. This is very important in Python!</p>
                        <p>The <span className="definition">elif block</span>, which is short for "else if", is used to conditionally execute 
                            code if the previous conditions are false. The <span className="definition">else block</span> will execute if all 
                            the previous conditions are false.</p>
                        <pre className="code">
                            <span className="comment"># Example:</span><br></br>
                            grade = 85<br></br>
                            if grade &gt;= 90:<br></br>
                                &nbsp;&nbsp;&nbsp;&nbsp;print("You made an A!")<br></br>
                            elif grade &gt;= 80:<br></br>
                                &nbsp;&nbsp;&nbsp;&nbsp;print("You made a B!")<br></br>
                            elif grade &gt;= 70:<br></br>
                                &nbsp;&nbsp;&nbsp;&nbsp;print("You made a C!")<br></br>
                            elif grade &gt;= 60:<br></br>
                                &nbsp;&nbsp;&nbsp;&nbsp;print("You made a D!")<br></br>
                            else:<br></br>
                                &nbsp;&nbsp;&nbsp;&nbsp;print("You failed!")<br></br><br></br>
                            <span className="comment"># Result:</span><br></br>
                            <span className="comment">You made a B!</span>
                        </pre>
                        <p>You can also use nested <span className="definition">if-statements</span> to check for multiple conditions. 
                        This just means you have an if-statement inside another if-statement.
                        </p>
                        <pre className="code">
                            <span className="comment"># Example:</span><br></br>
                            grade = 92<br></br>
                            if grade &gt;= 60:<br></br>
                                &nbsp;&nbsp;&nbsp;&nbsp;print("You passed!")<br></br>
                                &nbsp;&nbsp;&nbsp;&nbsp;if grade &gt;= 90:<br></br>
                                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;print("You made an A!")<br></br><br></br>
                                

                            <span className="comment"># Result:</span><br></br>
                            <span className="comment">You passed!</span><br></br>
                            <span className="comment">You made an A!</span>
                        </pre>

                        <h3>Using the <code>in</code> Keyword</h3>
                        <div className="block">
                            <p>In addition to using relational operators to check for equality, you can also use 
                                the <span className="definition">in</span> keyword to find a specific 
                                character (or set of characters) in a string. Or, you can also use it to check 
                                for an element in a list. </p>
                            <pre className="code">
                                <span className="comment"># Example:</span><br></br>
                                my_string = "yogurt"<br></br>
                                if "gurt" in my_string:<br></br>  
                                &nbsp;&nbsp;&nbsp;&nbsp;print("gurt: yo")<br></br><br></br>
                                <span className="comment"># Result:</span><br></br>
                                <span className="comment">gurt: yo</span>
                            </pre>
                            <p>If you want to check if a certain string is not in another string, we use the keyword <code>not</code>.</p>
                            <p>Let's check if the string <code>"yellow"</code> is not in <code>my_string</code>.</p>
                            <div className='code'>
                                my_string = "red, orange, green, blue, and purple"<br></br>
                                if not "yellow" in my_string:<br></br>
                                &nbsp;&nbsp;&nbsp;&nbsp;print( "yellow is not in the string" )<br></br><br></br>
                                <span className='comment'> # Result:<br></br>yellow is not in the string</span>
                            </div>
                        </div>
                    </div>



                    <h2>Module 4 Quiz Prep</h2>
                    <p>Here's some points you need to know for the quiz:</p>
                    <ul>
                        <li>Know all the valid uses of relational operators</li>
                        <li>Know how to evaluate boolean expressions</li>
                        <li>Review stuff from the math module</li>
                        <li>Know how to write an if-statement</li>
                    </ul>



                </div>

            </section>

        </>
    );
};

export default ENGR102Mod4;