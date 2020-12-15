import React from 'react';
import { BrowserRouter, Link, Route, Switch, Redirect } from 'react-router-dom';
import { ContextProvider } from './controllers/context';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Changelog, SearchSubsets, SubsetPage, SubsetForm, Step6Publish } from './pages';
import './pages/SubsetDraft/container.css';

export default function App() {
    return (
        <ContextProvider>
            {/** TODO: find a better solution?
             * enabled 'forceRefresh' just to make
             * application redirect through the backend
             * for protected routes (like '/create').
            */}
            <BrowserRouter forceRefresh={true}>
                <Header/>
                <Switch>
                    <Redirect push from='/' exact to='/search' />
                    <Route path='/search' exact component={ SearchSubsets }/>
                    {/*<Redirect push from='/create' to='/auth/create' />*/}
                    <Route path='/auth/save' component={ Step6Publish }/>
                    <Route path='/create' component={ SubsetForm }/>
                    <Route path='/changelog' exact component={ Changelog }/>
                    <Route path='/subsets/:id' exact component={ SubsetPage }/>
                    <Route path='/subsets/:id/versions' exact component={ SubsetPage }/>
                    <Route path='/subsets/:id/versions/:version' exact component={ SubsetPage }/>
                    <Route component={ NoMatch }/>
                </Switch>
                <Footer/>
            </BrowserRouter>
        </ContextProvider>
    );
}

export function NoMatch({location}) {
    return (
        <div className='container'>
            <div className='content'>
                <h3>No match for <code>{ location.pathname }</code>.</h3>
                <p>Back to <Link to='/'>home page</Link></p>
            </div>
        </div>
    );
}
