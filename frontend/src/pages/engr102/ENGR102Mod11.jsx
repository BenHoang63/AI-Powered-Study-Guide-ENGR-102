import { authClient } from '../../scripts/auth';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/styles.css';


const ENGR102Mod11 = () => {

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
                <h1>Module 11 : Files</h1>
            </header>

            <section id="center">
                <div style={{
                    padding: "auto",
                    textAlign: "left",
                    width: "60%",
                    margin: "auto",
                    marginBottom: "500px"
                }}>
                    <p>Welcome to module 11! This one's about files.</p>
                    <h2>Basics of Files</h2>
                    <div className='block'>
                        <h3>Opening a File</h3>
                        <div className='block'>
                            <p>When we open a file, we have to assign the file to a variable, so we can use the file in our code.</p>
                            <p>For the arguments, we have to set the name of the file and then the action (designator) for our file.</p>
                            <p>The basic designators are:
                                <ul>
                                    <li><code>"r"</code> is to read data from the file</li>
                                    <li><code>"w"</code> is to write data to a new file</li>
                                    <li><code>"a"</code> is to append data at the end of an existing file</li>
                                </ul>
                            </p>
                            <div className='code'>
                                my_file = open("stats.txt","r")<br></br>
                                new_file = open("my_new_file.txt","w")
                            </div>
                            <p><span className='definition'>Note</span>: the file must be in the same folder that contains the Python
                                script you are using.</p>
                        </div>

                        <h3>Closing a File</h3>
                        <div className='block'>
                            <p>Whenever we open a file, we must close it when finished, or before the code ends.</p>
                            <p>We do this by using <code>.close()</code> on the variable our file is stored in.</p>
                            <div className='code'>
                                my_file.close()<br></br>
                                new_file.close()<br></br>
                            </div>
                        </div>

                        <h3>Alternative Method For Accessing Files</h3>
                        <div className='block'>
                            <p>Totally optional to know, but very convenient in some cases</p>
                            <p>There is another way to do this. We use the <code>with</code> and <code>as</code> keyword, and so 
                                we can open a file without having the need to close it.</p>
                            <div className='code'>
                                with open("stats.txt","r") as my_file:<br></br>
                                &nbsp;&nbsp;&nbsp;&nbsp;print( "No need to close the file" )
                            </div>
                            <p>Just make sure all the code you want must be inside the indented code block.</p>
                        </div>
                    </div>

                    <h2>Writing to Files</h2>
                    <div className='block'>
                        <p>To write to a newly created file, we use <code>.write()</code>.</p>
                        <p>We can only put strings in, so make sure to convert everything to <code>str</code> before writing to file.</p>
                        <p>We also have to manually put in a new line using the escape character <code>\n</code>.</p>
                        <div className='code'>
                            new_file = open("file.txt","w")<br></br>
                            new_file.write("Hello World\n")<br></br>
                            new_file.write("ENGR 102")<br></br>
                            new_file.close()<br></br><br></br>
                            <span className='comment'> # File Contents:<br></br>Hello World<br></br>ENGR 102</span>
                        </div>
                    </div>

                    <h2>Reading From Files</h2>
                    <div className='block'>
                        <p>For reading, we have a few options:
                            <ul>
                                <li>We can use <code>.read()</code>, which will put the entire contents of the file into one
                                    single string.</li>
                                <li>We can use <code>.readline()</code>, which gets the next line of the file.</li>
                                <li>We can use <code>.readlines()</code>, which will put each line of the file as an element
                                    of a new list. I like this one.</li>
                            </ul>
                            <div className='code'>
                                file = open("data.txt","r")<br></br>
                                lines = file.readlines()<br></br>
                                for line in lines:<br></br>
                                &nbsp;&nbsp;&nbsp;&nbsp;print(line)<br></br>
                                file.close()
                            </div>
                        </p>
                        <h3>String Processing</h3>
                        <div className='block'>
                            <p>Recall the <code>.split()</code> function we talked about earlier:</p>
                            <p>The <code>split()</code> function will take a string and turn it into a list based on
                            the whitespace characters in the string.</p>
                            <div className='code'>
                                my_str = "hello world"<br></br>
                                my_list = my_str.split()<br></br>
                                print(my_list)<br></br><br></br>
                                <span className='comment'> # Result:<br></br>["hello", "world"]</span>
                            </div>
                            <p>If you want to split a string based off something other than a whitespace character, 
                                we can set that manually with an argument.</p>
                            <div className='code'>
                                <span className='comment'># in this string, things are separated by commas</span><br></br>
                                my_str = "luffy,d,monkey,gum-gum"<br></br>
                                my_list = my_str.split(',')<br></br>
                                print( my_list )<br></br><br></br>
                                <span className='comment'> # Result:<br></br>['luffy', 'd', 'monkey', 'gum-gum']</span>
                            </div>
                            <p>The <code>.strip()</code> function will take away any whitespace or return line characters at the 
                                beginning and end of the string.</p>
                            <div className='code'>
                                random_string = " &nbsp;&nbsp;&nbsp; abcd efg &nbsp;&nbsp; \n"<br></br>
                                print( random_string.strip() )<br></br><br></br>
                                <span className='comment'># Result:<br></br>abcd efg</span>
                            </div>
                        </div>
                    </div>

                    <h2>Other Tips</h2>
                    <div className='block'>
                        <h3>Matrices in Files</h3>
                        <div className='block'>
                            <p>If you have a file to read that is formatted like an excel spreadsheet (a matrix), we can still 
                                turn it into our own matrix.
                                <ul>
                                    <li>Use <code>.read().split('\n')</code> to turn the file into a list of lines.</li>
                                    <li>Create an empty list for the matrix.</li>
                                    <li>In a for loop, use <code>.split(',')</code> to get each row, then
                                        use <code>.append()</code> to add each row to the matrix.</li>
                                </ul>
                            </p>
                            <div className='code'>
                                <span className='comment'> # assume we have a .csv file (comma-separated values)</span><br></br>
                                file = open("data.csv","r")<br></br>
                                file_lines = file.read().split("\n")<br></br>
                                data = [] <br></br>
                                for line in file_lines:<br></br>
                                &nbsp;&nbsp;&nbsp;&nbsp;row = line.split(',')<br></br>
                                &nbsp;&nbsp;&nbsp;&nbsp;data.append(row)<br></br>
                                &nbsp;&nbsp;&nbsp;&nbsp;<span className='comment'> # or data.append(line.split(','))</span>
                            </div>
                            <p>Obviously, there are more ways to accomplish this</p>
                        </div>

                        <h3>Having Trouble With File Paths</h3>
                        <div className='block'>
                            <p>Make sure in your code editor's "explorer" bar, the folder opened should be the one containing your 
                                Python file and data file.</p>
                            <p>As a last resort (assuming you already asked a prof or PT), use this:</p>
                            <div className='code'>
                                <span className='comment'> # assume our file is data.csv</span><br></br>
                                import pathlib<br></br>
                                parent_dir = str(pathlib.Path(__file__).parent.absolute())<br></br>
                                file_name = parent_dir + "/data.csv"<br></br>
                                file = open(file_name,"r")
                            </div>
                            <p>Don't use this on a quiz trust, this is only for trouble with the file paths on a computer</p>
                        </div>
                    </div>



                    <h2>Module 11 Quiz Prep</h2>
                    <p>Here's some points you need to know for the quiz:</p>
                    <ul>
                        <li>This is a full code writing quiz</li>
                        <li>You should probably know everything here 😟
                            <ul><li>Maybe except for the file path one</li></ul>
                        </li>
                    </ul>
                    
                </div>
            </section>
        </>
    );

}
export default ENGR102Mod11;