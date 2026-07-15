import { authClient } from '../../scripts/auth';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/styles.css';

const ENGR102Mod6 = () => {

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
                <h1>Module 6 : Loops</h1>
            </header>

            <section id="center">
                <div style={{
                    padding: "auto",
                    textAlign: "left",
                    width: "50%",
                    margin: "auto",
                    marginBottom: "500px"
                }}>
                    <p>Welcome to Module 6! This one's about loops, which allows to repeat a set of code based on a condition.</p>
                    <h2>While Loops</h2>
                    <div className="block">
                        <p>The simplest form of a loop is a <a className="definition">while loop</a>. It operates by checking a condition, and 
                        if the condition is true, it will execute the code inside the loop. It will continue to do this until the 
                        condition is false.</p>
                        <div className="code">
                            x = 0<br></br>
                            while x &lt; 5:<br></br>
                                &nbsp;&nbsp;&nbsp;&nbsp;<span className="comment"># this indented section is the body of the loop</span><br></br>
                                &nbsp;&nbsp;&nbsp;&nbsp;print(x,end=" -&gt; ")<br></br>
                                &nbsp;&nbsp;&nbsp;&nbsp;x += 1<br></br>
                            print("Loop finished")<br></br><br></br>

                            <span className="comment"># Result:</span><br></br>
                            <span className="comment">0 -&gt; 1 -&gt; 2 -&gt; 3 -&gt; 4 -&gt; Loop finished</span>
                        </div>
                        <p>In this example, the loop will print the value of <code>x</code> five times, and then it will print "Loop finished".</p>
                        <p>Note that the code inside of the loop is indented. Anything that is not indented will not be ran as 
                            part of the loop.
                        </p>
                        <p>An <a className="definition">infinite loop</a> is a loop that will run forever. This can happen if the condition 
                            of the loop is always true. It's also a good way to crash your program 👀
                        </p>
                        <div className="code">
                            x = 1<br></br>
                            while x &gt; 0:<br></br>
                                &nbsp;&nbsp;&nbsp;&nbsp;x = x + 1<br></br>
                                &nbsp;&nbsp;&nbsp;&nbsp;print(x)<br></br><br></br>
                            <span className="comment"># This is an example of an infinite loop because x will never be less than 0.</span>
                        </div>
                        <p>If you find yourself stuck in a while loop, just press <kbd>Ctrl + C</kbd> to exit it 👍</p>


                    </div>

                    <h2>For Loops and <code>range()</code></h2>
                    <div className="block">
                        <p>A <a className="definition">for loop</a> is a loop that iterates over a sequence of values. It operates by 
                        taking each value in the sequence and executing the code inside the loop. It will continue to do this until
                        all the values in the sequence have been processed.
                        </p>
                        <p>Here's a for loop that counts from 0 to 10:</p>
                        <div className="code">
                            for i in range(11):<br></br>
                                &nbsp;&nbsp;&nbsp;&nbsp;<span className="comment"># this indented section is the body of the loop</span><br></br>
                                &nbsp;&nbsp;&nbsp;&nbsp;print(i,end=" -&gt; ")<br></br><br></br>

                                <span className="comment"># Result:</span><br></br>
                                <span className="comment">0 -&gt; 1 -&gt; 2 -&gt; 3 -&gt; 4 -&gt; 5 -&gt; 6 -&gt; 7 -&gt; 8 -&gt; 9 -&gt; 10</span>
                        </div>
                        <p>Notice how <code>range(11)</code> counts up to 10, but does not include 11. 
                        This is because Python's <code>range()</code> function counts up from zero all the way to, but not including, the 
                        number you provide. There are 11 values in this sequence; since it starts at 0, it will end at 10.
                        </p>
                        <p>In this example, the variable <code>i</code> takes on the value of each number in the sequence. So the first 
                        time the loop runs, <code>i</code> will be 0. The second time the loop runs, <code>i</code> will be 1, and so on.
                        </p>
                        <p>If you provide 2 numbers to <code>range()</code>, it will count up from the first number to the second number
                        (exclusive of the second number). Here's a for loop that counts from 5 to 10:</p>
                        <div className="code">
                            for i in range(5, 11):<br></br>
                                &nbsp;&nbsp;&nbsp;&nbsp;print(i,end=" -&gt; ")<br></br><br></br>

                                <span className="comment"># Result:</span><br></br>
                                <span className="comment">5 -&gt; 6 -&gt; 7 -&gt; 8 -&gt; 9 -&gt; 10</span>
                        </div>
                        <p>There's also a third argument you can provide to <code>range()</code>, which is the step. This tells the loop
                        how much to increment by each time. Here's an example of counting up to 10 by 2's:
                        </p>
                        <div className="code">
                            for i in range(0, 11, 2):<br></br>
                                &nbsp;&nbsp;&nbsp;&nbsp;print(i,end=" -&gt; ")<br></br><br></br>

                                <span className="comment"># Result:</span><br></br>
                                <span className="comment">0 -&gt; 2 -&gt; 4 -&gt; 6 -&gt; 8 -&gt; 10</span>
                        </div>
                        <p>You can also use a step of negative numbers to count down. Here's an example of counting down from 10 to 1:
                        </p>
                        <div className="code">
                            for i in range(10, 0, -1):<br></br>
                                &nbsp;&nbsp;&nbsp;&nbsp;print(i,end=" -&gt; ")<br></br><br></br>

                                <span className="comment"># Result:</span><br></br>
                                <span className="comment">10 -&gt; 9 -&gt; 8 -&gt; 7 -&gt; 6 -&gt; 5 -&gt; 4 -&gt; 3 -&gt; 2 -&gt; 1</span>
                        </div>
                    </div>


                    <h2>Nested Loops</h2>
                    <div className="block">
                        <p>A <a className="definition">nested loop</a> is a loop that is inside of another loop. It operates by 
                        taking each value in the outer loop's sequence and executing the inner loop. It will continue to do this until
                        all the values in the outer loop's sequence have been processed.
                        </p>
                        <div className="code">
                            for i in range(2):<br></br>
                                &nbsp;&nbsp;&nbsp;&nbsp;for j in range(3):<br></br>
                                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;print(i,j)<br></br><br></br>
                                    <span className="comment"># Result:</span><br></br>
                            <span className="comment">0 0</span><br></br>
                            <span className="comment">0 1</span><br></br>
                            <span className="comment">0 2</span><br></br>
                            <span className="comment">1 0</span><br></br>
                            <span className="comment">1 1</span><br></br>
                            <span className="comment">1 2</span><br></br>
                            <span className="comment">2 0</span><br></br>
                            <span className="comment">2 1</span><br></br>
                            <span className="comment">2 2</span><br></br>
                        </div>
                    </div>

                    <h2>The <code>break</code> and <code>continue</code> Statements</h2>
                    <div className="block">
                        <p>The <a className="definition">break statement</a> is used to exit a loop early. Once
                        the <code>break</code> statement is executed, the loop will terminate immediately and the program will 
                        continue to execute the code outside of the loop.
                        </p>
                        <div className="code">
                            for i in range(6):<br></br>
                                &nbsp;&nbsp;&nbsp;&nbsp;if i == 3:<br></br>
                                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;break<br></br>
                                &nbsp;&nbsp;&nbsp;&nbsp;print(i)<br></br><br></br>

                                <span className="comment"># Result:</span><br></br>
                                <span className="comment">0</span><br></br>
                                <span className="comment">1</span><br></br>
                                <span className="comment">2</span><br></br>
                        </div>
                        <p><span className='definition'>Note</span>: If <code>break</code> is used in a nested loop, it will only 
                        exit the loop it was called in (the innermost loop). The outer loop will continue as normal
                        </p>

                        <p>The <span className="definition">continue statement</span> is used to skip the rest of the code 
                        inside the loop for the current iteration. Once the <code>continue</code> statement is executed, the loop will 
                        skip the rest of the code for the current iteration and move on to the next iteration.
                        </p>
                        <div className="code">
                            for i in range(6):<br></br>
                                &nbsp;&nbsp;&nbsp;&nbsp;if i == 3:<br></br>
                                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;continue<br></br>
                                &nbsp;&nbsp;&nbsp;&nbsp;print(i)<br></br><br></br>

                                <span className="comment"># Result:</span><br></br>
                                <span className="comment">0</span><br></br>
                                <span className="comment">1</span><br></br>
                                <span className="comment">2</span><br></br>
                                <span className="comment">4</span><br></br>
                                <span className="comment">5</span><br></br>
                        </div>
                    </div>

                    <h2>The <code>else</code> Statement</h2>
                    <div className="block">
                        <p>In loops, the <code>else</code> statement will execute if the loop completes normally (i.e., without 
                            encountering a <code>break</code> statement).</p>
                        <div className="code">
                            for i in range(3):<br></br>
                                &nbsp;&nbsp;&nbsp;&nbsp;print(i)<br></br>
                            else:<br></br>
                                &nbsp;&nbsp;&nbsp;&nbsp;print("Loop completed normally")<br></br><br></br>

                                <span className="comment"># Result:</span><br></br>
                                <span className="comment">0</span><br></br>
                                <span className="comment">1</span><br></br>
                                <span className="comment">2</span><br></br>
                                <span className="comment">Loop completed normally</span><br></br>
                        </div>
                    </div>


                    <h2>Module 6 Quiz Prep</h2>
                    <p>Here's some points you need to know for the quiz:</p>
                    <ul>
                        <li>Know how to use <code>for</code> and <code>while</code> loops
                            <ul>
                                <li>For loops usually use a sequence (like <code>range()</code>, or a list)</li>
                                <li>While loops use a condition that evaluates to True or False</li>
                            </ul>
                        </li>
                        <li>Know how to use <code>range()</code></li>
                        <li>Know how to use <code>break</code> and <code>continue</code>
                            <ul>
                                <li><code>break</code> exits the current loop immediately</li>
                                <li><code>continue</code> skips the rest of the code for the current iteration</li>
                            </ul>
                        </li>
                    </ul>
                    
                </div>
            </section>
        </>
    );

}
export default ENGR102Mod6;