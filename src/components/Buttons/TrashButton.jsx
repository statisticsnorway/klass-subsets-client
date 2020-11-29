import React from 'react';
import { Trash2 } from 'react-feather';

export const TrashButton = ({
                               title = 'Add',
                               clickHandler = () => {},
                               disabled = false
                           }) => {

    return (
        <button
            title={ title }
            onClick={ clickHandler }
            disabled={ disabled }
        >
            <Trash2 style={{
                color: disabled ? '#C3DCDC' : '#ED5935',
                margin: '0 10px',
                cursor: 'pointer'
            }}
            />
        </button>
    );
};

