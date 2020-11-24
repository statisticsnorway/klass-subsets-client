import React from 'react';
import { Code } from '../Code';
import { useTranslation } from 'react-i18next';
import { Metadata } from './Metadata';

export const HtmlView = ({ subset = {
    description: '-',
    owningSection: '-',
    classificationFamily: '-'
}}) => {
    const { t } = useTranslation();

    return (
        <>
            <Metadata
                description={
                    subset.description?.find(desc => desc.languageCode === 'nb')?.languageText
                }
                owningSection={ subset.owningSection }
                classificationFamily={ subset.classificationFamil }
            />

            <h3>{ t('Codes') }: </h3>
            {/* FIXME: check the validity period is set correctly*/}
            {/*{ subset.codes
                .sort((a,b) => (a.rank - b.rank))
                .map((code, i) => (
                    <Code key={i}
                          origin={{
                              ...code,
                              validFromInRequestedRange: subset.versionValidFrom?.substr(0, 10),
                              validToInRequestedRange: subset.versionValidUntil?.substr(0, 10) || ''
                          }}
                    />))
            }*/}
        </>
    );
};

