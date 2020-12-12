import React from 'react';
import { Brief, Metadata, Versions } from '../Subset';
import { Tab, Tabs } from '../Tabs';
import { Codes } from '../Code';
import { Subset } from '../../controllers/Subset.prototype';
import { Title } from '../Title';

export const Preview = ({ data, edit, save = false }) => {
    const subset = new Subset(data);

    return (
        <>
            <Title translates={ subset?.name } tag='h1' save={ save } />
            <Brief
                id={{ props: {id: subset?.id} }}
                lastModified={ subset?.lastModified }
                created={ subset?.createdDate }
                published={ subset?.publishedVersions?.length }
                drafts={ subset?.drafts?.length }
                validFrom={ subset?.validFrom }
                validUntil={ subset?.validUntil }
                metadataToBeSaved={ subset?.metadataToBeSaved }
            />
            <Tabs dark>
                <Tab title='Metadata' path='metadata'>
                    <Metadata edit={ edit } save={ save && subset?.metadataToBeSaved } subset={ data }/>
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
