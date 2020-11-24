import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Divider, Tabs } from "@statisticsnorway/ssb-component-library";
import { JsonView } from './JsonView';
import { MetadataHtmlView } from './MetadataHtmlView';
import { EditButton } from '../EditButton';
import { DownloadButton } from '../DownloadButton';
import { orderByValidFromAsc } from '../../utils/arrays';

const tabCode = [
    {
        title: 'HTML',
        path: 'html',
    }, {
        title: 'JSON',
        path: 'json',
    },
];

export const Metadata = ({
                             edit = () => {},
                             subset = {},
                         }) => {
    const { t } = useTranslation();
    const [ activeCodeTab, changeCodeTab ] = useState(tabCode[0].path);
    const tabCodeClicked = e => changeCodeTab(e);

    return (
        <>
            <h2>{ t('Metadata') }
                <DownloadButton title={ t('Download') }/>

                { edit && <EditButton
                    title={ t('Edit metadata') }
                    clickHandler={ edit }
                />}
            </h2>
            <p>{ t('Metadata info') }.</p>
            <p>{ t('Subset validity period info') }.</p>
            <p>{ t('Owning section info') }.</p>
            <div>
                <Tabs activeOnInit={ tabCode[0].path }
                      items={ tabCode }
                      onClick={ tabCodeClicked } />
                <Divider light />
                { activeCodeTab === 'json' &&
                    <JsonView data={ subset.payload || subset } />
                }
                { activeCodeTab === 'html' &&
                    <MetadataHtmlView
                        description={ subset.description }
                        owningSection={ subset.owningSection }
                        classificationFamily={ subset.classificationFamily }
                        validFrom={ subset.versions?.length > 0
                            && orderByValidFromAsc(subset.versions)[0].validFrom
                        }
                        validUntil={ subset.versions?.length > 0
                            && orderByValidFromAsc(subset.versions)[subset.versions.length - 1].validUntil
                        }
                    />
                }
            </div>
    </>);
};

