import React, { PropTypes } from "react";
import Search from "react-search";

export const SubsetCodes = ({subset}) => {
    const HiItems = (items) => {console.log(items);}

    const items = [
            { id: 0, value: 'ruby' },
            { id: 1, value: 'javascript' },
            { id: 2, value: 'lua' },
            { id: 3, value: 'go' },
            { id: 4, value: 'julia' }
        ];

    return (
        <>
            <h3>Choose codes</h3>
            <button onClick={() => {console.log("Submit subset draft: ", subset.draft);}}>Save draft</button>
            <Search items={items} />

            <Search items={items}
                    placeholder='Pick your language'
                    maxSelected={3}
                    multiple={false}
                    onItemsChanged={HiItems} />
            <br/><br/>
        </>
    );
};