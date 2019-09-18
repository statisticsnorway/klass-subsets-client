import React from "react";
import logo from "../images/SSB_logo.png";
import "../css/App.css";
import {BrowserRouter as Router, Route, Switch, Link} from "react-router-dom";
import {ContextProvider} from "../controllers/context";
import WelcomePage from "./WelcomePage";
import Errors from "./Errors";
import SubsetForm from "./SubsetForm";

export default function App() {
    return (
        <ContextProvider>
            <Router>
                <div className="App">
                    <header className="App-header">
                        <div className="App-name">
                            <Link to="/">
                                <img src={logo} className="App-logo" alt="SSB logo"/>
                                Klass uttrekk admin
                            </Link>
                        </div>
                    </header>
                    <Errors/>
                    <Switch>
                        <Route path="/" exact component={WelcomePage}/>
                        <Route path="/create" component={SubsetForm}/>
                        <Route component={NoMatch}/>
                    </Switch>
                </div>
            </Router>
        </ContextProvider>
    );
}

export function NoMatch({location}) {
    return (
        <div className="page">
            <h3>No match for <code>{location.pathname}</code>.</h3>
            <p>Back to <Link to="/">home page</Link></p>
        </div>
    );
}
