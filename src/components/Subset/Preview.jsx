import React from 'react';
import { Brief, Metadata, Versions } from '../Subset';
import { Tab, Tabs } from '../Tabs';
import { Codes } from '../Code';
import { Subset } from '../../controllers/subset/Subset.prototype';
import { Title } from '../Title';
import { useHistory } from 'react-router-dom';

export const Preview = ({ data, edit = null, save = false }) => {
    const subset = new Subset(data);
    let history = useHistory();

    const saveMetadata = () => history.push(`/auth/save?metadata=true`);
    const saveVersion = () => history.push(`/auth/save?version=true`);
    const publishVersion = () => history.push(`/auth/save?version=true&publish=true`);
    return (
        <>
            <Title translates={ subset?.name } tag='h1' />
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
                    <Metadata edit={ edit || null } save={ save ? saveMetadata : null } subset={ data }/>
                </Tab>
                <Tab title='Versions' path='versions'>
                    <Versions edit={ edit || null } save={ save ? saveVersion : null } data={ data?.versions } />
                </Tab>
                {/*<Tab title='Codes' path='codes'>
                    <Codes edit={ edit || null } data={ data?.versions }/>
                </Tab>*/}
            </Tabs>
        </>
    );
};
