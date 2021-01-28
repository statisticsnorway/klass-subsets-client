import React from 'react';

export const Step = ({ label, component }) => {
    return (<>{ component() }</>);
};