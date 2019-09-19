import React, {useState} from "react";
import {SortableContainer, SortableElement} from "react-sortable-hoc";
import arrayMove from "array-move";

const SortableItem = SortableElement(({value}) => <li>{value}</li>);

const SortableList = SortableContainer(({items}) => {
    return (
        <ul>
            {items.map((value, index) => (
                <SortableItem key={`item-${value}`} index={index} value={value} />
            ))}
        </ul>
    );
});


export const SubsetReorder = ({subset}) => {

    const [state, setState] = useState({
        items: ['Item 1', 'Item 2', 'Item 3', 'Item 4', 'Item 5', 'Item 6'],
    });

    const onSortEnd = ({oldIndex, newIndex}) => {
        setState(({items}) => ({
            items: arrayMove(items, oldIndex, newIndex),
        }));
    };

    return (
        <>
            <h3>Subset reorder</h3>
            <button onClick={() => {console.log("Reorder subset: ", subset.draft);}}>Show codes</button>
            <SortableList items={state.items} onSortEnd={onSortEnd} />
            <br/><br/>
        </>
    );
};