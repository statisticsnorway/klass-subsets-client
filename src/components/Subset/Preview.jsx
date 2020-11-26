import React, { useState } from 'react';
import { Brief, Id, Metadata, Versions } from '../Subset';
import { useTranslation } from 'react-i18next';
import { Tab, Tabs } from '../Tabs';
import { GlobeButton } from '../GlobeButton';
import { languages as defaultLanguages } from '../../defaults';
import { Codes } from '../Code';

export const Preview = ({ subset, edit }) => {
    const { t } = useTranslation();
    const [ langIndex, setLangIndex ] = useState(0);
    const languages = defaultLanguages.filter(l => l.draft);

    return (
        <>
            <h1>{ subset.name?.find(desc =>
                    desc.languageCode === languages[langIndex].languageCode)?.languageText
                ||
                <span style={{ color: 'red'}}>{
                    t('No name in this language') }: { languages[langIndex].full }</span> }
                <GlobeButton
                    title={ t('Toggle language')}
                    clickHandler={ () => setLangIndex( (langIndex + 1) % languages.length)}
                />
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
                    <Versions edit={ edit }  data={ subset.versions } />
                </Tab>
                <Tab title='Codes' path='codes'>
                    <Codes edit={ edit }  data={ subset.versions }/>
                </Tab>
            </Tabs>
        </>
    );
};
