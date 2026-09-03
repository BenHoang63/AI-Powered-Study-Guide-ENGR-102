import { authClient } from '../../scripts/auth';
import { isAuthorized, isDemoMode } from '../../scripts/demo';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/styles.css';


const ENGR102Mod8 = () => {

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
                <h1>Module 8 : Top-Down Design & Dictionaries</h1>
            </header>

            <section id="center">
                <div style={{
                    padding: "auto",
                    textAlign: "left",
                    width: "60%",
                    margin: "auto",
                    marginBottom: "500px"
                }}>
                    <p>Welcome to module 8, where we talk about top-down design (a method of designing things) and 
                        dictionaries (part of the python coding language).
                    </p>
                    <h2>Top-Down Design</h2>
                    <div className='block'>
                        <p><span className='definition'>Top-down design</span> is basically splitting up a design plan into smaller pieces,
                            and then you solve each small piece until you reach the top (which is the end goal).</p>
                        <p>It's similar to a <span className='definition'>hierarchy</span>, or like
                            an upside down <span className='definition'>tree</span>.</p>
                        <p>The <span className='definition'>root</span> is the very top of the hierarchy, and each element of the tree is
                            called a <span className='definition'>node</span>. The small pieces at the very bottom of the tree are
                            the <span className='definition'>leaves</span>.</p>
                        <p>Each node will have at least a <span className='definition'>parent</span> (a node above it) or 
                            a <span className='definition'>child</span> (a node below it). The root has no parent and the leaves
                            have no children.</p>
                        <p><span className='definition'>Note</span>: A hierarchy helps you manage complexity.
                            <ul>
                                <li>Advantages
                                    <ul>
                                        <li>Provides coherency</li>
                                        <li>Provides conceptual separation</li>
                                    </ul>
                                </li>
                                <li>Disadvantages
                                    <ul>
                                        <li>Creates artificial boundaries</li>
                                        <li>It's not always clear how things can be separated</li>
                                        <li>They don't capture all relationships</li>
                                        <li>For individual applications, there can be drawbacks</li>
                                    </ul>
                                </li>

                            </ul>
                            Trust, the pros outweigh the cons.
                        </p>
                    </div>

                    <h2>Dictionaries</h2>
                    <div className='block'>
                        <p>In python, a <span className='definition'>dictionary</span> is a data type that is similar 
                            to lists, but has a twist.</p>
                        <p>For each element, there is a <span className='definition'>key</span> that is associated with 
                            a <span className='definition'>value</span>. Kind of like how a car key is linked to one specific car.</p>
                        <p>Instead of using index numbers like in lists, dictionaries use keys. The key must be a string, and 
                            the value can be any kind of data type.
                        </p>
                        <h3>Creating & Accessing a Dictionary</h3>
                        <div className='block'>
                            <p>To create a dictionary, we use curly brackets, and each element is separated by commas. In each
                                element, we follow the format
                            </p>
                            <code>key:value</code><br></br><br></br>
                            <div className='code'>
                                pets_owned = {"{"}"john":"dog", "jane":"fish", "joe":"cat"{"}"}<br></br>
                                student_GPA = {"{"}"john":3.5, "jane":3.75, "joe":2.1{"}"}
                            </div>
                            <p>To access an element, we use box brackets and the <span className='definition'>key</span> of
                                the element we want to access. Let's update Jane's GPA to 4.0:</p>
                            <div className='code'>
                                student_GPA = {"{"}"john":3.5, "jane":3.75, "joe":2.1{"}"}<br></br>
                                print( student_GPA["jane"] )<br></br>
                                student_GPA["jane"] = 4.0<br></br>
                                print( student_GPA["jane"] )<br></br><br></br>
                                <span className='comment'> # Result:<br></br>3.75<br></br>4.0</span>
                            </div>
                        </div>

                        <h3>Using the <code>in</code> Operator</h3>
                        <div className='block'>
                            <p>With for loops, we can loop through each element of a dictionary.</p>
                            <div className='code'>
                                student_GPA = {"{"}"john":3.5, "jane":3.75, "joe":2.1{"}"}<br></br>
                                for student in student_GPA:<br></br>
                                &nbsp;&nbsp;&nbsp;&nbsp;print(student, "has a", student_GPA[student])<br></br><br></br>
                                <span className='comment'> # Result:<br></br>
                                    john has a 3.5<br></br>
                                    jane has a 3.75<br></br>
                                    joe has a 2.1
                                </span>
                            </div>
                            <p>In the example above, <code>student</code> gives us the <span className='definition'>key</span>,
                                so <code>student_GPA[student]</code> gives us the <span className='definition'>value</span>.</p>
                            <p>With conditionals, we use the <code>in</code> keyword to see if a
                                specified <span className='definition'>key</span> is present in a dictionary.</p>
                            <div className='code'>
                                student_GPA = {"{"}"john":3.5, "jane":3.75, "joe":2.1{"}"}<br></br>
                                if "joe" in student_GPA:<br></br>
                                &nbsp;&nbsp;&nbsp;&nbsp;print( "joe is present" )<br></br>
                                if "jack" in student_GPA:<br></br>
                                &nbsp;&nbsp;&nbsp;&nbsp;print( "jack is present" )<br></br><br></br>
                                <span className='comment'> # Result:<br></br>joe is present</span>
                            </div>
                        </div>

                        <h3>Adding a Dictionary Element</h3>
                        <div className='block'>
                            <p>To add an element to a dictionary, we would do the same process as accessing a dictionary element.</p>
                            <p>The computer will assume that you want to create a new element, as long as the key you provided is 
                                different than the rest.
                            </p>
                            <div className='code'>
                                student_GPA = {"{"}"john":3.5, "jane":3.75, "joe":2.1{"}"}<br></br>
                                student_GPA["jack"] = 4.0<br></br>
                                print( student_GPA )<br></br><br></br>
                                <span className='comment'> # Result:<br></br>
                                    {"{"}'john': 3.5, 'jane': 3.75, 'joe': 2.1, 'jack': 4.0{"}"}
                                </span>
                            </div>
                        </div>
                        <h3>Deleting a Dictionary Element</h3>
                        <div className='block'>
                            <p>You probably won't need to know this, but you can also delete elements from a dictionary, 
                                using the <code>del</code> keyword.
                            </p>
                            <div className='code'>
                                student_GPA = {"{"}'john': 3.5, 'jane': 3.75, 'joe': 2.1, 'jack': 4.0{"}"}<br></br>
                                del student_GPA["joe"]<br></br>
                                print( student_GPA )<br></br><br></br>
                                <span className='comment'> # Result:<br></br>
                                    {"{"}'john': 3.5, 'jane': 3.75, 'jack': 4.0{"}"}
                                </span>
                            </div>
                        </div>
                    </div>
                    



                    <h2>Module 8 Quiz Prep</h2>
                    <p>Here's some points you need to know for the quiz:</p>
                    <ul>
                        <li>Know what hierarchies are
                            <ul>
                                <li>Advantages & disadvantages</li>
                                <li>Root, nodes, leaves</li>
                                <li>Parent & child</li>
                            </ul>
                        </li>
                        <li>Know about top-down design</li>
                        <li>Know how to use dictionaries</li>
                    </ul>
                    
                </div>
            </section>
        </>
    );

}
export default ENGR102Mod8;