import React from 'react';
import { Edit } from 'react-feather';

export const EditButton = ({
                                title = 'Edit button',
                                clickHandler = () => {}
                            }) => {

    return (
        <button
            title={ title }
            onClick={ clickHandler }
        >
            <Edit style={{
                color: '#ED5935',
                margin: '0 10px',
                cursor: 'pointer'
            }}
            />
        </button>
    );
};

