import React, { useContext, useState } from 'react';
import { Tabs, Divider, Link as SsbLink} from '@statisticsnorway/ssb-component-library';
import { useTranslation } from 'react-i18next';
import { Code } from '../Code';
import { eu } from '../../utils/strings';
import { Brief, Id } from './SubsetBrief';
import { useHistory } from 'react-router-dom';
import { AppContext } from '../../controllers/context';
import { Edit } from 'react-feather';

const tabCode = [
    {
        title: 'Html',
        path: 'html',
    }, {
        title: 'JSON',
        path: 'json',
    },
];

export const SubsetPreview = ({ subset, edit }) => {
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

export const SubsetBanner = ({ subsetData }) => {
    const { t } = useTranslation();
    let history = useHistory();
    const { subset } = useContext(AppContext);


    // FIXME: translate placeholders
    // TODO: smart language choice
    return (
        <div style={{margin: '50px 0'}}>
            <SsbLink href={ `/subsets/${subsetData?.id}` }
                     linkType='profiled'>
                { subsetData?.name?.find(name => name.languageCode === 'nb')?.languageText
                    || t('No name')
                }
            </SsbLink>
            <Edit style={{
                color: '#ED5935',
                margin: '0 10px',
                cursor: 'pointer'
            }}
                onClick={() => {
                    subset.dispatch({ action: 'edit', data: subsetData });
                    history.push('/create');
            }}/>
            <p style={{fontSize: 'calc(10px + 0.3vmin)'}}>
                <Brief
                    id={ <Id>{ subsetData?.id || '-' }</Id> }
                    versionValidFrom={ subsetData?.versionValidFrom }
                    lastUpdatedDate={ subsetData?.lastUpdatedDate }
                    status={ t(subsetData?.administrativeStatus) }
                />
            </p>
            <p style={{ fontSize: 'calc(10px + 0.8vmin)', margin: '-5px 0' }}>
                { subsetData?.description?.find(
                    desc => desc.languageCode === 'nb')?.languageText
                    || t('No description')
                }
            </p>
        </div>
    );
};

export const Subsets = ({items}) => {
    return (
        <>{items?.length > 0 &&
            items.map((subset, i) => (
                <SubsetBanner key={i}
                              subsetData={subset} /> ))}
        </>
    );
};
