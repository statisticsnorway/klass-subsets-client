import React from 'react';
import { Brief, Metadata, Versions } from '../Subset';
import { Tab, Tabs } from '../Tabs';
import { Codes } from '../Code';
import { Subset } from '../../controllers/Subset.prototype';
import { Title } from '../Title';

export const Preview = ({ data, edit, save = false }) => {
    const {subset: {
        name,
        id,
        lastModified,
        createdDate,
        publishedVersions,
        drafts,
        validFrom,
        validUntil,
        metadataToBeSaved
    }} = new Subset(data);

    return (
        <>
            <Title translates={ name } tag='h1' save={ save } />
            <Brief
                id={{ props: {id} }}
                lastModified={ lastModified }
                created={ createdDate }
                published={ publishedVersions?.length }
                drafts={ drafts?.length }
                validFrom={ validFrom }
                validUntil={ validUntil }
                metadataToBeSaved={ metadataToBeSaved }
            />
            <Tabs dark>
                <Tab title='Metadata' path='metadata'>
                    <Metadata edit={ edit } save={ save && metadataToBeSaved } subset={ data }/>
                </Tab>
                <Tab title='Versions' path='versions'>
                    <Versions edit={ edit } save={ save } data={ data?.versions } />
                </Tab>
                <Tab title='Codes' path='codes'>
                    <Codes edit={ edit } data={ data?.versions }/>
                </Tab>
            </Tabs>
        </>
    );
};
