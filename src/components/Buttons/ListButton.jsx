import React from 'react';
import { List } from 'react-feather';

export const ListButton = ({
                               title = 'List',
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
            <List style={{
                color: disabled || !active ? '#C3DCDC' : '#3396D2',
                margin: '0 10px',
                cursor: 'pointer'
            }}
            />
        </button>
    );
};

