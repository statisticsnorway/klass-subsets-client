import logo from "../images/SsbLogo.svg";
import React from "react";
import { Link, useHistory } from "react-router-dom";
import {Header as SsbHeader, Divider, Tabs, Title, Text} from "@statisticsnorway/ssb-component-library";

export default function Header() {
    let history = useHistory();

    return (
        <SsbHeader>

{/* TODO: implement in version 2
                        <div className="global-links" style={{ float: 'right', marginBottom: '12px', marginTop: '10px'  }}>
                            <Link href=" ">English</Link>
                            <Link href=" ">Bokmål</Link>
                            <Link href=" ">Nynorsk</Link>
                            <Link href=" ">Login</Link>
                        </div>
*/}
            <div className="top-row flex-row justify-space-between flex-wrap" style={{width: '100%'}}>
                <Link to="/">
                    <img src={logo} className="App-logo" alt="SSB-logo"/>
                    <Title>Klass uttrekk <Text> | v0.1.2 styled</Text>
                    </Title>
                </Link>

{/* TODO: implement in version 2
                           <div className="searchfield" style={{ width: '285px', alignSelf: 'flex-end' }}>
                                <Input ariaLabel="Input field Search" searchField placeholder="Search text" />
                            </div>
*/}
            </div>

            <div className="header-content" style={{marginBottom: '20px', marginTop: '14px'}}>
                <Tabs activeOnInit='/' onClick={(path) => history.push(path)}
                      items={[
                          {title: 'Home', path: '/'},
                          {title: 'Create Subset', path: '/create'},
                          {title: 'Feedback', path: '/feedback'},
                          {title: 'Changelog', path: '/changelog'},
                      ]}/>
                <Divider/>
            </div>
        </SsbHeader>
    )
}