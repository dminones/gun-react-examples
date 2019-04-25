import React, { Component } from "react";
import "./App.css";
import Todos from "./Todos";
import Profile from "./Profile";
import ViewProfile from "./ViewProfile";

import { Login, AuthButton, PrivateRoute } from "./Auth";

import { BrowserRouter as Router, Route, Link } from "react-router-dom";

const wrapWithProps = (Component, propsToAdd) => props => {
  console.log({ Component, propsToAdd });
  return <Component {...propsToAdd} {...props} />;
};

const App = () => (
  <Router>
    <div>
      <nav className="Nav-bar">
        <AuthButton />
        <ul>
          <li>
            <Link to="/public">Todo</Link>
          </li>
          <li>
            <Link to="/profile">Profile</Link>
          </li>
        </ul>
      </nav>

      <Route path="/public" component={Todos} />
      <Route path="/login" component={Login} />
      <PrivateRoute path="/profile/:pubkey" component={ViewProfile} />

      <PrivateRoute exact path="/profile" component={Profile} />
    </div>
  </Router>
);

export default App;
