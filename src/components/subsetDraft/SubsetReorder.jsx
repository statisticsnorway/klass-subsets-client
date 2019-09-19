import React from "react";
import {SortableContainer, SortableElement} from "react-sortable-hoc";
import arrayMove from "array-move";

export const SubsetReorder = ({subset}) => {
    const SortableItem = SortableElement(({value}) => <li>{value}</li>);

    const SortableList = SortableContainer(({codes}) => {
        return (
            <ul>
                {codes.map((value, index) => (
                    <SortableItem key={`item-${value}`} index={index} value={value} />
                ))}
            </ul>
        );
    });

    const onSortEnd = ({oldIndex, newIndex}) => {
        subset.dispatch({
            action: "codes",
            data: arrayMove(subset.draft.codes, oldIndex, newIndex),
        });
    };

    return (
        <>
            <h3>Subset reorder</h3>
            <button onClick={() => {console.log("Reorder subset: ", subset.draft);}}>Show codes</button>
            <SortableList codes={subset.draft.codes} onSortEnd={onSortEnd} />
            <br/><br/>
        </>
    );
};