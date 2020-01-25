import React from 'react';
import '../css/pages.css';
import { Link } from "react-router-dom";
import { Button } from "@statisticsnorway/ssb-component-library";

export default function WelcomePage() {
    return (
        <div className="page">
            <h1>Welcome to Klass Subsets web</h1>
            <p>The application is under development.</p>
            <h2>Source code</h2>
            <p>You can find the source code on <a
                className="App-link"
                href="https://github.com/statisticsnorway/klass-subsets-web"
                target="_blank"
                rel="noopener noreferrer"
            >GitHub repository</a>
            </p>
            <Link to="/create"><Button primary>New subset</Button></Link>
        </div>
    );
}