import React from 'react';
import { PlusSquare } from 'react-feather';

export const PlusButton = ({
                                title = 'Add button',
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
                    <PlusSquare style={{
                        color: disabled || !active ? '#C3DCDC' : '#1A9D49',
                        margin: '0 10px',
                        cursor: 'pointer'
                    }}
                    />
                </button>
        }</>
    );
};

