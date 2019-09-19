import React from "react";
import "../../css/lists.css";
import ReorderView from "../../utils/dragableListReordering"

export const SubsetReorder = ({subset}) => {

    return (
        <>
            <h3>Subset reorder</h3>
            <button onClick={() => {console.log("Reorder subset: ", subset.draft);}}>Show codes</button>
            <ReorderView listData={subset.draft.codes}/>
            <br/><br/>
        </>
    );
};