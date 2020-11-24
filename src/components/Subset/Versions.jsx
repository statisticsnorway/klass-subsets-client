import React from 'react';
import { useTranslation } from 'react-i18next';


export const Versions = ({ versions = []}) => {
    const { t } = useTranslation();

    return (
        <>
            <h2>{ t('Versions') } </h2>
            {/*
            "administrativeStatus": "DRAFT",
            "createdDate": "2020-11-23",
            "lastModified": "2020-11-23T12:35:34Z",
            "seriesId": "2",
            "validFrom": "2020-10-19",
            "validUntil": "2021-10-19",
            "version": "750105e2-586b-4682-abbe-d462d29a9750",
            "statisticalUnits": [
                "Region"
            ],
            "codes": [],
            "versionRationale": [
            */}
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

