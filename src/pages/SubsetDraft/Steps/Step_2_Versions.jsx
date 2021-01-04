import React from 'react';
// TODO: make styles local
import 'components/Forms/form.css';
import { useTranslation } from 'react-i18next';
import {
    SwitcherContextual,
    VersionPeriodForm,
    VersionRationaleForm,
    BriefContextual
} from 'views';

export const Step2Versions = () => {
    const { t } = useTranslation();
    return (
        <>
            <h2>{ t('Versions') }</h2>
            <BriefContextual metadata currentVersion />
            <SwitcherContextual />
            <VersionPeriodForm />
            <VersionRationaleForm />
        </>
    );
};

