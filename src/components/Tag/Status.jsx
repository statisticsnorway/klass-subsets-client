import React from 'react';
import { useTranslation } from 'react-i18next';

export const Status = ({ label }) => {
    const { t } = useTranslation();

    return (
        <>
            <span style={{
                color: 'white',
                background: label === 'OPEN' ? '#1A9D49' : '#9272FC',
                borderRadius: '25px',
                fontSize: '15px',
                padding: '3px 6px',
                verticalAlign: 'text-bottom'
            }}>{ t(label) }
            </span>
        </>
    );
}