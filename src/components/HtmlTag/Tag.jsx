import React from 'react';

export const Tag = ({
                        html = 'h2',
                        props = { style: {}},
                        children
}) => {
    return React.createElement(
        html,
        props,
        children
    );
}
