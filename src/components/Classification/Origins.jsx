import React, { useContext } from 'react';
import { ListTabable } from '../../components';
import { AppContext } from '../../controllers/context';
import { CodeListFetcher } from '../../components/Classification';
import { useTranslation } from 'react-i18next';

export const Origins = () => {
    const { t } = useTranslation();
    const { subset: { draft: { origins }} } = useContext(AppContext);

    /* TODO: tooltips for classification icons */
    return (
            <ListTabable items={ [...origins ]?.map(o => ({ id: o })) }
                         placeholder={ t('No classifications in the subset draft') }
                         component={ CodeListFetcher }
            />
    );
};
