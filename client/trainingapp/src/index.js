import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Switch, Route, Link, hi } from 'react-router-dom';
import { useHistory } from 'react-router-dom';
import App from './App';
import WorkoutDetails from './WorkoutDetails';
import WorkoutCreator from './WorkoutCreator';
import Login from './Logging';
import UserDetails from './UserDetails';
import Home from './Home';
import NavigationBar from './Navbar';
import Admin from './Admin';
import Exercises from './Exercises'

const logOut = () => {
  window.localStorage.clear();
  window.location.href = "./"
}

const isLoggedIn = window.localStorage.getItem("loggedIn");
const isAdmin = window.localStorage.getItem("isAdmin") === "true";



ReactDOM.render(
  <Router>
    <div>
      {isLoggedIn === "true" && <NavigationBar isLoggedIn={isLoggedIn} logOut={logOut} />}
      <Switch>
        <Route exact path="/">
          {isLoggedIn === "true" ? <Home /> : <Login history={useHistory} />}
        </Route>
        <Route path="/home">
        </Route>
        <Route exact path="/app">
          <App />
        </Route>
        <Route path="/exercises">
        <Exercises />
        </Route>
        <Route path="/userDetails">
          <UserDetails />
        </Route>
        <Route path="/admin">
          <Admin />
        </Route>
        <Route
          path="/workout/:id"
          render={({ match }) => (
            <WorkoutDetails trainingId={match.params.id} />
          )}
        />
        <Route
          path="/workout-creator/:id"
          component={WorkoutCreator} 
        />
      </Switch>
    </div>
  </Router>,
  document.getElementById('root')
);
