import React from 'react';
import {flatten} from '../../utils/arrays';
import {List, useList, unlinkParent} from '../../utils/list';

export const SubsetReorder = ({subset}) => {

    subset && subset.draft && subset.draft.codes
        && subset.draft.codes.forEach(code => unlinkParent(code));

    const codes = useList(
        flatten(subset.draft.codes
        // FIXME: Flatten in depth?
        // FIXME: fix flatten util instead of sorting!
            // .sort((a,b) => (a.rank - b.rank))
        .sort((a,b) => (b.rank - a.rank))
        .map(code => (code.children.filter(i => i.checked))))
    );

    // TODO: show more data on item component (info block, date, etc?)
    return (
        <>
            <h3>Subset reorder</h3>
            {codes
                ? <List list={codes} />
                : <p>No items to sort</p>}
            <br/><br/>
        </>
    );
};