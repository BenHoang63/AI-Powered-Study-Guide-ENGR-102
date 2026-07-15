import { authClient } from '../../scripts/auth';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/styles.css';

const ENGR102Mod1 = () => {

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
                <h1>Module 1 : Introduction to Computing and Python</h1>
            </header>



            <section id="center">
                <div style={{
                    padding: "auto",
                    textAlign: "left",
                    width: "50%",
                    margin: "auto",
                    marginBottom: "500px"
                }}>
                    <p>
                        Welcome to ENGR 102! This course is required for engineering majors going through the ETAM process, and 
                        covers the basics of the Python coding language. Some of y'all might already have your preferred major in mind,
                        and maybe it doesn't seem to involve coding. But coding is actually very valuable because of various reasons:
                    </p>
                    <ul>
                        <li>We can program computers to do hard work for us, such as executing repetitive calculations
                            over a very large dataset.
                        </li>
                        <li>
                            We could solve really complex math, like linear algebra or differential equations. If you're planning to
                            take STAT 211, knowing how to code could really help you. ;)
                        </li>
                        <li>
                            And most importantly, it helps build the foundational knowledge of problem solving that is needed in many
                            math-related courses and in your career.
                        </li>
                    </ul>

                    <h3>Setting Up For the Course</h3>
                    <div className="block">
                        <p>First, download an <a className="definition">integrated development environment</a> (an IDE). I
                            suggest <a href="https://code.visualstudio.com/" target="_blank" rel="noopener noreferrer">VS Code</a>, but your 
                            prof may tell you to use another one. This is basically the software that will allow you edit and run code.</p>
                        <p>Next, download <a href="https://www.python.org/" target="_blank" rel="noopener noreferrer">Python</a>. This is
                            the programming language we will use in the course.</p>
                    </div>

                    <h2>The Print Statement</h2>
                    <div className="block">
                        <p>In coding, printing is basically the computer telling you the output of a value. These values can be of different
                            types (called <a className="definition">data types</a>):</p>
                        <ul>
                            <li><a className="definition">int</a>: stands for integer. An integer is a whole number
                            that is positive, negative, or zero.</li>
                            <li><a className="definition">float</a>: stands for floating-point number (which we just call a float).
                            A float is a number that includes decimals.</li>
                            <li><a className="definition">bool</a>: stands for a boolean value. A boolean represents either <code>True </code>
                            or <code>False</code>.</li>
                            <li><a className="definition">str</a>: stands for string. A string is basically a sequence, or "string",
                            of characters. They are enclosed in either single or double quotes ( ' ' or " " ).</li>
                        </ul>
                        <p>Behold, the Python print statement!</p>
                        <div className="code">print()</div>
                        <p>This will print whatever value is inside the parentheses, followed by a newline.</p>
                        <div className="code">
                            print("Hello World")<br></br><br></br>
                            <span className="comment"> # Output: Hello World</span>
                        </div>
                        <p>In this example, the <code>"Hello World"</code> is a string.</p>
                    </div>



                    

                    <h2>Math</h2>
                    <div className="block">
                        <h3>Basic Math</h3>
                        <div className="block">
                            <p>In Python, there are basic types of math that you can perform.</p>
                            <ul>
                                <li><a className="definition">Addition</a>: add two numbers together using the 
                                plus sign ( + ).</li>
                                <li><a className="definition">Subtraction</a>: subtract two numbers using the 
                                dash character ( - ).</li>
                                <li><a className="definition">Multiplication</a>: multiply two numbers using the 
                                asterisk character ( * ).</li>
                                <li><a className="definition">Division</a>: divide two numbers using the 
                                forward slash character ( / ).</li>
                                <li><a className="definition">Exponentiation</a>: raise a number to the 
                                power of another number using the double asterisk character ( ** ).</li>
                                <li><a className="definition">Floor Division</a>: divide two numbers and 
                                round down to the nearest whole number using the double forward slash character ( // ).</li>
                                <li><a className="definition">Modulus</a>: divide two numbers and get 
                                the remainder using the percent sign character ( % ).</li>
                            </ul>
                            <p>Remember, the order of operations (PEMDAS) still applies in Python.</p>
                            <p><a className='definition'>Resulting data type</a>: there are several rules about what data type you get when you 
                            do certain math operations.</p>
                            <ul>
                                <li>Any operation involving a float will result in a float.</li>
                                <li>Division will always result in a float.</li>
                                <li>Floor division will always result in an integer.</li>
                                <li>Modulus with two integers will result in an integer, otherwise it will result in a float.</li>
                            </ul>
                            <div className="code">
                                10 / 2 <span className="comment"> # -&gt; 5.0</span><br></br>
                                10 // 2 <span className="comment"> # -&gt; 5</span><br></br>
                                10 % 3 <span className="comment"> # -&gt; 1</span><br></br>
                            </div>
                        </div>


                        <h3>The Math Module</h3>
                        <div className="block">
                            <p>In Python, <a className="definition">modules</a> are like addons for your code that allow you to use other 
                                functions. To utilize more advanced math functions, you can use the math module. </p>
                            <p>First, we need to import the module. You will need to use this syntax at the beginning of your Python code:
                            </p>
                            <div className="code">from math import *</div>
                            <p>This means we want everything (symbolized by the asterisk) from the math module. Here are some functions
                                that are in this module:</p>
                            <ul>
                                <li><a className="definition">sqrt(x)</a>: Computes the square
                                root of a value <code>x</code>. </li>
                                <li><a className="definition">fabs(x)</a>: Takes the absolute value of <code>x</code>. </li>
                                <li><a className="definition">sin(x), cos(x), tan(x)</a>: Computes the sine, cosine, and tangent of <code>x</code>, 
                                respectively. </li>
                            </ul>
                            <p><a className="definition">Note</a>: These functions will output a float, unless it is a function that
                            rounds to a whole number (like <code>floor()</code>, <code>ceil()</code>, and <code>round()</code>). </p>
                            <div className="code">
                                print(sqrt(4))<br></br><br></br>
                                <span className="comment"> # Result: 2.0</span>
                            </div>
                        </div>
                    </div>
                    

                
                </div>
            </section>
        </>
    );

}
export default ENGR102Mod1;