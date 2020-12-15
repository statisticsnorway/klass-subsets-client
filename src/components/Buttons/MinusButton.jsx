import React from 'react';
import { MinusSquare } from 'react-feather';

export const MinusButton = ({
                                title = 'Minus button',
                                clickHandler = () => {},
                                disabled = false,
                                active = true,
                                visible = true
                            }) => {
    return (
        <>{ visible &&
                <button
                    title={title}
                    onClick={clickHandler}
                    disabled={disabled}
                >
                    <MinusSquare style={{
                        color: disabled || !active ? '#C3DCDC' : '#B6E8B8',
                        margin: '0 10px',
                        cursor: 'pointer'
                    }}
                    />
                </button>
        }</>
    );
};

