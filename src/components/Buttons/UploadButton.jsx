import React from 'react';
import { UploadCloud } from 'react-feather';

export const UploadButton = ({
                               title = 'Upload button',
                               clickHandler = () => {},
                               disabled = false,
                               active = true,
                               visible = true
                           }) => {

    return (
        <>{ visible &&
        <button
            title={ title }
            onClick={ clickHandler }
            disabled={ disabled }
        >
            <UploadCloud style={{
                color: disabled || !active ? '#C3DCDC' : '#9272FC',
                margin: '0 10px',
                cursor: 'pointer'
            }}
            />
        </button>
        }</>
    );
};

