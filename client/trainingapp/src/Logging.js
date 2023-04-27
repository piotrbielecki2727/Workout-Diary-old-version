import React, { useState } from 'react';
import './Logging.css'
import logo from './pngs/logon.png';
import { withRouter, Link } from 'react-router-dom';
import Alert from 'react-bootstrap/Alert';


function Login() {
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [hasAccount, setHasAccount] = useState(true);






  const handleSignIn = (e) => {
    e.preventDefault();
    console.log(firstname, lastname, email, password);
    fetch("http://localhost:3001/loginUser", {
      method: "POST",
      crossDomain: true,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data, "userRegister");
        if (data.status === "ok") {
          window.localStorage.setItem("token", data.data);
          window.localStorage.setItem("loggedIn", true);
          getUserByEmail(email)
            .then(({ id, block }) => {
              console.log(id);
              localStorage.setItem('userId', id);
              if (block === true) {
                alert  ('Your account has been blocked. Please contact the administrator.'); // Show alert
                return;
              }
              if (email === "admin@admin.com" && password === "admin") {
                window.localStorage.setItem("isAdmin", true);
                window.location.href = "./admin";
              } else {
                window.location.href = "./home";
              }
            })
            .catch((error) => console.error(error));
        }
      });
  };

  const handleSignUp = (e) => {
    e.preventDefault();
    console.log(firstname, lastname, email, password);
    fetch("http://localhost:3001/createUser", {
      method: "POST",
      crossDomain: true,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        firstname,
        lastname,
        email,
        password,
        block: false
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        alert("Register successfull");
        console.log(data, "userRegister");
      });
  };

  const getUserByEmail = async (email) => {
    try {
      const response = await fetch("http://localhost:3001/users/" + email);
      const data = await response.json();
      if (response.ok) {
        return { id: data.id, block: data.block };
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <section className='login'>
      <div className='loginContainer'>
        <img src={logo} alt="Logo" />
        <br></br>
        <div className='bigword'>
          <h2>{hasAccount ? "Log in form" : "Register form"}</h2>
        </div>
        {hasAccount ? (
          <form onSubmit={handleSignIn}>
            <label>Email:</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              placeholder='Email...'
            />
            <label>Password:</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              placeholder='Password...'
            />
            <div className='btnContainer'>
              <button type='submit'>Sign in</button>

              <p>
                Don't have an account?
                <span onClick={() => setHasAccount(!hasAccount)}>Sign up</span>
              </p>
            </div>
          </form>
        ) : (
          <form onSubmit={handleSignUp}>
            <label>First name:</label>
            <input
              type="text"
              value={firstname}
              onChange={e => setFirstname(e.target.value)}
              required
              placeholder='First name...'
            />
            <label>Last name:</label>
            <input
              type="text"
              value={lastname}
              onChange={e => setLastname(e.target.value)}
              required
              placeholder='Last name...'
            />
            <label>Email:</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              placeholder='Email...'
            />
            <label>Password:</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              placeholder='Password...'
            />
            <div className='btnContainer'>
              <button type='submit'>Sign up</button>
              <p>
                Have an account?
                <span onClick={() => setHasAccount(!hasAccount)}>Sign in</span>
              </p>
            </div>
          </form>
        )}
      </div>
    </section>
  );
}

export default withRouter(Login);

