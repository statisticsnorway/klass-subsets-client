import React from 'react';
import { AlertTriangle } from 'react-feather';

export const AlertButton = ({
                                   title = 'Alert button',
                                   clickHandler = () => {},
                                   disabled = false
                               }) => {

    return (
        <button
            title={ title }
            onClick={ clickHandler }
            disabled={ disabled }
        >
            <AlertTriangle style={{
                color: 'orange',
                margin: '0 10px',
                cursor: 'pointer'
            }}
            />
        </button>
    );
};

