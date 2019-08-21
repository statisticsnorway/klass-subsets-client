import React from 'react';
import logo from '../images/SSB_logo.png';
import '../css/App.css';
import WelcomePage from "./WelcomePage";

export default function App() {
    return (
        <div className="App">
            <header className="App-header">
                <div className="App-name">
                    <img src={logo} className="App-logo" alt="SSB logo"/>
                    Klass uttrekk admin
                </div>
            </header>
            <WelcomePage/>
        </div>
    );
}
