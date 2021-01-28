import React from 'react';
import { XSquare } from 'react-feather';

export const XButton = ({
                                title = 'Cross button',
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
                <XSquare style={{
                    color: disabled || !active ? '#C3DCDC' : '#9272FC',
                    margin: '0 10px',
                    cursor: 'pointer'
                }}
                />
            </button>
        }</>
    );
};

