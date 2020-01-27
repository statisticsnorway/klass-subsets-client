import React from 'react';
import '../css/App.css';
import { BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom';
import { ContextProvider } from '../controllers/context';
import Header from './Header';
import WelcomePage from './pages/WelcomePage';
import SearchSubsetsPage from './pages/SearchSubsetsPage';
import Errors from './Errors';
import SubsetForm from './subsetDraft/SubsetForm';

export default function App() {
    return (
        <ContextProvider>
            <Router>
                <div className='App'>
                    <Header/>
                    <Errors/>
                    <Switch>
                        <Route path='/' exact component={SearchSubsetsPage}/>
                        <Route path='/create' component={SubsetForm}/>
                        <Route path='/about' exact component={WelcomePage}/>
                        <Route component={NoMatch}/>
                    </Switch>
                </div>
            </Router>
        </ContextProvider>
    );
}

export function NoMatch({location}) {
    return (
        <div className='page'>
            <h3>No match for <code>{location.pathname}</code>.</h3>
            <p>Back to <Link to='/'>home page</Link></p>
        </div>
    );
}
