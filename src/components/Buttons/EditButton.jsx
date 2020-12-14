import React from 'react';
import { Edit } from 'react-feather';

export const EditButton = ({
                                title = 'Edit button',
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
                <Edit style={{
                    color: disabled || !active ? '#C3DCDC' : '#ED5935',
                    margin: '0 10px',
                    cursor: 'pointer'
                }}
                />
            </button>
        }</>
    );
};

