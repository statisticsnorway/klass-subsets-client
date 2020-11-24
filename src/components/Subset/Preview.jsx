import React, { useState } from 'react';
import { Tabs, Divider } from '@statisticsnorway/ssb-component-library';
import { Brief } from './Brief';
import { Id } from './Id';
import { JsonView } from './JsonView';
import {HtmlView} from "./HtmlView";
import {Title} from "./Title";

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
    const [ activeCodeTab, changeCodeTab ] = useState(tabCode[0].path);
    const tabCodeClicked = e => changeCodeTab(e);

    // TODO: show subset in other languages - switch button for language? smart language choice?
    // TODO: show versions?

    return (
        <>
            <Title
                edit={ edit }
                name={ subset.name?.find(desc => desc.languageCode === 'nb')?.languageText }
            />
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
                { activeCodeTab === 'json' &&
                    <JsonView data={ subset.payload || subset } />
                }
                { activeCodeTab === 'html' &&
                    <HtmlView
                        description={ subset.description }
                        owningSection={ subset.owningSection }
                        classificationFamily={ subset.classificationFamily }
                        versions={ subset.versions }
                    />
                }
            </div>
        </>
    );
};
