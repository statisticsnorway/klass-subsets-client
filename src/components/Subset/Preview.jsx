import React from 'react';
import { Brief } from './Brief';
import { Id } from './Id';
import { useTranslation } from 'react-i18next';
import { Metadata } from './Metadata';
import { Versions } from './Versions';
import { Tab, Tabs } from '../Tabs';

export const Preview = ({ subset, edit }) => {
    const { t } = useTranslation();

    return (
        <>
            <h1>{ subset.name?.find(desc => desc.languageCode === 'nb')?.languageText
                || t('No name') }
            </h1>
            <Brief
                id={ <Id>{ subset.id || '-' }</Id> }
                versionValidFrom={ subset?.versionValidFrom }
                lastModified={ subset?.lastModified }
                status={ subset?.administrativeStatus }
            />
            <Tabs dark>
                <Tab title='Metadata' path='metadata'>
                    <Metadata edit={ edit } subset={ subset }/>
                </Tab>
                <Tab title='Versions' path='versions'>
                    <Versions versions={ subset.versions } />
                </Tab>
                <Tab title='Codes' path='codes'>
                    <h2>Codes</h2>
                </Tab>
            </Tabs>
        </>
    );
};
