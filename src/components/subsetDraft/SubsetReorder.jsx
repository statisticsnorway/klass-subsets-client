import React from 'react';
import {List, useList} from '../../utils/list';
import {Title} from '@statisticsnorway/ssb-component-library';
import {useTranslation} from 'react-i18next';

export const SubsetReorder = ({subset}) => {
    const { t } = useTranslation();

    const codes = useList(subset.draft?.codes);

    // TODO: show more data on item component (info block, date, etc?)
    return (<>
            <Title size={3}>{t('Reorder codes')}</Title>
            {codes?.items?.length > 0
                ? <List list={codes}/>
                : <p>{t('No items to sort')}</p>}
            <br/><br/>
     </>);
};