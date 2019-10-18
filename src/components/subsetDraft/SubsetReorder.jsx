import React, {useState} from "react";
import SortableTree from "react-sortable-tree";
import FileExplorerTheme from "react-sortable-tree-theme-minimal";
import {flatten} from "../../utils/arrays";

export const SubsetReorder1 = ({subset}) => {
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

export const SubsetReorder = ({subset}) => {

    const [ordered, reorder] = useState(flatten(subset.draft.codes.map(code => code.children)));

    ordered.forEach((item, i) => item.order = i);

    return (
        <>
            <h3>Subset reorder</h3>
            <button onClick={() => {console.log("Reorder subset: ", subset.draft);}}>Show codes</button>

            {ordered
                ? ordered
                    .sort((a,b) => (a.order - b.order))
                    .map((item, i) => <div key={i}>
                        <span>{item.order}</span>
                        <span>{item.title}</span>
                    </div>)
                : <p>No items to sort</p>}

            <br/><br/>
        </>
    );
};