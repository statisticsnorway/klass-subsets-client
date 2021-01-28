import React from 'react';
import './panel.css';

export const Panel = ({ visible = false,
                        placeholder = 'No data available',
                        children
}) => {

    return (
        <>{ visible &&
            <div className='panel'>
                { children || placeholder }
            </div>
        }</>
    )
};
