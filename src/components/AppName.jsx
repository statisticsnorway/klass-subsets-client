import React from 'react';
import { useTranslation } from 'react-i18next';

export function AppName() {
    const { t } = useTranslation();

    return (
        <h2 style={{ color: '#274247'}}>
            { t('Klass uttrekk') }
            <a href='/changelog'
               style={{
                  fontSize: '16px',
                  fontFamily: 'Open Sans',
                  fontWeight: 'normal',
                  color: 'darkgreen'
              }}
                > v{ process.env.REACT_APP_VERSION }
            </a>
        </h2>
    )
}