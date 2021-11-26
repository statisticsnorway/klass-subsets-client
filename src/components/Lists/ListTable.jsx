import React from 'react';
import './list.css';
import keys from 'utils/keys';

export const ListTable = ({
                              items = [],
                              placeholder = 'No items to show',
                              component = () => {}
  }) => {

    return (
        <>
            { items?.length === 0
                ? <p>{ placeholder }</p>
                : <ul className='list'>
                    { items.map(item => (
                        <li key={ item.id }
                            tabIndex='0'
                            onKeyDown={ (event) => {
                                switch (event.which) {
                                    case keys.DOWN: {
                                        event.preventDefault();
                                        event.target.nextElementSibling && event.target.nextElementSibling.focus();
                                        break;
                                    }
                                    case keys.UP: {
                                        event.preventDefault();
                                        event.target.previousElementSibling && event.target.previousElementSibling.focus();
                                        break;
                                    }
                                    default: break;
                                }
                            }}
                        >
                            { component({item}) }
                        </li>)) }
                </ul>
            }
        </>
    );
};
