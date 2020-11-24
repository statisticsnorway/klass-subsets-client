import React from 'react';
import { useTranslation } from 'react-i18next';


export const Versions = ({ versions = []}) => {
    const { t } = useTranslation();

    return (
        <>
            <h2>{ t('Versions') } </h2>
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

