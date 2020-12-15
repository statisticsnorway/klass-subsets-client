import React from 'react';
import { Trash2 } from 'react-feather';

export const TrashButton = ({
                               title = 'Remove',
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
            <Trash2 style={{
                color: disabled || !active ? '#C3DCDC' : '#ED5935',
                margin: '0 10px',
                cursor: 'pointer'
            }}
            />
        </button>
        }</>
    );
};

