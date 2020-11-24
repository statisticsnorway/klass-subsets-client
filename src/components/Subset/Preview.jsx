import React, { useState } from 'react';
import { Tabs, Divider } from '@statisticsnorway/ssb-component-library';
import { useTranslation } from 'react-i18next';
import { Brief } from './Brief';
import { Id } from './Id';
import { Edit } from 'react-feather';
import { JsonView } from './JsonView';
import {HtmlView} from "./HtmlView";

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
            <h1>{ subset.name?.find(name => name.languageCode === 'nb')?.languageText
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
                <Divider light />
                { activeCodeTab === 'json' && <JsonView data={ subset.payload || subset } /> }
                { activeCodeTab === 'html' && <HtmlView subset={ subset } /> }
            </div>
        </>
    );
};
