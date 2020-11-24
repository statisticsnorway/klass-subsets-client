import React from 'react';
import { Globe } from 'react-feather';

export const GlobeButton = ({
    title = 'Globe button',
    clickHandler = () => {}
}) => {

    return (
        <button
            title={ title }
            onClick={ clickHandler }
        >
            <Globe style={{
                color: 'lightblue',
                margin: '0 10px',
                cursor: 'pointer'
            }}
            />
        </button>
    );
};

