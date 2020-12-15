import React from 'react';
import { useTranslation } from 'react-i18next';
import { BriefContextual } from '../../../components/Subset';
import { DescriptionForm, NameForm, SectionForm,
    ClassificationFamilyForm } from '../../../components/SubsetMetadata';

export const Step1Metadata = () => {
    const { t } = useTranslation();

    return (
        <>
            <h2>{ t('Metadata') }</h2>
            <BriefContextual editable />
            <NameForm />
            <SectionForm />
            <ClassificationFamilyForm />
            <DescriptionForm />
        </>
    );
};

