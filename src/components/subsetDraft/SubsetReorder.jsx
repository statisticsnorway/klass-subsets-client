import React from "react";

export const SubsetReorder = ({subset}) => {

    return (
        <>
            <h3>Subset reorder</h3>
            <button onClick={() => {console.log("Reorder subset: ", subset.draft);}}>Show codes</button>
            <br/><br/>
        </>
    );
};