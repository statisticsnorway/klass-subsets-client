import logo from '../images/SsbLogo.svg';
import React from 'react';
import { Link, useHistory, useLocation } from 'react-router-dom';
import {Header as SsbHeader, Link as SsbLink, Divider, Tabs, Title, Text} from '@statisticsnorway/ssb-component-library';

export default function Header() {
    let history = useHistory();
    let location = useLocation();

    return (
        <SsbHeader>
            <div className='global-links' style={{float: 'right', paddingTop: '30px'}}>
                <SsbLink href=' '>English</SsbLink>
                {/* TODO: implement in version 2
                            <Link href=' '>Bokmål</Link>
                            <Link href=' '>Nynorsk</Link>
                            <Link href=' '>Login</Link> */}
            </div>

            <div className='top-row flex-row justify-space-between flex-wrap' style={{width: '100%'}}>
                <Link to='/'>
                    <Title size={2}>
                        <img src={logo} style={{height: '4vmin', paddingRight: '30px'}} className='App-logo' alt='SSB-logo'/>
                        Klass uttrekk <Text> | v0.1.6 bugfix: 'from' and 'to' fields</Text>
                    </Title>
                </Link>

                {/* TODO: implement in version 2
                           <div className='searchfield' style={{ width: '285px', alignSelf: 'flex-end' }}>
                                <Input ariaLabel='Input field Search' searchField placeholder='Search text' />
                            </div>*/}
            </div>

            <div className='header-content' style={{marginBottom: '20px'}}>
                <Tabs activeOnInit={location.pathname} onClick={(path) => history.push(path)}
                      items={[
                          {title: 'Search subsets', path: '/'},
                          {title: 'Create subset', path: '/create'},
                          {title: 'Feedback', path: '/about'},
                      ]}/>
                <Divider/>
            </div>
        </SsbHeader>
    );
}