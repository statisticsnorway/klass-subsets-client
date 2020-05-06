import React from 'react';
import {List, useList} from '../../utils/list';
import {Title} from '@statisticsnorway/ssb-component-library';
import {useTranslation} from 'react-i18next';

export const SubsetReorder = ({subset}) => {
    const { t } = useTranslation();

/*    const allCodes = [];
    subset.draft.classifications && subset.draft.classifications.map(classification =>
        allCodes.push(...classification.codes.filter(i => i.included)));
    allCodes.forEach(i => ({
        ...i,
        validFromInRequestedRange: subset.validFrom?.substr(0,10),
        validToInRequestedRange: subset.validTo?.substr(0,10)
    }));*/
    const codes = useList(subset.draft.codes.map(c => ({
        ...c,
        validFromInRequestedRange: subset.draft.validFrom?.substr(0, 10),
        validToInRequestedRange: subset.draft.validTo?.substr(0, 10)
    })));

    // TODO: show more data on item component (info block, date, etc?)
    return (<>
            <Title size={3}>{t('Reorder codes')}</Title>
            {codes && codes.items.length > 0
                ? <List list={codes}/>
                : <p>{t('No items to sort')}</p>}
            <br/><br/>
     </>);
};