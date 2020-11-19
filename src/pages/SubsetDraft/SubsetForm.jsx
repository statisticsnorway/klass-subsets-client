import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import './container.css';
import { Navigation, Step } from '../../components/Navigation';
import { useTranslation } from 'react-i18next';
import {
    Step1Metadata,
    Step2Versions,
    Step3ChooseCodes,
    Step4Reorder,
    Step5Review } from './Steps';

export const SubsetForm = () => {
    const { t } = useTranslation();
    let location = useLocation();

    useEffect(() => {
        if (location.hash === '#new') {
            // dispatch({ action: 'reset' });
            sessionStorage.removeItem('draft');
        }
    }, [ location.hash ]);

    return (
        <div className='container'>
            <div className='content'>
                <Navigation>
                    <Step label={ t('Metadata') } component={ Step1Metadata } />
                    <Step label={ t('Versions') } component={ Step2Versions } />
                    <Step label={ t('Choose codes') } component={ Step3ChooseCodes }/>
                    <Step label={ t('Reorder codes') } component={ Step4Reorder } />
                    <Step label={ t('Review and publish') } component={ Step5Review } />
                </Navigation>
            </div>
        </div>
    );
}


