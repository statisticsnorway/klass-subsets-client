import React from 'react';
import { useTranslation } from 'react-i18next';

export const ErrorTooltip = ({ messages = [], visible = true }) => {
    const { t } = useTranslation();

    return (
        <>
        { visible && messages?.length > 0 &&
            <div className='ssb-input-error '
                 style={{
                     width: '25%',
                     position: 'absolute',
                     zIndex: '10'
                 }}
                 title='error'
            >{
                messages.map( (msg, i) => (
                    <span key={ msg + i } style={{ padding: '0 10px 0 0' }}
                    >{ t(msg) }.
                    </span>
                ))
            }
            </div>
        }
        </>
    )
};
