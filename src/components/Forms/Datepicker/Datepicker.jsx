import React from 'react';
import './datepicker.css';
import { toId } from '../../../utils/strings';

export const Datepicker = ({label = ''}) => {

    return (
        <>
            <label style={{ display: 'block', fontSize: '16px', fontFamily: 'Roboto' }}
                   htmlFor={ toId(label) }
            >{ label }
            </label>

            <input type='date'
                   id={ toId(label) }
                   style={{ display: 'block' }}
                   value={ new Date().toJSON().substr(0,10) }
                   onChange={ () => {} }
                   className='datepicker'
            />
        </>
);
};