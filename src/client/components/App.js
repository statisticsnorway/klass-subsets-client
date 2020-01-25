import React from "react";
import "../css/App.css";
import { BrowserRouter as Router, Route, Switch, Link } from "react-router-dom";
import { ContextProvider } from "../controllers/context";
import WelcomePage from "./WelcomePage";
import Header from "./Header";
import Errors from "./Errors";
import SubsetForm from "./subsetDraft/SubsetForm";

export default function App() {
    return (
        <ContextProvider>
            <Router>
                <div className="App">
                    <Header/>
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
