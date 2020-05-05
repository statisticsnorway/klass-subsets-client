import React from 'react';
import {List, useList} from '../../utils/list';
import {Title} from '@statisticsnorway/ssb-component-library';
import {useTranslation} from 'react-i18next';

export const SubsetReorder = ({subset}) => {
    const { t } = useTranslation();

    const allCodes = [];
    subset.draft.classifications.map(classification =>
        allCodes.push(...classification.codes.filter(i => i.included)));
    const codes = useList(allCodes);

    // TODO: show more data on item component (info block, date, etc?)
    return (<>
            <Title size={3}>{t('Reorder codes')}</Title>
            {codes && codes.items.length > 0
                ? <List list={codes}/>
                : <p>{t('No items to sort')}</p>}
            <br/><br/>
     </>);
};