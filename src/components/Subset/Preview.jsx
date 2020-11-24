import React, { useState } from 'react';
import { Tabs, Divider } from '@statisticsnorway/ssb-component-library';
import { Brief } from './Brief';
import { Id } from './Id';
import { useTranslation } from 'react-i18next';
import { Metadata } from './Metadata';
import { Versions } from './Versions';


const tabCode = [
    {
        title: 'Metadata',
        path: 'metadata',
    }, {
        title: 'Versions',
        path: 'versions',
    }, {
        title: 'Codes',
        path: 'codes',
    }
];

export const Preview = ({ subset, edit }) => {
    const { t } = useTranslation();

    const [ activeCodeTab, changeCodeTab ] = useState(tabCode[0].path);
    const tabCodeClicked = e => changeCodeTab(e);

    // TODO: show subset in other languages - switch button for language? smart language choice?
    // TODO: show versions?

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
            <div>
                <Tabs activeOnInit={ tabCode[0].path }
                      items={ tabCode }
                      onClick={ tabCodeClicked } />
                <Divider dark />
                { activeCodeTab === 'metadata' &&
                    <Metadata
                        edit={ edit }
                        subset={ subset }
                    />
                }
                { activeCodeTab === 'versions' &&
                    <Versions
                        versions={ subset.versions } />
                }
                { activeCodeTab === 'codes' &&
                    <h2>Codes</h2>
                }
            </div>
        </>
    );
};
