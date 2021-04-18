import { StrictMode } from "react";
import ReactDOM from "react-dom";

import Login from "./Login";
import Dashboard from "./Dashboard";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import "./styles.css";

const rootElement = document.getElementById("root");
ReactDOM.render(
  <StrictMode>
    <BrowserRouter>
      <Switch>
        <Route exact path="/" component={Login} />
        <Route exact path="/dashboard" component={Dashboard} />
      </Switch>
    </BrowserRouter>
  </StrictMode>,
  rootElement
);
