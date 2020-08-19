import React from 'react';
import {RefreshCw} from 'react-feather';
import '../css/spinner.css';

export default function Spinner() {

    return (
        <div className='spinner'>
            <RefreshCw size='20' color='#62919A'/>
        </div>
    );
}