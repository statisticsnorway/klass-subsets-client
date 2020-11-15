import React, { useEffect } from 'react';
import '../../css/pages.css';
import { Navigation, Step } from './navigation';
import { Step1Metadata } from './Step_1_Metadata';
import { Step2Versions } from './Step_2_Versions';
import { Step3ChooseCodes } from './Step_3_ChooseCodes';
import { Step4Reorder } from './Step_4_Reorder';
import { Step5Review } from './Step_5_Review';
import { useTranslation } from 'react-i18next';
import { useLocation } from "react-router-dom";

export default function SubsetForm() {
    const { t } = useTranslation();
    let location = useLocation();

    useEffect(() => {
        if (location.hash === '#new') {
            // dispatch({ action: 'reset' });
            sessionStorage.removeItem('draft');
        }
    }, [ location.hash ]);

    return (
        <div className='page'>
            <Navigation>
                <Step label={ t('Metadata') } component={ Step1Metadata } />
                <Step label={ t('Versions') } component={ Step2Versions } />
                <Step label={ t('Choose codes') } component={ Step3ChooseCodes }/>
                <Step label={ t('Reorder codes') } component={ Step4Reorder } />
                <Step label={ t('Review and publish') } component={ Step5Review } />
            </Navigation>
        </div>
    );
}


