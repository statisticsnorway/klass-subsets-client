import React, { useEffect, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { Dialog } from '@statisticsnorway/ssb-component-library';
import { usePost, usePut } from 'controllers/subsets-api';
import { useHistory } from 'react-router-dom';
import { AppContext } from 'controllers';
import { CheckCircle } from 'react-feather';
import { useQuery } from 'utils';

export const Step6Publish = () => {
    const { subset: { draft: {
        id,
        versionId,
        publishVersionPayload,
        metadataPayload,
        versionPayload,
        isNew,
        isNewVersion
    }, dispatch} } = useContext(AppContext);
    const { t } = useTranslation();
    let history = useHistory();
    let query = useQuery();

    const [ post, setPOSTPayload, posting, errorPost ] = usePost();
    const [ update, setPUTPayload, updating, errorUpdate ] = usePut(id);
    const [ postVersion, setPOSTPayloadVersion, postingVersion, errorPostVersion ] = usePost(`${id}/versions`);
    const [ updateVersion, setPUTPayloadVersion, updatingVersion, errorUpdateVersion ] = usePut(`${id}/versions/${ versionId }`);

    useEffect(() => {
        const payload = query.get('publish')
            ? publishVersionPayload
            : query.get('metadata')
                ? metadataPayload
                : versionPayload;

        if (isNew() && query.get('metadata')) {
            console.debug('New subset ', isNew());
            setPOSTPayload(payload);
        }
        if (!isNew() && query.get('metadata')) {
            console.debug('Save metadata ', isNew());
            setPUTPayload(payload);
        }
        if (isNewVersion() && query.get('version')) {
            console.debug('New version ', isNewVersion());
            setPOSTPayloadVersion(payload);
        }
        if (!isNewVersion() && query.get('version')) {
            console.debug('Update version ', isNewVersion());
            setPUTPayloadVersion(payload);
        }

    }, []);

    useEffect(() => {
        if (post || update) {
            dispatch({
                action: 'metadata_sync',
                data: post || update
            });
/*            setTimeout(() => {
                history.push(`/editor?step=Review%20and%20publish&subsetId=${ id }`);
            }, 2000);*/
        }
    }, [ dispatch, post, update ]);

    useEffect(() => {
        if (postVersion || updateVersion) {
            dispatch({
                action: 'version_sync',
                data: {
                    update: postVersion || updateVersion,
                    tempId: versionId
                }
            });
/*            setTimeout(() => {
                history.push(`/editor?step=Review%20and%20publish&subsetId=${ id }&versionId=${ postVersion.versionId }`);
            }, 2000);*/
        }
    }, [ dispatch, id, postVersion, updateVersion ]);

    return (
        <div style={{ minHeight: '350px', display: 'flex', justifyContent: 'center'}}>
            { (!errorPost && !errorUpdate && !post && !update
                && !errorPostVersion && !errorUpdateVersion && !postVersion && !updateVersion
            ) &&
                <p>{ t('Sending data to the server') }...</p>
            }
            { (errorPost || errorUpdate || errorPostVersion || errorUpdateVersion) &&
            <div style={{
                width: '50%',
                height: '30%',
                border: 'none'
            }}>
                <Dialog type='warning'
                        title={ t('Update failed', {
                                    id,
                                    version: versionId
                                })
                }>
                    {`${errorPost || errorUpdate || errorPostVersion || errorUpdateVersion}`}
                </Dialog>
            </div>
            }
            { (post || update || postVersion || updateVersion) &&
            <p style={{ color: 'green' }}>
                <CheckCircle color='green'/> { t('Success') }. { t('Data is sent') }.
            </p>
            }
            <button onClick={ () => history.push(`/editor?step=Metadata`) }>
                { t('Back to metadata') }
            </button>
            <button onClick={ () => history.push(`/editor?step=Versions`) }>
                { t('Back to versions') }
            </button>
            <button onClick={ () => history.push(`/editor?step=Review%20and%20publish`) }>
                { t('Back to review') }
            </button>
            <button onClick={ () => history.push(`/subsets/${id}`) }>
                { t('Out of edition mode') }
            </button>
        </div>
    );
};
