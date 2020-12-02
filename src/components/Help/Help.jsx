import React from 'react';
import { useTranslation } from 'react-i18next';

export const Help = ({ message = '', visible = false }) => {
    const { t } = useTranslation();

    return (
        <>
            { visible && message?.length > 0 &&
                <p className='small' >{ t(message) }</p>
            }
        </>
    );
};