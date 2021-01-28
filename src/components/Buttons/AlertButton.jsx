import React from 'react';
import { AlertTriangle } from 'react-feather';

export const AlertButton = ({
                                   title = 'Alert button',
                                   clickHandler = () => {},
                                   disabled = false,
                                    active = true,
                                    visible = true
                            }) => {
    return (
        <>
        { visible &&
            <button
                title={title}
                onClick={clickHandler}
                disabled={disabled}
            >
                <AlertTriangle style={{
                    color: disabled || !active ? '#C3DCDC' : 'orange',
                    margin: '0 10px',
                    cursor: 'pointer'
                }}
                />
            </button>
        }</>
    );
};

