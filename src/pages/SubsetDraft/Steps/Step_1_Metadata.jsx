import React from 'react';
import { useTranslation } from 'react-i18next';
import { BriefContextual } from '../../../components/Subset';
import { DescriptionForm, NameForm, SectionForm,
    SubjectForm, ValidityPeriodForm } from '../../../components/SubsetMetadata';

export const Step1Metadata = () => {
    const { t } = useTranslation();

    return (
        <>
            <h3>{ t('Metadata') }</h3>
            <BriefContextual editable />
            <NameForm />
            <ValidityPeriodForm />
            <SectionForm />
            <SubjectForm />
            <DescriptionForm />
        </>
    );
};
