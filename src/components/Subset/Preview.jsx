import React, {useContext} from 'react';
import { Brief, Metadata, Versions } from 'components/Subset';
import { Tab, Tabs, Title } from 'components';
import { Codes } from '../Code';
import { Subset } from 'controllers/subset/Subset.prototype';
import { useHistory } from 'react-router-dom';
import { AppContext } from 'controllers';

export const Preview = ({ data,
                          edit = false,
                          save = false,
                          publish = false
}) => {
    const subset = new Subset(data);
    let history = useHistory();
    const { subset: { dispatch } } = useContext(AppContext);
    const editSubset = () => {
        dispatch({ action: 'edit', data });
        history.push('/create');
    }
    const saveMetadata = () => history.push(`/auth/save?metadata=true`);
    const saveVersion = () => history.push(`/auth/save?version=true`);
    const publishVersion = () => history.push(`/auth/save?version=true&publish=true`);

    return (
        <>
            <Title translates={ subset?.name } tag='h1' />
            <Brief
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
                    <Versions edit={ edit ? editSubset : null }
                              save={ save ? saveVersion : null }
                              publish={ publish ? publishVersion : null }
                              data={ data?.versions } />
                </Tab>
                <Tab title='Metadata' path='metadata'>
                    <Metadata edit={ edit ? editSubset : null }
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
