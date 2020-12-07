import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { BriefContextual } from '../../../components/Subset';
import { SearchFormContextual } from '../../../components/Forms'
import { ListTabable } from '../../../components/Lists';
import { AppContext } from '../../../controllers/context';
import { CodeList } from '../../../components/Classification';

export const Step3ChooseCodes = () => {
    const { t } = useTranslation();
    const { subset: { draft: { origins }} } = useContext(AppContext);

    /* TODO: tooltips for classification icons */
    return (<>
            <h3>{ t('Choose classifications and code lists') }</h3>
            <BriefContextual metadata currentVersion />
            <SearchFormContextual />

            <h3>{ t('Choose codes from classifications') }</h3>
            <ListTabable items={ origins?.map(o => ({ id: o })) }
                         placeholder={ t('No classifications in the subset draft') }
                         component={ CodeList }
            />
        </>
    );
};
