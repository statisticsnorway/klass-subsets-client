import React from 'react';
import { HelpCircle } from 'react-feather';

export const HelpButton = ({
                               title = 'Usage',
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
            <HelpCircle style={{
                color: disabled || !active ? '#C3DCDC' : '#2D6975',
                margin: '0 10px',
                cursor: 'pointer'
            }}
            />
        </button>
    );
};

