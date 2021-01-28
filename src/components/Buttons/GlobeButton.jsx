import React from 'react';
import { Globe } from 'react-feather';

export const GlobeButton = ({
    title = 'Globe button',
    clickHandler = () => {},
    disabled = false,
    active = true,
    visible = true
}) => {

    return (
        <>{visible &&
        <button
            title={title}
            onClick={clickHandler}
            disabled={disabled}
        >
            <Globe style={{
                color: disabled || !active ? '#C3DCDC' : 'lightblue',
                margin: '0 10px',
                cursor: 'pointer'
            }}
            />
        </button>
        }</>
    );
};

