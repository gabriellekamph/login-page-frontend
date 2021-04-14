checkLocalStorage();

// CHECK LOCAL STORAGE IF USER IS ALREADY LOGGED IN

function checkLocalStorage() {

    if (localStorage.getItem('userId') !== null) { 
        loggedIn();

        } else {
        startPage();
    }
}

// START PAGE TO LOG IN OR REGISTER NEW USER

function startPage() {

    document.getElementById("topnav").innerHTML = `<nav id="loginform"><label for="email">Email:</label>
                                                    <input id="email" type="text" name="email"><br />

                                                    <label for="passW">Password:</label>
                                                    <input id="passW" type="password" name="passW" required> <br />

                                                    <button id="loginBtn" type="submit">Login</button></>`
    
    document.getElementById("content").innerHTML = `<h2>Hello! &#128075;</h2> <p>Welcome to this super basic but awesome login page. <br /> Sign in with your email and password.  <br /><br />
    No account? Let's create one! <br /><br />
    <button id="registerBtn" type="submit">Register here</button></></p>`

    // PRESS ENTER KEY TO LOGIN

    let passW = document.getElementById("passW");
    passW.addEventListener("keyup", function(event) {
    if (event.keyCode === 13) {
        event.preventDefault();
        document.getElementById("loginBtn").click();
        validateInput();
    }
    });

    // REGISTER A NEW USER

    document.getElementById("registerBtn").addEventListener("click", registerUser);

    function registerUser() {

        document.getElementById("topnav").innerHTML = "";
        document.getElementById("content").innerHTML = `<div>
                                                        <h3>Register a new user</h3>
                                                        <div><label for="email">Email:</label><br /><input type="text" id="email" required/></div>
                                                        <div><label for="firstName">First name:</label><br /><input type="text" id="firstName" /></div>
                                                        <div><label for="lastName">Last name: </label><br /><input type="text" id="lastName" /></div>
                                                        <div><label for="passW">Select a password: </label><br /><input id="passW" type="password" name="passW" required /></div><br />
                                                        <div><button id="saveBtn">Register</button></div>
                                                        </div>`

        document.getElementById("saveBtn").addEventListener("click", function() {
            
            let newUser = {
                id: Math.floor(Math.random() * 9999),
                email: document.getElementById("email").value,
                firstName: document.getElementById("firstName").value, 
                lastName: document.getElementById("lastName").value, 
                passW: document.getElementById("passW").value
            }
        
            // console.log(newUser);
        
            fetch("https://headless-login-page.herokuapp.com/users/new", {
                method: "post",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(newUser)
            })
            .then(res => res.json())
            .then(data => console.log(data));

            document.getElementById("topnav").innerHTML = `<nav id="loginform"><label for="email">Email:</label>
                                                            <input id="email" type="text" name="email"><br />
                                                            <label for="passW">Password:</label>
                                                            <input id="passW" type="password" name="passW" required> <br />
                                                            <button id="loginBtn" type="submit">Login</button></>`
            document.getElementById("content").innerHTML = `<h1>&#128079;</h1><h3>Well done!</h3><p>A new account is created. You can now log in!</p>`
        });
    }

    // VALIDATE USERNAME AND PASSWORD 
    
    document.getElementById("loginBtn").addEventListener("click", validateInput);

    function validateInput() {

        let emailInput = document.getElementById("email").value;
        let passwordInput = document.getElementById("passW").value;

        fetch("https://headless-login-page.herokuapp.com/users")
        .then(res => res.json())
        .then(data => {
            let savedUsers = data;            

            for (let i=0; i < savedUsers.length; i++) {
                if (emailInput == savedUsers[i].email && passwordInput == savedUsers[i].passW) {
                    console.log("Login successful for user with id: " + savedUsers[i].id);
                    localStorage.setItem("userId", savedUsers[i].id);    
                    loggedIn();
                    return;
                } 
            }

            // ERROR MESSAGE IF LOGIN FAILED
            
            document.getElementById("content").innerHTML = "<h2>Oops! &#129327;</h2> <p>Wrong email and/or password. Try again! </p>";
            console.log("Wrong email and/or password.");
        })
    }
}

// SHOW WELCOME PAGE WHEN LOGIN IS SUCCESSFUL

function loggedIn() {

    // FETCH LIST WITH ALL USERS

    fetch("https://headless-login-page.herokuapp.com/users")
    .then(res => res.json())
    .then(data => {
        let savedUsers = data;
        // console.log(data);

        for (let i=0; i < savedUsers.length; i++) {
            if (localStorage.getItem('userId') == savedUsers[i].id) {
                document.getElementById("topnav").innerHTML = "<button id='logoutBtn'>Sign out</button>";
                document.getElementById("content").innerHTML = "<h2>Welcome " + savedUsers[i].firstName + "! &#128076;</h2> <p>Nice to see you!</p>";
                
            } 
        }
        
        // LOG OUT, CLEAR LOCAL STORAGE AND SEND USER BACK TO START PAGE

        document.getElementById("logoutBtn").addEventListener("click", logout);

        function logout() {
            localStorage.clear();
            checkLocalStorage();
        }
    });
}

    
    
    






