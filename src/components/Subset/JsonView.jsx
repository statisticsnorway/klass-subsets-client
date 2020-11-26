import React from 'react';

export const JsonView = ({ data = {}}) => {

    return (
        <pre style={{ height: '400px' }}>{ JSON.stringify(data, null, 4) }</pre>
    );
};

