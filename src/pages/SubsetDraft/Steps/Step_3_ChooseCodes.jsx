import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { BriefContextual } from '../../../components/Subset';
import { SearchFormContextual } from '../../../components/Forms'
import { ListTabable } from '../../../components';
import { AppContext } from '../../../controllers/context';
import { CodeListContextual } from '../../../components/Classification';
import { Divider } from '@statisticsnorway/ssb-component-library';

export const Step3ChooseCodes = () => {
    const { t } = useTranslation();
    const { subset: { draft: { origins }} } = useContext(AppContext);

    /* TODO: tooltips for classification icons */
    return (<>
            <h2>{ t('Choose classifications and code lists') }</h2>

            <BriefContextual metadata currentVersion />
            <SearchFormContextual />

            <Divider light />

            <h2>{ t('Choose codes from classifications') }</h2>
            <ListTabable items={ origins?.map(o => ({ id: o })) }
                         placeholder={ t('No classifications in the subset draft') }
                         component={ CodeListContextual }
            />
        </>
    );
};
