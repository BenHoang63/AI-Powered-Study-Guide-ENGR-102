import { authClient } from '../../scripts/auth';
import { isAuthorized, isDemoMode } from '../../scripts/demo';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/styles.css';


const ENGR102Mod3 = () => {

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
                <h1>Module 3 : Types and Strings</h1>
            </header>

            <section id="center">
                <div style={{
                    padding: "auto",
                    textAlign: "left",
                    width: "60%",
                    margin: "auto",
                    marginBottom: "500px"
                }}>
                    
                    <h2>Data Types</h2>
                    <div className="block">
                        <p>We've learned about <code>int</code>, <code>float</code>, <code>bool</code>, and <code>str</code> in <a> </a>
                            <a href="/engr102/module1">module 1</a>.
                            Now let's talk more about strings. Strings are used to store text. 
                            They are created by enclosing text in quotes. 
                        </p>
                        <p><a className="definition">Note</a>: the quotes are not part of the string itself. They are used to define the
                            start and end of the string. 
                        </p>
                        <p>Also, if you want to create a string that contains quotes, there are a few ways to do this.</p> 
                        <ul>
                            <li>
                                You can "escape" the quotes using a backslash. 
                                Basically, put a backslash in front of the quote to tell the computer to treat it as a normal character.
                            </li>
                            <li>
                                Enclose the string in single quotes, then you can use double quotes in the string. 
                                (vice versa if you need to use single quotes)
                            </li>
                            <li>
                                Enclose the string in triple quotes, then you can use both single and double quotes in the string.
                            </li>
                        </ul>
                        
                        <div className="code">
                            <span className="comment"># all these should result in the same string</span><br></br>
                            myString1 = "This is a \"string\"."<br></br>
                            myString2 = 'This is a "string".'<br></br>
                            myString3 = """This is a "string"."""
                        </div>

                        <p><span className='definition'>Escape characters</span> are used to represent special characters in strings. They 
                            all begin with a backslash. Some common escape characters include: <br></br>
                        </p>
                        <ul>
                            <li>  <code> \n </code> for newline</li>
                            <li>  <code> \t </code> for tab</li>
                            <li>  <code> \\ </code> for backslash</li>
                            <li>  <code> \" </code> for double quote</li>
                            <li>  <code> \' </code> for single quote</li>
                        </ul>
                        <p className="code"><span className='comment'># Example:</span><br></br> 
                            print("hello\nworld") 
                        </p>    
                        <div className="code">
                            <span className="comment"># Output:</span><br></br>
                            hello<br></br>
                            world
                        </div>
                        
                        <h3>Type Behaviors</h3>
                        <div className="block">
                            <p><a className='definition'>Resulting data type</a>: recall from <a href="/engr102/module1">module 1</a> that 
                            there are several rules about what data type you get when you do certain math operations.</p>
                            <ul>
                                <li>Any operation involving a float will result in a float.</li>
                                <li>Division will always result in a float.</li>
                                <li>Floor division will always result in an integer.</li>
                                <li>Modulus with two integers will result in an integer, otherwise it will result in a float.</li>
                            </ul>
                            <p><span className='definition'>Booleans</span>: recall that booleans are 
                                either <code>True</code> or <code>False</code>. In Python, <code>True</code> is equivalent to 1
                                and <code>False</code> is equivalent to 0.</p>
                            <p><span className='definition'>Strings</span>: in Python, adding two strings together is
                                called <span className='definition'>concatenation</span>. Basically, we're connecting two strings together.
                                And <span className='definition'>string repitition</span> is when you multiply a string by an integer, 
                                which repeats the string.
                            </p>
                            <p><span className='definition'>Arithmetic</span>: the behavior of arithmetic operators 
                                depends on the types of the operands.</p>
                            <pre className="code">
                                2 * 3              <span className="comment"># Result: 6</span><br></br>
                                "hello" * 3        <span className="comment"># Result: "hellohellohello"</span><br></br>
                                10 * False         <span className="comment"># Result: 0</span><br></br>
                                10.0 * True        <span className="comment"># Result: 10.0</span><br></br>
                                "True" * 3         <span className="comment"># Result: "TrueTrueTrue"</span><br></br>
                                <br></br>
                                12 + 34            <span className="comment"># Result: 46</span><br></br>
                                "12" + "34"        <span className="comment"># Result: "1234"</span><br></br>
                                True + False       <span className="comment"># Result: 1</span><br></br>
                            </pre>
                        </div>

                        <h3>Type Casting</h3>
                        <div className="block">
                            <p><span className='definition'>Type casting</span> is the process of converting a value from one data type to another. 
                                Python has built-in functions for type casting: <code>int()</code>, <code>float()</code>, <code>bool()</code>, 
                                and <code>str()</code>. In the parentheses, we put the value we want to convert. There are a few rules, however.
                            </p>
                            <ul>
                                <li>Anything can be converted to a string.</li>
                                <li>When converting a float to an int, it chops off the decimal.</li>
                                <li>
                                    When converting a string to a number, the string must represent a valid number.
                                    <ul>
                                        <li>When converting a string to an int, the string cannot have a decimal.</li>
                                    </ul>
                                </li>
                                <li>With booleans, an empty string is <code>False</code>, but any non-empty string is <code>True</code>.</li>
                                <li><span className='definition'>Note</span>: if you try to convert between incompatible data types, you
                                    will get a <code>TypeError</code>.</li>
                            </ul>
                            <pre className="code">
                                <span className="comment"># examples of what can work:</span><br></br>
                                int(10.6)          <span className="comment"># Result: 10</span><br></br>
                                float("1.17")      <span className="comment"># Result: 1.17</span><br></br>
                                str(True)          <span className="comment"># Result: "True"</span><br></br>
                                bool(0)            <span className="comment"># Result: False</span><br></br>
                                bool("")           <span className="comment"># Result: False</span><br></br>
                                bool("False")      <span className="comment"># Result: True</span><br></br>
                                <br></br>
                                <span className="comment"># examples of what will NOT work:</span><br></br>
                                int("3.14")        <span className="comment"># Result: Error</span><br></br>
                                int("hello")       <span className="comment"># Result: Error</span><br></br>
                                float("10.6hello") <span className="comment"># Result: Error</span><br></br>
                            </pre>
                        </div>
                        <br></br>
                    </div>

                    <h2>Input/Output</h2>
                    <div className="block">
                        <h3>Output Using the Print Statement</h3>
                        <p>Recall that using the print statement allows us to display the value of a variable or a string. 
                            To display multiple values, we use commas to separate them. The function will add a space between each value.</p>
                        <pre className="code">
                            print("Class of",2028,"!")<br></br>
                            <span className="comment"># Output: Class of 2028 !  </span><br></br>
                        </pre>
                        <p>If we wanted to separate values with another character or string, we can change the <code>sep</code> argument.
                        The default value for <code>sep</code> is a space " ".</p>
                        <pre className="code">
                            print("Class of",2028,"!", sep="-")<br></br>
                            <span className="comment"># Output: Class of-2028-!  </span><br></br>
                        </pre>
                        <p>Another argument we can use is <code>end</code>. By default, it will add a newline character <code>\n</code> at 
                            the end of the print statement. So changing this will allow us to change what is at the end of the print statement.</p>
                        <pre className="code">
                            print("Class of",2028, end="! ")<br></br>
                            print("Same line")<br></br>
                            <span className="comment"># Output: Class of 2028! Same line</span><br></br>
                        </pre>
                        <p>Another way of formatting output is to 
                            use <span className='definition'>f-string</span> formatting, which allows us to put variables and values inside
                            a string.</p>
                        <p>To use f-string formatting, we put an <code>f</code> before the opening quote of the string. 
                            Then we can put the values we want to display in curly braces.</p>
                        <pre className="code">
                            year = 2028<br></br>
                            print(f"Class of {"{year}!"}")<br></br>
                            <span className="comment"># Output: Class of 2028!  </span><br></br>
                        </pre>
                        <p>We can also format the number of decimal places in a floating point number using f-strings.
                            To do this, we use the following format:</p>
                            <code>{"{number:.{number_of_decimal_places}f}"}</code>
                        <pre className="code">
                            from math import *<br></br>
                            print(f"The number is {"{pi:.4f}"}")<br></br>
                            <span className="comment"># Output: The number is 3.1416</span><br></br>
                        </pre>





                        <h3>Input Using the Input Statement</h3>
                        <p>The <code>input()</code> function can be used to get input from the user. 
                            The function will wait for the user to type something in the terminal and press enter. 
                            The input will be returned as a string.</p>
                        <p>Whatever you put in the parentheses will display on the terminal as a prompt.</p>
                        <pre className="code">
                            <span className="comment"># Input from user</span><br></br>
                            name = input("Enter your name: ")<br></br>
                            age = input("Enter your age: ")<br></br>
                            print(f"{"{name}"} is {"{age}"} years old.")<br></br>
                            <span className="comment"># Output:</span><br></br>
                            <span className="comment"># Enter your name: John</span><br></br>
                            <span className="comment"># Enter your age: 20</span><br></br>
                            <span className="comment"># John is 20 years old.</span><br></br>
                        </pre>
                        <p>Since the input is always returned as a string, we will need to convert it to a number if we want to do 
                            mathematical operations with it. We can do this using the <code>int()</code> and <code>float()</code> 
                            functions.</p>
                        <pre className="code">
                            from math import *<br></br>
                            number = input("Enter a number: ")<br></br>
                            <br></br>
                            <span className="comment"># typecast from string to int</span><br></br>
                            number = int(number) <br></br>
                            <br></br>
                            <span className="comment"># use pi to find the area of a circle</span><br></br>
                            new_number = pi * number**2<br></br>
                            <br></br>
                            print("The area is", new_number)<br></br>
                            <span className="comment"># Output:</span><br></br>
                            <span className="comment"># Enter a number: 10</span><br></br>
                            <span className="comment"># The area is 314.1592653589793</span><br></br>
                        </pre>
                        <br></br>
                    </div>

                    <h2>Functions</h2>
                    <div className="block">
                        <p><span className='definition'>Functions</span> are blocks of code that perform a specific task. 
                        They help to make code more organized and reusable.</p>
                        <p>The general syntax for a function is:</p>
                        <pre className="code">
                            def function_name(x):<br></br>
                                &nbsp;&nbsp;&nbsp;&nbsp;# function body<br></br>
                                &nbsp;&nbsp;&nbsp;&nbsp;return<br></br>
                        </pre>
                        <p>These are kind of like functions in mathematics, but we are able to 
                            perform any programming tasks in the function body.</p>
                        <p>The <span className='definition'>return value</span> is whatever the function will result in. 
                            We can program functions to not return anything.
                        </p>
                        <p>Let's make a function that returns the sum of three numbers. Then we <span className='definition'>call</span> the
                            function with the numbers 1, 2, and 3. </p>
                        <pre className="code">
                            def sum(x,y,z):<br></br>
                                &nbsp;&nbsp;&nbsp;&nbsp;total = x + y + z<br></br>
                                &nbsp;&nbsp;&nbsp;&nbsp;return total<br></br>
                            <br></br>
                            new_number = sum(1,2,3)<br></br>
                            print(new_number)<br></br>
                            <span className="comment"># Output: 6</span><br></br>
                        </pre>
                        <br></br>
                    </div>

                    <h2>Module 3 Quiz Prep</h2>
                    <p>Here's some points you need to know for the quiz:</p>
                    <ul>
                        <li>Know about strings & how to define them (single quotes, double quotes, triple quotes)</li>
                        <li>Know about the print function, arguments (<code>sep</code>, <code>end</code>), and how to use them</li>
                        <li>Know about f-string formatting and how to use it</li>
                        <li>Know about the input function and how to use it</li>
                        <li>Know about functions and how to call them</li>
                    </ul>


                </div>
            </section>
        </>
    );

}
export default ENGR102Mod3;