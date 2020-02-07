import React from 'react';
import {List, useList} from '../../utils/list';
import {Title} from '@statisticsnorway/ssb-component-library';

export const SubsetReorder = ({subset}) => {
    const allCodes = [];
    subset.draft.classifications.map(classification => allCodes.push(...classification.codes));
    allCodes.forEach(i => (i.title = `${i.code} ${i.name}`));
    const codes = useList(allCodes.filter(i => i.included));

    // TODO: show more data on item component (info block, date, etc?)
    return (<>
            <Title size={3}>Subset reorder</Title>
            {codes && codes.items.length > 0
                ? <List list={codes}/>
                : <p>No items to sort</p>}
            <br/><br/>
     </>);
};