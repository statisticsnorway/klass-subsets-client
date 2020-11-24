import React from 'react';
import { Metadata } from './Metadata';
import { Versions } from './Versions';

export const HtmlView = ({
    description = [],
    owningSection = '-',
    classificationFamily = '-',
    versions = []
}) => {

    return (
        <>
            <Metadata
                owningSection={ owningSection }
                classificationFamily={ classificationFamily }
                description={
                    description?.find(desc => desc.languageCode === 'nb')?.languageText
                }
            />

            <Versions
                versions={ versions } />
        </>
    );
};

