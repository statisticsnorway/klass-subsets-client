import React from 'react';
import { Download } from 'react-feather';

export const DownloadButton = ({
                                title = 'Download button',
                                clickHandler = () => {},
                                disabled = false,
                                active = true
                            }) => {

    return (
        <button
            title={ title }
            onClick={ clickHandler }
            disabled={ disabled }
        >
            <Download style={{
                color: disabled || !active ? '#C3DCDC' : 'lightblue',
                margin: '0 10px',
                cursor: 'pointer'
            }}
            />
        </button>
    );
};

