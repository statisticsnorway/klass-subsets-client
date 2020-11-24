import React from 'react';
import { Download } from 'react-feather';

export const DownloadButton = ({
                                title = 'Download button',
                                clickHandler = () => {}
                            }) => {

    return (
        <button
            title={ title }
            onClick={ clickHandler }
        >
            <Download style={{
                color: 'lightgray',
                margin: '0 10px',
                cursor: 'pointer'
            }}
            />
        </button>
    );
};

