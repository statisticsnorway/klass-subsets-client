import React from 'react';
import '../css/App.css';
import {BrowserRouter, Link, Route, Switch, Redirect} from 'react-router-dom';
import {ContextProvider} from '../controllers/context';
import Header from './Header';
import WelcomePage from './pages/WelcomePage';
import SearchSubsetsPage from './pages/SearchSubsetsPage';
// import Errors from './Errors';
import SubsetForm from './subsetDraft/SubsetForm';

export default function App() {
    return (
        <ContextProvider>
            <BrowserRouter forceRefresh={true}>
                <div className='app'>
                    <Header/>
                <div className='app-content'>
{/* FIXME use it!
    TODO: style it!
                    <Errors/>
*/}
                    <Switch>
                        <Route path='/' exact component={SearchSubsetsPage}/>
                        <Redirect push from='/create' to='/auth/create' />
                        <Route path='/auth/create' component={SubsetForm}/>
                        <Route path='/about' exact component={WelcomePage}/>
                        <Route component={NoMatch}/>
                    </Switch>
                </div>
                </div>
            </BrowserRouter>
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
