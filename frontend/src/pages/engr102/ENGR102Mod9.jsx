import { authClient } from '../../scripts/auth';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/styles.css';


const ENGR102Mod9 = () => {

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
                <h1>Module 9 : User-Defined Functions & Mutable/Immutable Data Types</h1>
            </header>

            <section id="center">
                <div style={{
                    padding: "auto",
                    textAlign: "left",
                    width: "60%",
                    margin: "auto",
                    marginBottom: "500px"
                }}>
                    <p>Welcome to module 9! In here we will go over functions, as well as mutable and immutable data types.</p>

                    <h2>Functions</h2>
                    <div className='block'>
                        <p>A <span className='definition'>function</span> is a section of code that is separate from the rest
                            of the code. It is run whenever the code author wants it to.</p>
                        <p>It's kind of like a math function, like <code>f(x)</code>. The name of the function is <code>f</code>,
                            and we input <code>x</code> into it, and it will give us a result.</p>
                        <p>Whenever we want to use a function, we will <span className='definition'>call</span> that function,
                            and its code will run. And once it finishes, the computer will <span className='definition'>return</span> to
                            the code where the function was called from, and continue on.</p>
                        <p>The <code>print()</code> statement is a function that is built into the python language.
                            <ul>
                                <li>We call the print statement by typing <code>print()</code>.</li>
                                <li>The <span className='definition'>argument</span>, or <span className='definition'>parameter</span>,
                                     is the value we put inside the parentheses.</li>
                                <li>Although it does not result in a value, it performs an action by taking the value it was given and 
                                    outputting it to the terminal.
                                </li>
                                <li>Then the computer returns to the code where the print statement was called, and continues on.</li>
                            </ul>
                        </p>
                    </div>

                    <h2>Tuples & Immutable Data</h2>
                    <div className='block'>
                        <p>Functions usually return a single piece of data. But a function might need to return more than one value.</p>
                        <p>A <span className='definition'>tuple</span> alllows this. It's kind of like a list, but once you create
                            the tuple, you cannot change the values inside it.</p>
                        <p>A tuple is an <span className='definition'>immutable</span> data type. This means that we cannot change the 
                            values inside of it like a list. Instead, we have to reassign the tuple with a new one that contains the changes
                            we desire.</p>
                        <p>If a list uses box brackets, a tuple simply uses parentheses.</p>
                        <div className='code'>
                            <span className='comment'> # changing a list's element</span><br></br>
                            my_list = [1,2,3,4,5]<br></br>
                            my_list[2] = 0<br></br><br></br>
                            <span className='comment'> # changing a tuple's element</span><br></br>
                            my_tuple = (1,2,3,4,5)<br></br>
                            my_tuple = (1,2,0,4,5)<br></br><br></br>
                            print(my_list, my_tuple)<br></br><br></br>
                            <span className='comment'> # Result:<br></br>[1, 2, 0, 4, 5] (1, 2, 0, 4, 5)</span>
                        </div><br></br>
                        <div className='code'>
                            <span className='comment'> # changing a tuple's element like this will result in error:</span><br></br>
                            my_tuple = (1,2,3,4,5)<br></br>
                            my_tuple[2] = 0
                        </div>
                        <p>The rest of the operations for tuples are similar to that of lists.</p>
                        <div className='code'>
                            my_tuple = (1, 2, 3, 4, 5)<br></br>
                            second_element = my_tuple[1]<br></br>
                            shorter_tuple = my_tuple[2:]<br></br>
                            print( second_element, shorter_tuple )<br></br><br></br>
                            <span className='comment'> # Result:<br></br>2 (3, 4, 5)</span>
                        </div>
                        <p>We can assign multiple values from a single tuple.</p>
                        <div className='code'>
                            my_tuple = (1, 2, 3)<br></br>
                            x, y, z = my_tuple<br></br>
                            print(x,y,z)<br></br><br></br>
                            <span className='comment'> # Result:<br></br>1 2 3</span>
                        </div>
                        <p>Examples of <span className='definition'>immutable</span> data types are:
                            <ul>
                                <li><code>int</code></li>
                                <li><code>float</code></li>
                                <li><code>str</code> (strings)</li>
                                <li><code>bool</code> (booleans)</li>
                                <li><code>tuple</code></li>
                            </ul>
                        </p>
                        <p>This is because we have to reassign the variable with a new value if we want to change that value.
                            <ul>
                                {/* <li>
                                    <p>For immutable variables, think of Minecraft's curse of binding enchantment. The only way to change 
                                        a piece of armor with the curse of binding (other than breaking it) is by player death and putting
                                        on another piece of armor (variable reassignment).</p></li> */}
                                <li><p><span className='definition'>Note on tuples</span>: just because tuples themselves are immutable,
                                    that doesn't mean their elements are immutable too. </p>
                                    <div className='code'>
                                        <span className='comment'> # create our variables</span><br></br>
                                        x = 0<br></br>
                                        my_list = [1,2,3]<br></br>    
                                        my_tuple = (x, my_list)<br></br><br></br>
                                        <span className='comment'> # let's try changing the tuple</span><br></br>
                                        print(my_tuple)<br></br>
                                        x = 100<br></br>
                                        my_list[2] = 0<br></br>
                                        print(my_tuple)<br></br><br></br>
                                        <span className='comment'> # Result:<br></br>(0, [1, 2, 3])<br></br>(0, [1, 2, 0])</span>
                                    </div>
                                    <p>In the tuple, the <code>int</code> cannot change, but we can still change the elements of the list.</p>
                                    </li>
                            </ul>
                        </p>
                        <p>Examples of <span className='definition'>mutable</span> data types are:
                            <ul>
                                <li><code>list</code></li>
                                <li><code>dict</code> (dictionaries)</li>
                            </ul>
                        </p>
                        <p>This is because we can change a specific element of the value, instead of having to reassign a whole new value
                            each time we want to change the variable.
                        </p>
                    </div>

                    <h2>User-Defined Functions</h2>
                    <div className='block'>
                        <p>We can make our own functions that can take in whatever arguments we want and return any kind of
                            data we want.
                        </p>
                        <p>Completely optional, but you can include a <span className='definition'>docstring</span> in the function
                            to explain what the function does, kind of like a comment.</p>
                        <div className='code'>
                            <span className='comment'> # we define our function here</span><br></br>
                            def multiply(x,y): <span className='comment'> # function header</span><br></br>
                            &nbsp;&nbsp;&nbsp;&nbsp;<span className="comment">'''this function multiplies x and y & returns the result'''</span><br></br>
                            &nbsp;&nbsp;&nbsp;&nbsp;print("x =", x)<br></br>
                            &nbsp;&nbsp;&nbsp;&nbsp;print("y =", y)<br></br>
                            &nbsp;&nbsp;&nbsp;&nbsp;print("x times y is", x*y)<br></br>
                            &nbsp;&nbsp;&nbsp;&nbsp;return x*y <span className='comment'> # return statement</span><br></br>
                        </div>
                        <p>In this example, the name of the function is <code>multiply</code>, and it takes in 2 
                            arguments: <code>x</code> and <code>y</code>. It returns an <code>int</code> value.</p>
                        <p>The docstring says "this function multiplies x and y & returns the result".</p>
                        <p>After defining our function, we can call it.</p>
                        <div className='code'>
                            <span className='comment'> # we call our function here</span><br></br>
                            z = multiply(2,3)<br></br>
                            print("z =", 6)<br></br><br></br>
                            <span className='comment'> # Result:<br></br>
                                x = 2<br></br>y = 3<br></br>x times y is 6<br></br>z = 6
                            </span>
                        </div>
                        <p>And if you need to return multiple values, use a tuple since it technically counts as one value.</p>
                        <div className='code'>
                            def my_function(x,y,z):<br></br>
                            &nbsp;&nbsp;&nbsp;&nbsp;return (x + y, z - x)<br></br><br></br>
                            a, b = my_function(4,2,11)<br></br>
                            print(a, b)<br></br><br></br>
                            <span className='comment'> # Result:<br></br>6 7</span>
                        </div>
                        <h3>Default Parameters</h3>
                        <div className='block'>
                            <p>You might need to know this, altough it is completely optional for coding.</p>
                            <p><span className='definition'>Default parameters</span> are special parameters for a function.</p>
                            <p>The code author sets a default value of these parameters, so they don't have to set it when
                                calling the function.
                            </p>
                            <p>But the code author can still use a different value for these parameters when calling the function. Here's
                                what I mean:
                            </p>
                            <div className='code'>
                                def my_function(a, b=2, c=3): <br></br>
                                &nbsp;&nbsp;&nbsp;&nbsp;<span className='comment'>''' b and c are default parameters '''</span><br></br>
                                &nbsp;&nbsp;&nbsp;&nbsp;print(a, b, c, sep=" -&gt; ")<br></br><br></br>
                                <span className='comment'> # we don't have to specify b or c</span><br></br>
                                my_function(1)<br></br><br></br>
                                <span className='comment'> # we can change b and c if we wanted to</span><br></br>
                                my_function(1, 10, 100)<br></br><br></br>
                                <span className='comment'> # Result:<br></br>
                                1 -&gt; 2 -&gt; 3<br></br>
                                1 -&gt; 10 -&gt; 100</span>
                            </div>
                            <p>Notice how we assigned a value to the parameters <code>b</code> and <code>c</code>.</p>
                            <p><span className='definition'>Note</span>: default parameters must go after the regular parameters,
                                or else the code will error.</p>
                        </div>
                    </div>

                    <h2>Scope of Variables</h2>
                    <div className='block'>
                        <h3>Out of Scope</h3>
                        <div className='block'>
                            <p><span className='definition'>Scope</span> is basically how computers see variables.</p>
                            <p>Look at this example:</p>
                            <div className='code'>
                                x = 1<br></br>
                                if x &gt; 0:<br></br>
                                &nbsp;&nbsp;&nbsp;&nbsp;y = 1<br></br>
                                print(x + y)
                            </div>
                            <p>The print statement will not work because by the time the computer reaches the print
                                statement, <code>y</code> will be <span className='definition'>out of scope</span>.</p>
                            <p>The reason for this is because <code>y</code> was created in the if-statement, so only the things inside
                                the if-statement can access it. And once the if-statement is finished, <code>y</code> will no longer exist.</p>
                            {/* <p>Basically, <code>y</code> was on a higher level than the print statement. Higher levels can access lower levels
                                but lower levels cannot access higher levels.</p> */}
                            <p>Basically, <code>y</code> cannot exist outside the if-statement.</p>
                            <p>This goes for every block of code where there is an indentation.</p>
                            <div className='code'>
                                x = 1<span className='comment'> # here we can only access x</span><br></br>
                                for i in range(10):<br></br>
                                &nbsp;&nbsp;&nbsp;&nbsp;y = 2<span className='comment'> # here we can access x, y, and i</span><br></br>
                                &nbsp;&nbsp;&nbsp;&nbsp;if i &gt; y:<br></br>
                                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;z = 3<span className='comment'> # here we 
                                    can access x, y, i, and z</span>
                            </div>
                            <p>In this case, <code>x</code> is a <span className='definition'>global variable</span> (it can be accessed
                                by anything), while <code>y</code>, <code>i</code>, and <code>z</code> are <span className='definition'>local
                                variables</span> (it can't be accessed from all parts of the code).</p>
                        </div>

                        <h3>Scope in Functions</h3>
                        <div className='block'>
                            <p>In user-defined functions, any variable created inside of it can only be used inside that function...</p>
                            <p>... even if we have a variable with the same name as a variable outside the function.</p>
                            <div className='code'>
                                def my_function():<br></br>
                                &nbsp;&nbsp;&nbsp;&nbsp;x = 100<br></br>
                                &nbsp;&nbsp;&nbsp;&nbsp;print(x)<br></br><br></br>
                                <span className='comment'> # main code</span><br></br>
                                x = 1<br></br>
                                print(x)<br></br>
                                my_function()<br></br>
                                print(x)<br></br><br></br>
                                <span className='comment'> # Result:<br></br>1<br></br>100<br></br>1</span>
                            </div>
                            <p>Notice how the variable name <code>x</code> is used in both the main code and the user-defined
                                function. But when we called <code>my_function()</code>, the function used its own <code>x</code>, 
                                rather than the <code>x</code> in the main code.</p>
                            <p>Then, when we printed <code>x</code> in the main code, it used the variable from the main code,
                                which means the value of <code>x</code> remains unchanged.</p>
                            <p>This is because the function never knew there was an <code>x</code> variable outside of it.</p>
                            <p>If there was no <code>x</code> inside the function, then it would have to access 
                                the <code>x</code> in the main code (I highly do not recommend doing this).</p>
                        </div>
                    </div>
                    



                    <h2>Module 9 Quiz Prep</h2>
                    <p>Here's some points you need to know for the quiz:</p>
                    <ul>
                        <li>Know how to create functions and where in the code to put them
                            <ul>
                                <li>Know how to return more than one value</li>
                            </ul>
                        </li>
                        <li>Know what mutable and immutable is
                            <ul>
                                <li>Know which data types are mutable or immutable</li>
                                <li>Review what happens when changing mutable objects inside immutable variables (see under
                                    "Tuples & Immutable Data")
                                </li>
                            </ul>
                        </li>
                        <li>Know about global and local variables</li>
                        <li>We're writing and tracing code for the quiz</li>
                    </ul>
                    
                </div>
            </section>
        </>
    );

}
export default ENGR102Mod9;