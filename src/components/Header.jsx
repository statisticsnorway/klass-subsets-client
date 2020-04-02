import logo from '../images/SsbLogo.svg';
import React from 'react';
import {Link, useHistory, useLocation} from 'react-router-dom';
import {Divider, Header as SsbHeader, Tabs, Text, Title} from '@statisticsnorway/ssb-component-library';
import {useTranslation} from 'react-i18next';


export default function Header() {
    let history = useHistory();
    let location = useLocation();

    const { t, i18n } = useTranslation();


    return (
        <SsbHeader>
            {/** FIXME: find a better solution
             * Buttons look like links - confusing.
             * No current state (active language) is shown.
             * TODO: language choice should affect the url ?
             */}
            <div className='global-links' style={{float: 'right', paddingTop: '30px'}}>
                <button onClick={() => i18n.changeLanguage('no')}
                        style={{background: 'none', border: 'none'}}>
                        <span className='ssb-link'>
                            Bokmål</span>
                </button>
                <button onClick={() => i18n.changeLanguage('en')}
                        style={{background: 'none', border: 'none'}}>
                        <span className="ssb-link">
                            English</span>
                </button>
                {/* TODO: implement in version 2
                            <Link href=' '>Login</Link> */}
            </div>

            <div className='top-row flex-row justify-space-between flex-wrap' style={{width: '100%'}}>
                <Link to='/'>
                    <Title size={3}>
                        <img src={logo} style={{height: '4vmin', paddingRight: '30px'}} className='App-logo' alt='SSB-logo'/>
                        {t('Klass uttrekk')} <Text small> | v{process.env.REACT_APP_VERSION} adopted ClassificationSubsets schema, <Link to='/about'>changelog</Link></Text>
                    </Title>
                </Link>

            </div>

            <div className='header-content' style={{marginBottom: '20px'}}>
                <Tabs activeOnInit={location.pathname} onClick={(path) => history.push(path)}
                      items={[
                          {title: t('Search subsets'), path: '/'},
                          {title: t('Create subset'), path: '/create'},
                          {title: t('Feedback'), path: '/about'},
                      ]}/>
                <Divider/>
            </div>
        </SsbHeader>
    );
}