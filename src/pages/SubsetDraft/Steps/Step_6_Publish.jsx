import React, { useEffect, useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Dialog } from '@statisticsnorway/ssb-component-library';
import { usePost, usePut, useAuthPut } from 'controllers/subsets-api';
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

    const [ post, setPOSTPayload, errorPost ] = usePost();
    const [ update, setPUTPayload, errorUpdate ] = usePut(id);
    const [ postVersion, setPOSTPayloadVersion, errorPostVersion ] = usePost(`${id}/versions`);
    const [ updateVersion, setPUTPayloadVersion, errorUpdateVersion ] = usePut(`${id}/versions/${ versionId }`);
    const [ updateVersionAuth, setAuthPUTPayloadVersion, errorUpdateVersionAuth ] = useAuthPut(`${id}/versions/${ versionId }`);

    useEffect(() => {
        if (!post && !update) {
            if ((query.get('metadata') || query.get('version')) && isNew() && !query.get('auth')) {
                console.debug('New subset ', isNew());
                setPOSTPayload(metadataPayload);
            }
            if (query.get('metadata') && !isNew() && !query.get('auth')) {
                console.debug('Save metadata ', !isNew());
                setPUTPayload(metadataPayload);
            }
            if (query.get('version') && isNewVersion() && !isNew() && !query.get('auth')) {
                console.debug('New version ', isNewVersion());
                setPOSTPayloadVersion(query.get('publish')
                    ? publishVersionPayload
                    : versionPayload
                );
            }
            if (query.get('version') && !isNewVersion() && !query.get('auth')) {
                console.debug('Update version ', !isNewVersion());
                setPUTPayloadVersion(query.get('publish')
                    ? publishVersionPayload
                    : versionPayload
                );
            }
            // FIXME: remove (experimental: test auth endpoint on the backend)
            if (query.get('version') && query.get('auth') && !isNewVersion()) {
                console.debug('Update version via auth', !isNewVersion());
                setAuthPUTPayloadVersion(versionPayload);
            }
        } else {
            if (query.get('version') && isNewVersion() && !query.get('auth')) {
                console.debug('New version when metadata is saved', isNewVersion());
                setPOSTPayloadVersion(query.get('publish')
                    ? publishVersionPayload
                    : versionPayload
                );
            }
        }

    }, [ post, update ]);

    useEffect(() => {
        if (post || update) {
            dispatch({
                action: 'metadata_sync',
                data: post || update
            });
        }
    }, [ dispatch, post, update ]);

    useEffect(() => {
        if (postVersion || updateVersion || updateVersionAuth) {
            dispatch({
                action: 'version_sync',
                data: {
                    update: postVersion || updateVersion,
                    tempId: versionId
                }
            });
        }
    }, [ dispatch, postVersion, updateVersion, updateVersionAuth ]);

    return (
        <div style={{ minHeight: '350px', textAlign: 'center', margin: 'auto', width: '100%' }}>

            { ( !errorPost && !errorUpdate && !post && !update && query.get('metadata')) &&
                <p>{ t('Sending metadata to the server') }...</p>
            }
            { ( !errorPostVersion && !errorUpdateVersion && !postVersion && !updateVersion && query.get('version')) && !updateVersionAuth && !errorUpdateVersionAuth &&
                <p>{ t('Sending version to the server') }...</p>
            }
            { (errorPost || errorUpdate || errorPostVersion || errorUpdateVersion || errorUpdateVersionAuth) &&
            <div style={{
                width: '100%',
                height: '30%',
                border: 'none',
                margin: 'auto',
            }}>
                <Dialog type='warning'
                        title='Update failed'
                          //  {t('Update failed', {id, version: versionId})}
                >
                    {`Subset's ID: ${ id }. `}
                    {`Version's ID: ${ versionId }. `}
                    {`Error message: ${errorPost || errorUpdate || errorPostVersion || errorUpdateVersion || errorUpdateVersionAuth}`}
                </Dialog>
            </div>
            }
            { (post || update) &&
                <p style={{ color: 'green' }}>
                    <CheckCircle color='green'/> { t('Success') }. { t('Metadata is sent') }.
                </p>
            }
            { (postVersion || updateVersion) &&
                <p style={{ color: 'green' }}>
                    <CheckCircle color='green'/> { t('Success') }. { t('Version is sent') }.
                </p>
            }
            { (updateVersionAuth) &&
            <p style={{ color: 'green' }}>
                <CheckCircle color='green'/> { t('Success') }. { t('Version is sent via /auth/') }.
            </p>
            }
            <div style={{ display: 'flex', justifyContent: 'center' }}>
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
        </div>
    );
};
