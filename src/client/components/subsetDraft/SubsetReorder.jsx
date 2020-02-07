import React from 'react';
import {flatten} from '../../utils/arrays';
import {List, useList, unlinkParent} from '../../utils/list';
import {Title} from '@statisticsnorway/ssb-component-library';

export const SubsetReorder = ({subset}) => {

/*    subset && subset.draft && subset.draft.classifications
        && subset.draft.classifications.forEach(item => unlinkParent(item));

    const codes = useList(
        flatten(subset.draft.classifications
        // FIXME: Flatten in depth?
        // FIXME: fix flatten util instead of sorting!
            // .sort((a,b) => (a.rank - b.rank))
        .sort((a, b) => (b.rank - a.rank))
        .map(item => (item.children.filter(i => i.included))))
    );*/

    const allCodes = [];
    subset.draft.classifications.map(classification => allCodes.push(...classification.children));
    allCodes.forEach(i => (i.title = `${i.code} ${i.name}`));
    const codes = useList(allCodes.filter(i => i.included));

    console.log(subset.draft.classifications);
    console.log(allCodes);
    console.log(codes);
    // TODO: show more data on item component (info block, date, etc?)
    return (<>
            <Title size={3}>Subset reorder</Title>
            {codes && codes.items.length > 0
                ? <List list={codes}/>
                : <p>No items to sort</p>}
            <br/><br/>
        </>
    );
};