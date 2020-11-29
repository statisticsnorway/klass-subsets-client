import React from 'react';
import { Globe } from 'react-feather';

export const GlobeButton = ({
    title = 'Globe button',
    clickHandler = () => {},
    disabled = false
}) => {

    return (
        <button
            title={ title }
            onClick={ clickHandler }
            disabled={ disabled }
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

