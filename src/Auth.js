import React, { useState } from "react";
import { Route, Redirect, withRouter } from "react-router-dom";
import gundb from "./gundb";

const createAuth = gunUser => ({
  gunUser,
  authUser: null,
  isAuthenticated: false,
  authenticate(user, password, cb) {
    this.gunUser.auth(user, password, result => {
      if (result.err) {
        alert(result.err);
        return;
      }
      this.isAuthenticated = true;
      this.authUser = result;
      console.log("authUser", this.authUser);
      cb(result);
    });
  },
  signout(cb) {
    this.gunUser.leave();
    this.isAuthenticated = false;
    cb();
  }
});

const fakeAuth = createAuth(gundb.user());

export const AuthContext = React.createContext(fakeAuth);

export const AuthButton = withRouter(({ history }) =>
  fakeAuth.isAuthenticated ? (
    <p>
      Welcome!{" "}
      <button
        onClick={() => {
          fakeAuth.signout(() => history.push("/"));
        }}
      >
        Sign out
      </button>
    </p>
  ) : (
    <p>You are not logged in.</p>
  )
);

export function PrivateRoute({ component: Component, ...rest }) {
  console.log("privateRoute", fakeAuth);
  return (
    <Route
      {...rest}
      render={props =>
        fakeAuth.isAuthenticated ? (
          <Component {...props} />
        ) : (
          <Redirect
            to={{
              pathname: "/login",
              state: { from: props.location }
            }}
          />
        )
      }
    />
  );
}

export const Login = props => {
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");
  const [redirectToReferrer, setRedirectToReferrer] = useState(false);

  const login = e => {
    e.preventDefault();
    fakeAuth.authenticate(user, password, data => {
      console.log("data on authentication", data);
      setRedirectToReferrer(true);
    });
  };

  let { from } = props.location.state || { from: { pathname: "/" } };
  if (redirectToReferrer) {
    console.log("redirecting...");
    return <Redirect to={from} />;
  }
  return (
    <div>
      <p>You must log in to view the page at {from.pathname}</p>
      <form onSubmit={login}>
        <input value={user} onChange={e => setUser(e.target.value)} />
        <input
          value={password}
          type="password"
          onChange={e => setPassword(e.target.value)}
        />
        <button onClick={login}>Login</button>
      </form>
    </div>
  );
};
