import React from 'react';
import { Save } from 'react-feather';

export const SaveButton = ({
                                title = 'Save',
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
            <Save style={{
                color: disabled || !active ? '#C3DCDC' : '#1A9D49',
                margin: '0 10px',
                cursor: 'pointer'
            }}
            />
        </button>
    );
};

