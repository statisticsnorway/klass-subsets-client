import React from 'react';
import { Link } from 'react-router-dom';

export const GoTo = ({ query = '', disabled, iconLeft, iconRight, children }) => {
    return (<>{
        !disabled &&
        <>
            <span style={{ color: '#1A9D49', padding: '10px' }}>{ iconLeft }</span>
            <Link to={query}
                  area-labal='step the form'
                  className='ssb-link'
            >{ children }
            </Link>
            <span style={{ color: '#1A9D49', padding: '10px' }}>{ iconRight }</span>
        </>
    }
    </>);
};