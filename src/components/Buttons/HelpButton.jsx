import React from 'react';
import { HelpCircle } from 'react-feather';

export const HelpButton = ({
                               title = 'Usage',
                               clickHandler = () => {},
                               disabled = false
                           }) => {

    return (
        <button
            title={ title }
            onClick={ clickHandler }
            disabled={ disabled }
        >
            <HelpCircle style={{
                color: disabled ? 'gray' : '#2D6975',
                margin: '0 10px',
                cursor: 'pointer'
            }}
            />
        </button>
    );
};

