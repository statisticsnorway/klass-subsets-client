import React from 'react';
import { useTranslation } from 'react-i18next';
import './help.css';

export const Help = ({ message = '',
                         visible = false,
                        children
}) => {
    const { t } = useTranslation();

    return (
        <>
            { visible && message?.length > 0 &&
                <p className='help'>{ t(message) }</p>
            }
            { visible &&
                <div className='help'>{ children }</div>
            }
        </>
    );
};