import React from 'react';
import { useTranslation } from 'react-i18next';

export function AppTitle() {
    const { t } = useTranslation();

    // TODO: api endpoints move to a separate file
    return (
        <div id='AppTitle'>
            <span className='h2' id='AppName' style={{ color: '#274247' }}>
                { t('Klass uttrekk') }
            </span>
            <span id='AppVersion'><a href='/changelog' className='p' style={{ color: 'darkgreen' }}
                > v{ process.env.REACT_APP_VERSION }
            </a>
            </span>
        </div>
    )
}