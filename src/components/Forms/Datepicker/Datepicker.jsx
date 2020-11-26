import React from 'react';
import { useTranslation } from 'react-i18next';
import './datepicker.css';

export const Datepicker = () => {
    const { t } = useTranslation();

    return (
        <>
        <div style={{ display: 'inline'}}>
            <label style={{ display: 'block', fontSize: '16px', fontFamily: 'Roboto' }}
                   htmlFor='codes_from_date'
            >{ t('Codes valid from') }
            </label>

            <input type='date'
                   id='codes_from_date'
                   style={{ display: 'block' }}
                   value={ new Date().toJSON().substr(0,10) }
                   onChange={ () => {} }
                   className='datepicker'
            />
        </div>
    <br style={{ clear: 'both' }}/>
</>
);
};