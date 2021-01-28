import React from 'react';
import { Link } from 'react-router-dom';

export function NoMatch({ location }) {
    // FIXME: translate texts
    return (
        <div className='container'>
            <div className='content'>
                <h3>No match for <code>{ location.pathname }</code>.</h3>
                <p>Back to <Link to='/'>home page</Link></p>
            </div>
        </div>
    );
}