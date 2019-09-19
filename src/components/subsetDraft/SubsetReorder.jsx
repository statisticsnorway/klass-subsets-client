import React from "react";
import Reorder from "react-reorder";

export const SubsetReorder = ({subset}) => {

    function callback(event, itemThatHasBeenMoved, itemsPreviousIndex, itemsNewIndex, reorderedArray) {
        // ...
    }

    function itemClicked(event, itemThatHasBeenClicked, itemsIndex) {
        // Note: `event` will be the synthetic React event for either `mouseup` or `touchend`,
        // and both contain `clientX` & `clientY` values (for ease of use)
        // ...
    }

    const ListItem = ({name}) => {
        return <p>{name}</p>;
    };

    return (
        <>
            <h3>Subset reorder</h3>
            <button onClick={() => {console.log("Reorder subset: ", subset.draft);}}>Show codes</button>
            <br/><br/>

            <Reorder
                // The key of each object in your list to use as the element key
                itemKey='name'
                // Lock horizontal to have a vertical list
                lock='horizontal'
                // The milliseconds to hold an item for before dragging begins
                holdTime={500}
                // The list to display
                list={[
                    {reorderId: 1, name: 'Item 1'},
                    {reorderId: 2, name: 'Item 2'},
                    {reorderId: 3, name: 'Item 3'}
                ]}
                // A template to display for each list item
                template={ListItem}
                // Function that is called once a reorder has been performed
                callback={callback}
                // Class to be applied to the outer list element
                listClass='my-list'
                // Class to be applied to each list item's wrapper element
                itemClass='list-item'
                // A function to be called if a list item is clicked (before hold time is up)
                itemClicked={itemClicked}
                // The item to be selected (adds 'selected' class)
                //selected={this.state.selected}
                // The key to compare from the selected item object with each item object
                selectedKey='uuid'
                // Allows reordering to be disabled
                disableReorder={false}/>
        </>
    );
};