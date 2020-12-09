import React from 'react';
import { Info } from 'react-feather';

export const InfoButton = ({
                               title = 'Info',
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
            <Info style={{
                color: disabled || !active ? '#C3DCDC' : '#2D6975',
                margin: '0 10px',
                cursor: 'pointer'
            }}
            />
        </button>
    );
};

