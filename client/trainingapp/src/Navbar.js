import React from 'react';
import { Link } from 'react-router-dom';
import logo from './pngs/logon.png';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Navbar, Nav } from 'react-bootstrap';
import './Navbar.css';

function NavigationBar(props) {
  const isAdmin = window.localStorage.getItem('isAdmin') === 'true';

  const logOut = () => {
    window.localStorage.clear();
    window.location.href = '/';
  };

  return (
    <div className='Navbar'>
      <Navbar sticky='top'>
        <Navbar.Brand>
          <Link to='/home'>
            <img src={logo} />
          </Link>
        </Navbar.Brand>
        <Nav>
          {isAdmin ? (
            <>
              <Nav.Link className='logout' onClick={logOut}>
                Logout
              </Nav.Link>
              <Nav.Link href='admin'>Users list</Nav.Link>
            </>
          ) : (
            <>
              <Nav.Link href='/app'>Your workouts</Nav.Link>
              <Nav.Link href='/exercises'>Exercises list</Nav.Link>
              <Nav.Link href='/userDetails'>User data</Nav.Link>
              {props.isLoggedIn === 'true' ? (
                <Nav.Link className='logout' onClick={logOut}>
                  Logout
                </Nav.Link>
              ) : (
                <Nav.Link href='/'>Login</Nav.Link>
              )}
            </>
          )}
        </Nav>
      </Navbar>
    </div>
  );
}

export default NavigationBar;
