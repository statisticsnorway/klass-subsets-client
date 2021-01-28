import React from 'react';
import { useTranslation } from 'react-i18next';
import { SearchCodeLists, Origins, BriefContextual } from 'views'
import { Divider } from '@statisticsnorway/ssb-component-library';

export const Step3ChooseCodes = () => {
    const { t } = useTranslation();

    /* TODO: tooltips for classification icons */
    return (<>
                <h2>{ t('Choose classifications and code lists') }</h2>

                <BriefContextual metadata currentVersion />
                <SearchCodeLists />

                <Divider light />

                <h2>{ t('Choose codes from classifications') }</h2>
                <Origins />
            </>
    );
};
