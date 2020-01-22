import React from "react";
import logo from "../images/SsbLogo.svg";
import "../css/App.css";
import {BrowserRouter as Router, Route, Switch, Link} from "react-router-dom";
import {ContextProvider} from "../controllers/context";
import WelcomePage from "./WelcomePage";
import Errors from "./Errors";
import SubsetForm from "./subsetDraft/SubsetForm";
import { Header, Divider, Tabs, Link as DesignedLink } from '@statisticsnorway/ssb-component-library';


export default function App() {
    return (
        <ContextProvider>
            <Router>
                <div className="App">
                    <Header>
{/* TODO: implement in version 2

                        <div className="global-links" style={{ float: 'right', marginBottom: '12px', marginTop: '10px'  }}>
                            <Link href=" ">top-item 3</Link>
                            <Link href=" ">top-item 2</Link>
                            <Link href=" ">top-item 1</Link>
                        </div>
*/}
                        <div className="top-row flex-row justify-space-between flex-wrap" style={{ width: '100%' }}>
                            <Link to="/">
                                <img src={logo} className="App-logo" alt="SSB-logo"/>
                                Klass uttrekk admin v0.1.1 styled
                            </Link>
{/* TODO: implement in version 2

                           <div className="searchfield" style={{ width: '285px', alignSelf: 'flex-end' }}>
                                <Input ariaLabel="Input field Search" searchField placeholder="Search text" />
                            </div>

*/}
                        </div>
                        <div className="header-content" style={{ marginBottom: '20px', marginTop: '14px' }}>
                            <Tabs items={[
                                { title: 'Home', path: '/' },
                                { title: 'Create Subset', path: 'category2/' },
                                { title: 'Feedback', path: 'category3/' },
                            ]} />
                            <Divider />
                        </div>
                    </Header>
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
