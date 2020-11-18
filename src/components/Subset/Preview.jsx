import React, { useState } from 'react';
import { Tabs, Divider } from '@statisticsnorway/ssb-component-library';
import { useTranslation } from 'react-i18next';
import { Code } from '../Code';
import { eu } from '../../utils/strings';
import { Brief } from './Brief';
import { Id } from './Id';
import { Edit } from 'react-feather';

const tabCode = [
    {
        title: 'HTML',
        path: 'html',
    }, {
        title: 'JSON',
        path: 'json',
    },
];

export const Preview = ({ subset, edit }) => {
    const { t } = useTranslation();
    const [ activeCodeTab, changeCodeTab ] = useState(tabCode[0].path);
    const tabCodeClicked = e => changeCodeTab(e);

    // TODO: show subset in other languages - switch button for language? smart language choice?
    // TODO: show versions?

    return (
        <>
            <h2>{ subset.name?.find(name => name.languageCode === 'nb')?.languageText
                || t('No name') }
                {
                    edit &&
                    <Edit
                        style={{
                            color: '#ED5935',
                            margin: '0 10px',
                            cursor: 'pointer'
                        }}
                        onClick={edit}/>
                }
            </h2>
            <Brief
                id={ <Id>{ subset.id || '-' }</Id> }
                versionValidFrom={ subset?.versionValidFrom }
                lastUpdatedDate={ subset?.lastUpdatedDate }
                status={ subset?.administrativeStatus }
            />
            <div>
                <Tabs activeOnInit={ tabCode[0].path } items={ tabCode } onClick={ tabCodeClicked } />
                <Divider light />
                { activeCodeTab === 'json'
                    && <pre>
                        { JSON.stringify(subset.payload || subset, null, 4)}
                    </pre> }
                { activeCodeTab === 'html'
                    && (
                        <>
                            <p><strong>{ t('Subsets validity period') }</strong>
                            { subset?.validFrom || subset?.validUntil
                                ? `: ${ t('from') } ${ eu(subset?.validFrom) || '...' } ${
                                    t('to')} ${ eu(subset?.validUntil) || '...' }`
                                : `. ${ t('Period is not set') }.`
                            }
                            </p>
                            <p><strong>{ t('Versions validity period') }</strong>
                            { subset?.versionValidFrom || subset?.versionValidUntil
                                ? `: ${ t('from') } ${ eu(subset?.versionValidFrom) || '...' } ${
                                    t('to')} ${ eu(subset?.versionValidUntil) || '...' }`
                                : `. ${ t('Period is not set') }.`
                            }
                            </p>

                            <p>{ subset.description?.find(desc => desc.languageCode === 'nb')?.languageText
                        || t('No description') }
                            </p>

                            <p><strong>{ t('Owner') }:</strong> { subset.createdBy || '-' }</p>

                            <p><strong>{ t('Subject') }:</strong> { subset.subject || '-' }</p>

                            <p><strong>{ t('Version') }:</strong> { subset.version || '-' }</p>

                            <h3>{ t('Codes') }: </h3>
                        {/* FIXME: check the validity period is set correctly*/}
                        { subset.codes
                            .sort((a,b) => (a.rank - b.rank))
                            .map((code, i) => (
                            <Code key={i}
                            origin={{
                            ...code,
                            validFromInRequestedRange: subset.versionValidFrom?.substr(0, 10),
                            validToInRequestedRange: subset.versionValidUntil?.substr(0, 10) || ''
                        }}
                            />))
                        }
                </>)
                }
            </div>
        </>
    );
};
