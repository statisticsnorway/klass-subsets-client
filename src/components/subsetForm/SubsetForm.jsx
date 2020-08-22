import React, { useContext } from 'react';
import '../../css/pages.css';
import { AppContext } from '../../controllers/context';
import { Navigation, Step } from './navigation';
import { Step1Metadata } from './Step_1_Metadata';
import { Step2Versions } from './Step_2_Versions';
import { Step3ChooseCodes } from './Step_3_ChooseCodes';
import { Step4Reorder } from './Step_4_Reorder';
import { Step5Publish } from './Step_5_Publish';
import { useTranslation } from 'react-i18next';

export default function SubsetForm() {
    const { subset } = useContext(AppContext);
    const { t } = useTranslation();

    return (
        <div className='page'>
            <Navigation>
                <Step label={ t('Metadata') }><Step1Metadata/></Step>
                <Step label={ t('Versions') }>
                    <Step2Versions subset={subset} />
                </Step>
                <Step label={ t('Choose codes') }>
                    <Step3ChooseCodes subset={ subset } />
                </Step>
                <Step label={ t('Reorder codes') }>
                    <Step4Reorder subset={ subset } />
                </Step>
                <Step label={t('Review and publish')}>
                    <Step5Publish subset={ subset } />
                </Step>
            </Navigation>
        </div>
    );
}


