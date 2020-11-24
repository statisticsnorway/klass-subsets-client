import React from 'react';

export const JsonView = ({ data = {}}) => {

    return (
        <pre>{ JSON.stringify(data, null, 4) }</pre>
    );
};

