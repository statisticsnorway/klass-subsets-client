import React from 'react';
import { useTranslation } from 'react-i18next';
import { BriefContextual,
    DescriptionForm,
    NameForm,
    SectionForm,
    ClassificationFamilyForm
} from 'views';

export const Step1Metadata = () => {
    const { t } = useTranslation();

    return (
        <>
            <h2>{ t('Metadata') }</h2>
            <BriefContextual metadata editable />
            <NameForm />
            <SectionForm />
            <ClassificationFamilyForm />
            <DescriptionForm />
        </>
    );
};

