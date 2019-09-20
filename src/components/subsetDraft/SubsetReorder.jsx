import React from "react";
import SortableTree from 'react-sortable-tree';
import FileExplorerTheme from 'react-sortable-tree-theme-minimal';

export const SubsetReorder = ({subset}) => {
    return (
        <>
            <h3>Subset reorder</h3>
            <button onClick={() => {console.log("Reorder subset: ", subset.draft);}}>Show codes</button>
            <div style={{ height: 800 }}>
                <SortableTree
                treeData={subset.draft.codes}
                onChange={ treeData => { subset.dispatch({action: "codes", data: treeData}) }}
                theme={FileExplorerTheme}
            />
            </div>
            <br/><br/>
        </>
    );
};