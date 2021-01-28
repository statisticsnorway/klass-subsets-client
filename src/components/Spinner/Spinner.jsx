import React from 'react';
import { RefreshCw } from 'react-feather';
import './spinner.css';

export const Spinner = () => {

    return (
        <div className='spinner'>
            <RefreshCw size='20' color='#62919A'/>
        </div>
    );
}