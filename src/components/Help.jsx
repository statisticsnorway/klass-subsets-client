import React, { useState } from 'react';
import '../css/form.css';
import { Paragraph } from '@statisticsnorway/ssb-component-library';
import { HelpCircle } from 'react-feather';

export const Help = ({ children }) => {
    const [ showHelp, setShowHelp ] = useState(false);

    return (
        <>
            <button
                onClick={(event) => {
                    event.stopPropagation();
                    setShowHelp(prev => !prev);
                }}>
                <HelpCircle color='#2D6975'/>
            </button>
            {showHelp &&
                <div style={{
                    background: '#274247',
                    color: 'white',
                    padding: '0 0 0 10px',
                    position: 'relative'
                }}>
                    <Paragraph negative>{ children }</Paragraph>
                </div>
            }
        </>
    );
};