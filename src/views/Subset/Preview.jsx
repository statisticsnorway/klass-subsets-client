import React, { useContext } from 'react';
import { BriefMetadata, Metadata, Versions, SearchCodes } from 'views';
import { Tab, Tabs, Title } from 'components';
import { Subset } from 'models';
import { useHistory } from 'react-router-dom';
import { AppContext } from 'controllers';

export const Preview = ({ data,
                          edit = false,
                          save = false,
                          publish = false
}) => {
    const subset = new Subset(data);
    let history = useHistory();

    const editMetadata = () => history.push(`/create?step=Metadata&subsetId=${ data?.id }`);
    const editVersion = (versionId) => history.push(`/create?step=Versions&subsetId=${ data?.id }&versionId=${ versionId }`);
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
                <Tab title='Versions' path='versions'>
                    <Versions edit={ edit ? editVersion : null }
                              save={ save ? saveVersion : null }
                              publish={ publish ? publishVersion : null }
                              data={ data?.versions } />
                </Tab>
                <Tab title='Metadata' path='metadata'>
                    <Metadata edit={ edit ? editMetadata : null }
                              save={ save ? saveMetadata : null }
                              subset={ data }/>
                </Tab>
                {/*<Tab title='Codes' path='codes'>
                    <Codes edit={ edit || null } data={ data?.versions }/>
                </Tab>*/}
            </Tabs>
        </>
    );
};
