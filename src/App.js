import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ContextProvider } from './controllers';
import { Header, Footer } from './components';
import { Changelog, SearchSubsets, SubsetPage, SubsetForm, Step6Publish, NoMatch } from './pages';
import './pages/SubsetDraft/container.css';

export default function App() {
    return (
        <ContextProvider>
            {/** TODO: find a better solution?
             * enabled 'forceRefresh' just to make
             * application redirect through the backend
             * for protected routes (like '/editor').
            */}
            <BrowserRouter forceRefresh={true}>
                <Header/>
                <Routes>
                    <Route path="/" exact element={ <Navigate to='/subsets' />} />
                    <Route path="editor" element={ <Navigate to='/auth/editor' />} />

                    <Route path='/auth/save' element={ <Step6Publish /> }/>
                    <Route path='/auth/editor' element={ <SubsetForm /> }/>

                    <Route path='/subsets' exact element={<SearchSubsets />} />
                    <Route path='/subsets/:id' exact element={ <SubsetPage /> }/>
                    <Route path='/subsets/:id/versions' exact element={ <SubsetPage /> }/>
                    <Route path='/subsets/:id/versions/:versionId' exact element={ <SubsetPage /> }/>
                    <Route path='/changelog' exact element={ <Changelog /> }/>
                    <Route element={ <NoMatch/> }/>
                </Routes>
                <Footer/>
            </BrowserRouter>
        </ContextProvider>
    );
}
