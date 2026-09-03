import { authClient } from '../../scripts/auth';
import { isAuthorized, isDemoMode } from '../../scripts/demo';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/styles.css';


const ENGR102Mod7 = () => {

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
                <h1>Module 7 : Lists</h1>
            </header>

            <section id="center">
                <div style={{
                    padding: "auto",
                    textAlign: "left",
                    width: "60%",
                    margin: "auto",
                    marginBottom: "500px"
                }}>
                    <p>Welcome to module 7! In this module, we'll talk about lists.</p>
                    <h2>What are lists?</h2>
                    <div className="block">
                            <div className="block">
                            <p>A <span className="definition">list</span> is a data type that allows you to store multiple values 
                            in a single variable.</p>
                            <p>Let's make a list that stores a few numbers.</p>
                            <div className="code">
                                my_list = [1, 2, 3]<br></br>
                                print(my_list)<br></br><br></br>
                                <span className="comment"> # Result:</span><br></br>
                                <span className="comment">[1, 2, 3]</span>
                            </div>
                            <p>You can also make a list of mutliple data types.</p>
                            <div className="code">
                                my_list = ["Hello", 123, 4.0]<br></br>
                                print(my_list)<br></br><br></br>
                                <span className="comment"> # Result:</span><br></br>
                                <span className="comment">["Hello", 123, 4.0]</span>
                            </div>
                            <p>FYI, strings are just a list in disguise!</p>

                        </div>

                        <h3>Accessing Elements in a List</h3>
                        <div className="block">
                            <p>The items in a list are commonly referred to as <span className="definition">elements</span>.</p>
                            <p>Sometimes we need to access a specific element in a list. Elements are indexed starting at 0.</p>
                            <p>To do this, we use square brackets and the index of the element.</p>
                            <div className="code">
                                my_list = [1, 2, 3]<br></br>
                                first_element = my_list[0]<br></br>
                                print(first_element)<br></br><br></br>
                                <span className="comment"> # Result:</span><br></br>
                                <span className="comment">1</span>
                            </div>
                            <p>You can also use this to change a specific value in a list.</p>
                            <div className="code">
                                my_list = [1, 2, 3]<br></br>
                                my_list[0] = 10<br></br>
                                print(my_list)<br></br><br></br>
                                <span className="comment"> # Result:</span><br></br>
                                <span className="comment">[10, 2, 3]</span>
                            </div>
                            <p><span className="definition">Note:</span> If you need to access the last element of 
                                a list, you can use <code>-1</code> as the index.</p>
                            
                        </div>

                        <h3>Looping Through a List</h3>
                        <div className="block">
                            <p>If you need to access all elements in a list, you can use a loop to iterate through the list.</p>
                            <p>To get the length of a list (how many elements are in it), you can use the <code>len()</code> function.</p>
                            <code>len(my_list)</code>
                            <p>This can be used to iterate through a list of items (<span className="definition">method 1</span>).</p>
                            <div className="code">
                                my_list = [1, 2, 3]<br></br>
                                for i in range(len(my_list)):<br></br>
                                &nbsp;&nbsp;&nbsp;&nbsp;print(my_list[i], end=" -&gt; ")<br></br>
                                print("done")<br></br><br></br>
                                <span className="comment"> # Result:</span><br></br>
                                <span className="comment">1 -&gt; 2 -&gt; 3 -&gt; done</span><br></br>
                            </div>
                            <p>Here's another way to iterate through a list (<span className="definition">method 2</span>):</p>
                            <div className="code">
                                my_list = [1, 2, 3]<br></br>
                                for element in my_list:<br></br>
                                &nbsp;&nbsp;&nbsp;&nbsp;print(element, end=" -&gt; ")<br></br>
                                print("done")<br></br><br></br>
                                <span className="comment"> # Result:</span><br></br>
                                <span className="comment">1 -&gt; 2 -&gt; 3 -&gt; done</span><br></br>
                            </div>
                            <p>If you want to change each element using a loop, you can only use method 1 shown
                                above, using <code>len()</code>.
                            </p>
                            <div className="code">
                                my_list = [1, 2, 3]<br></br>
                                for i in range(len(my_list)):<br></br>
                                &nbsp;&nbsp;&nbsp;&nbsp;my_list[i] = my_list[i] * 2<br></br>
                                print(my_list)<br></br><br></br>
                                <span className="comment"> # Result:</span><br></br>
                                <span className="comment">[2, 4, 6]</span>
                            </div>
                            
                        </div>
                    </div>


                    <h2>List Operations</h2>
                    <div className="block">
                        <h3>Adding an Element to a List Using <code>append()</code></h3>
                        <div className='block'>
                            <p>One of the most common things we do with lists are to add to them.</p>
                            <p>The <code>append()</code> function does just that.</p>
                            <div className='code'>
                                my_list = ["apples","oranges"]<br></br>
                                my_list.append("grapes")<br></br>
                                print(my_list)<br></br><br></br>
                                <span className='comment'> # Result:<br></br>["apples", "oranges", "grapes"]</span>
                            </div>
                        </div>

                        <h3>Combining Two Lists</h3>
                        <div className='block'>
                            <p>Another way we use lists is by combining two lists together.</p>
                            <p>We do this by using the arithmetic plus sign.</p>
                            <div className='code'>
                                list1 = [1,2,3]<br></br>
                                list2 = [4,5,6]<br></br>
                                combined_lists = list1 + list2<br></br>
                                print(combined_lists)<br></br><br></br>
                                <span className='comment'> # Result:<br></br>[1, 2, 3, 4, 5, 6]</span>
                            </div>
                            <p>We can use this method to add a single element to a list, too. Just like the <code>append()</code> function.</p>
                            <div className='code'>
                                my_list = ["apples","oranges"]<br></br>
                                my_list += ["grapes"]<span className='comment'> # Remember the box brackets!</span><br></br>
                                print(my_list)<br></br><br></br>
                                <span className='comment'> # Result:<br></br>["apples", "oranges", "grapes"]</span>
                            </div>
                        </div>

                        <h3>Getting Singular or Multiple Elements Using the Box Brackets</h3>
                        <div className='block'>
                            <p>Recall that getting one element from a list involves box brackets surrounding the index value
                                of the target element.
                            </p>
                            <p>Make sure that the index number is within the length of the list (for example, there would be no 100th 
                                index for a list that has 10 elements; that would be <span className='definition'>out of bounds</span>).</p>
                            <div className='code'>
                                my_list = [1,2,3,4,5,6]<br></br>
                                x = my_list[3]<span className='comment'> # -&gt; 4</span><br></br>
                                y = my_list[-4]<span className='comment'> # -&gt; 3</span><br></br>
                            </div>
                            <p>What if we only need part of a list?</p>
                            <p>This is done by <span className='definition'>list slicing</span>, which involves giving a range 
                                of index numbers in box brackets (similar to how we access singular elements in a list).
                            </p>
                            <p>The range includes the first index given, but excludes the second index given.</p>
                            <div className='code'>
                                my_list = [1,2,3,4,5,6]<br></br>
                                shortened_list = my_list[1:4]<br></br>
                                print(shortened_list)<br></br><br></br>
                                <span className='comment'> # Result:<br></br>[2, 3, 4]</span>
                            </div>
                            <p>Give a third number inside the box brackets, and it will specify the step size.</p>
                            <div className='code'>
                                my_list = [1,2,3,4,5,6,7,8,9,10]<br></br>
                                shortened_list = my_list[1:8:2]<br></br>
                                print(shortened_list)<br></br><br></br>
                                <span className='comment'> # Result:<br></br>[2, 4, 6, 8]</span>
                            </div>
                            <p>If you leave the left side of the colon blank, it means "start from the beginning".</p>
                            <p>Similarly, if you leave the right side of the colon blank, it means "go to the end".</p>
                            <div className='code'>
                                my_list = [1,2,3,4,5,6,7,8,9,10]<br></br>
                                first_half = my_list[:5]<br></br>
                                second_half = my_list[5:]<br></br>
                                print(first_half, second_half)<br></br><br></br>
                                <span className='comment'> # Result:<br></br>[1, 2, 3, 4, 5] [6, 7, 8, 9, 10]</span>
                            </div>
                        </div>


                        <h3>Changing Part of a List (List Adjusting)</h3>
                        <div className='block'>
                            <p>Another type of operation we can do on a list is changing a part of it.</p>
                            <p>Let's change each of the elements of indexes 2 to 4 to the integer <code>0</code>:</p>
                            <div className='code'>
                                my_list = [1,2,3,4,5,6,7,8,9,10]<br></br>
                                my_list[2:5] = [0,0,0]<br></br>
                                print(my_list)<br></br><br></br>
                                <span className='comment'> # Result:<br></br>[1, 2, 0, 0, 0, 6, 7, 8, 9, 10]</span>
                            </div>
                        </div>
                        <div className='block'>
                            <p>Another way we can use list adjusting is to insert elements inside of the list, rather
                                than at the end of it (using <code>append()</code>).</p>
                            <p>Let's say we wanted to insert the list <code>['a','b']</code> <strong>after</strong> the 0th index (first element). 
                                Then we would use box brackets with the same index number for both the beginning and end 
                                of the slice.
                            </p>
                            <div className='code'>
                                my_list = [1,2,3,4,5,6,7,8,9,10]<br></br>
                                my_list[1:1] = ['a','b']<br></br>
                                print(my_list)<br></br><br></br>
                                <span className='comment'> # Result:<br></br>[1, 'a', 'b', 2, 3, 4, 5, 6, 7, 8, 9, 10]</span>
                            </div>
                        </div>
                    </div>

                    <h2>More About Lists</h2>
                    <div className='block'>
                        <h3>Strings</h3>
                        <div className='block'>
                            <p>Strings are basically lists of characters. However, we cannot use some list operations
                                like <code>append()</code>.</p>
                            <p>We can add to a string and slice it, just like with lists.</p>
                            <div className='code'>
                                my_str = "hello"<br></br>
                                my_str += " world"<br></br>
                                print(my_str[3:9])<br></br><br></br>
                                <span className='comment'> # Result:<br></br>lo wor</span>
                            </div>
                        </div>

                        <h3>List of Lists</h3>
                        <div className='block'>
                            <p>We can also make matrices. To get the index of an inner list, we simply use 2 box brackets, 
                                one after the other. The first index is that of the outer list, and the second index is 
                                that of the inner list.</p>
                            <div className='code'>
                                matrix = [[1,2,3],[4,5,6],[7,8,9]]<br></br>
                                for i in range(len(matrix)):<br></br>
                                &nbsp;&nbsp;&nbsp;&nbsp;for j in range(len(matrix[i])):<br></br>
                                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;print(matrix[i][j], end=" ")<br></br>
                                &nbsp;&nbsp;&nbsp;&nbsp;print()<br></br><br></br>
                                <span className='comment'> # Result:<br></br>
                                1 2 3 <br></br>4 5 6 <br></br>7 8 9 
                                </span>
                            </div>
                        </div>


                        <h3>Using the <code>in</code> Operator</h3>
                        <div className='block'>
                            <p>We use the <code>in</code> operator to  check if a certain element is in a specified list.</p>
                            <div className='code'>
                                my_pets = ["cat","dog","fish","bird"]<br></br>
                                if "dog" in my_pets:<br></br>
                                &nbsp;&nbsp;&nbsp;&nbsp;print("I have a dog")<br></br><br></br>
                                <span className='comment'> # Result:<br></br>I have a dog</span>
                            </div>
                        </div>

                        <h3>Other Important List Functions</h3>
                        <div className='block'>
                            <p>The <code>split()</code> function will take a string and turn it into a list based on
                            the whitespace characters in the string.</p>
                            <div className='code'>
                                my_str = "hello world"<br></br>
                                my_list = my_str.split()<br></br>
                                print(my_list)<br></br><br></br>
                                <span className='comment'> # Result:<br></br>["hello", "world"]</span>
                            </div>
                            <p>The <code>join()</code> function will take a list and turn it into a string.</p>
                            <div className='code'>
                                my_list = ["I","am","an","engineering","student."]<br></br>
                                my_str = " -&gt; ".join(my_list)<br></br><br></br>
                                <span className='comment'> # Result:<br></br>I -&gt; am -&gt; an -&gt; engineering -&gt; student.</span>
                            </div>
                            <p>Notice how the string we put before the <code>.join()</code> became the "links" between
                                each of the words from the list. I used an arrow but you can just put a space character,
                                and it will look like a regular sentence.</p>
                        </div>
                    </div>
                    



                    <h2>Module 7 Quiz Prep</h2>
                    <p>Here's some points you need to know for the quiz:</p>
                    <ul>
                        <li>Know how to use lists
                            <ul>
                                <li>Indexes start at 0</li>
                                <li>Using <code>append()</code> and combining lists</li>
                                <li>Pay attention to list sizes and out of bounds indexes</li>
                                <li>Changing part of a list (list adjusting)</li>
                            </ul>
                        </li>
                    </ul>
                    
                </div>
            </section>
        </>
    );

}
export default ENGR102Mod7;