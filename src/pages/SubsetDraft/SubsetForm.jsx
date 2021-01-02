import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import './container.css';
import { Navigation, Step } from 'components';
import {
    Step1Metadata,
    Step2Versions,
    Step3ChooseCodes,
    Step4Reorder,
    Step5Review } from './Steps';

export const SubsetForm = () => {
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
                    <Step label='Metadata' component={ Step1Metadata } />
                    <Step label='Versions' component={ Step2Versions } />
                    <Step label='Choose codes' component={ Step3ChooseCodes }/>
                    <Step label='Reorder codes' component={ Step4Reorder } />
                    <Step label='Review and publish' component={ Step5Review } />
                </Navigation>
            </div>
        </div>
    );
}


