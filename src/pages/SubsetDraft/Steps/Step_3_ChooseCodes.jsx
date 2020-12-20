import React from 'react';
import { useTranslation } from 'react-i18next';
import { BriefContextual } from 'components/Subset';
import { SearchFormContextual } from 'components/Forms'
import { Origins} from 'components/Classification';
import { Divider } from '@statisticsnorway/ssb-component-library';

export const Step3ChooseCodes = () => {
    const { t } = useTranslation();

    /* TODO: tooltips for classification icons */
    return (<>
                <h2>{ t('Choose classifications and code lists') }</h2>

                <BriefContextual metadata currentVersion />
                <SearchFormContextual />

                <Divider light />

                <h2>{ t('Choose codes from classifications') }</h2>
                <Origins />
            </>
    );
};
