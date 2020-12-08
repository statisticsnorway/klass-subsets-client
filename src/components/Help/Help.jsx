import React from 'react';
import { useTranslation } from 'react-i18next';

export const Help = ({ message = '', visible = false }) => {
    const { t } = useTranslation();

    return (
        <>
            { visible && message?.length > 0 &&
                <p className='small'
                   style={{
                       padding: '10px 0',
                       color: '#2D6975' }}
                >{ t(message) }</p>
            }
        </>
    );
};