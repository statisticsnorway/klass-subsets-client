import React from 'react';
import { BriefMetadata, Metadata, Versions, SearchCodes } from 'views';
import { Tab, Tabs, Title } from 'components';
import { Subset } from 'models';
import { useHistory } from 'react-router-dom';
import {useTranslation} from "react-i18next";

export const Preview = ({ data,
                          edit = false,
                          save = false,
                          publish = false
}) => {
    const subset = new Subset(data);
    let history = useHistory();
    const { t } = useTranslation();

    // TODO: use simple Links instead of buttons
    const editMetadata = () => history.push(`/editor?step=Metadata&subsetId=${ data?.id }`);
    const editVersion = (versionId) => history.push(`/editor?step=Versions&subsetId=${ data?.id }&versionId=${ versionId }`);
    const saveMetadata = () => history.push(`/auth/save?metadata=true`);
    const saveVersion = () => history.push(`/auth/save?version=true`);
    const publishVersion = () => history.push(`/auth/save?version=true&publish=true`);

    return (
        <>
            <Title translates={ subset?.name } tag='h1' />
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
            <Tabs dark>
                <Tab title={ t('Versions') } path='versions'>
                    <Versions edit={ edit ? editVersion : null }
                              save={ save ? saveVersion : null }
                              publish={ publish ? publishVersion : null }
                              data={ data?.versions } />
                </Tab>
                <Tab title={ t('Metadata') } path='metadata'>
                    <Metadata edit={ edit ? editMetadata : null }
                              save={ save ? saveMetadata : null }
                              subset={ data }/>
                </Tab>
                {/*<Tab title='{ t(Codes') } path='codes'>
                    <SearchCodes edit={ edit || null } data={ data?.versions }/>
                </Tab>*/}
            </Tabs>
        </>
    );
};
