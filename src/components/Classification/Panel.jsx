import React from 'react';
import './panel.css';

export const Panel = ({ visible = false, children }) => {

    return (
        <>{ visible &&
            <div className='panel'>
                { children || 'no data available' }
            </div>
        }</>
    )
};
