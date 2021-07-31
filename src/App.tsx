import React from "react";
import logo from "./logo.svg";
import "./index.css";
import "./App.css";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { Login } from "./components/Login";
import { Register } from "./components/Register";
import { HomePage } from "./components/HomePage";
import { PresentationView } from "./components/PresentationView";
import { PresentationMode } from "./components/PresentationMode";

export const apiURL =
  process.env.NODE_ENV === "production"
    ? "https://presentation-app-backend.herokuapp.com"
    : "http://localhost:5000";

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/register" exact component={Register} />
        <Route path="/login" exact component={Login} />
        <Route path="/" exact component={HomePage} />
        <Route path="/presentation/:id" exact component={PresentationView} />
        <Route
          path="/presentation/:id/play"
          exact
          component={PresentationMode}
        />
      </Switch>
    </Router>
  );
}

export default App;
