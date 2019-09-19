import React, {useState} from "react";
import SortableTree from 'react-sortable-tree';
import FileExplorerTheme from 'react-sortable-tree-theme-minimal';

export const SubsetReorder = ({subset}) => {
    const [state, setState] = useState({treeData:
            [
                { title: 'Arbeid', children:
                        [
                            { title: 'A dfg' },
                            { title: 'B xfdggfh' },
                            { title: 'C xc' },
                            { title: 'D dfgs' },
                            { title: 'E salølæsødlfæsød' },
                        ]
                },
                { title: 'Others', children:
                        [
                            { title: '1 dfg' },
                            { title: '2 xfdggfh' },
                            { title: '3 xc' },
                            { title: '4 dfgs' },
                            { title: '5 salølæsødlfæsød' },
                        ]
                }
            ]});

    return (
        <>
            <h3>Subset reorder</h3>
            <button onClick={() => {console.log("Reorder subset: ", subset.draft);}}>Show codes</button>
            <div style={{ height: 800 }}><SortableTree
                treeData={state.treeData}
                onChange={treeData => setState({ treeData })}
                theme={FileExplorerTheme}
            />
            </div>
            <br/><br/>
        </>
    );
};