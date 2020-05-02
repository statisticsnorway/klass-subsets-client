import React from 'react';
//import '../css/App.css';
import {BrowserRouter, Link, Route, Switch, Redirect} from 'react-router-dom';
import {ContextProvider} from '../controllers/context';
import Header from './Header';
import Footer from './Footer';
import WelcomePage from './pages/WelcomePage';
import SearchSubsetsPage from './pages/SearchSubsetsPage';
// import Errors from './Errors';
import SubsetForm from './subsetDraft/SubsetForm';
import {SubsetPage} from './pages/SubsetPage';

export default function App() {
    return (
        <ContextProvider>
            {/** TODO: find a better solution?
             * enabled 'forceRefresh' just to make
             * application redirect through the backend
             * for protected routes (like '/create').
            */}
            <BrowserRouter forceRefresh={true}>
                <div className='app'>
                    <Header/>
                <div className='page-container'>
{/* FIXME use it!
    TODO: style it!
                    <Errors/>
*/}
                    <Switch>
                        <Route path='/' exact component={SearchSubsetsPage}/>
                        <Redirect push from='/create' to='/auth/create' />
                        <Route path='/auth/create' component={SubsetForm}/>
                        <Route path='/about' exact component={WelcomePage}/>
                        <Route path='/subsets/:id' exact component={SubsetPage}/>
                        <Route component={NoMatch}/>
                    </Switch>
                </div>
                    <Footer/>
                </div>
            </BrowserRouter>
        </ContextProvider>
    );
}

export function NoMatch({location}) {
    return (
        <div className='page-container'>
            <h3>No match for <code>{location.pathname}</code>.</h3>
            <p>Back to <Link to='/'>home page</Link></p>
        </div>
    );
}
