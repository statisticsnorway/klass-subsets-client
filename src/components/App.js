import React from 'react';
import '../css/App.css';
import { BrowserRouter, Link, Route, Switch, Redirect} from 'react-router-dom';
import { ContextProvider } from '../controllers/context';
import Header from './Header';
import Footer from './Footer';
import ChangelogPage from './pages/ChangelogPage';
import SearchSubsetsPage from './pages/SearchSubsetsPage';
import SubsetForm from './subsetForm/SubsetForm';
import { SubsetPage } from './pages/SubsetPage';

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
                <div className='app-content'>
                    <Switch>
                        <Route path='/' exact component={SearchSubsetsPage}/>
                        <Redirect push from='/create' to='/auth/create' />
                        <Route path='/auth/create' component={SubsetForm}/>
                        <Route path='/changelog' exact component={ChangelogPage}/>
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
        <div className='page'>
            <h3>No match for <code>{location.pathname}</code>.</h3>
            <p>Back to <Link to='/'>home page</Link></p>
        </div>
    );
}
