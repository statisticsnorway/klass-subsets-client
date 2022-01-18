import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { MetadataHtmlView } from './HtmlView';
import { Tabs, Tab, Title, Help, JsonView } from 'components';
import { Divider} from '@statisticsnorway/ssb-component-library';
import { BriefMetadata } from './BriefMetadata';
import { useQuery } from 'utils';

export const Metadata = ({
                             edit = () => {},
                             save = () => {},
                             subset = {}
                         }) => {
    const { t } = useTranslation();
    const [ showHelp, setShowHelp ] = useState(false);
    const [ showInfo, setShowInfo ] = useState(false);
    let query = useQuery();

    return (
        <>
            <Title text='Metadata'
                   edit={ edit }
                   save={ save ? () => save(query.toString()) : null }
                   info={ () => setShowInfo(prev => !prev)}
                   help={ () => setShowHelp(prev => !prev)}
            />

            <Help visible={ showHelp }>
                <p>{ t('Metadata info') }.</p>
                <p>{ t('Subset validity period info') }.</p>
                <p>{ t('Owning section info') }.</p>
            </Help>

            <BriefMetadata
                id={ subset?.id }
                lastModified={ subset?.lastModified }
                created={ subset?.createdDate }
                published={ subset?.publishedVersions?.length }
                drafts={ subset?.drafts?.length }
                validFrom={ subset?.validFrom }
                validUntil={ subset?.validUntil }
                metadataToBeSaved={ subset?.metadataToBeSaved }
            />

            <Title translates={ subset?.description } tag='p' />

            { showInfo &&
                <Tabs light>
                    <Tab title='HTML' path='html'>
                        <MetadataHtmlView subset={ subset }/>
                    </Tab>
                    <Tab title='JSON' path='json'>
                        <JsonView data={ subset.metadataPayload || subset }/>
                    </Tab>
                </Tabs>
            }
            <Divider dark />
        </>);
};

