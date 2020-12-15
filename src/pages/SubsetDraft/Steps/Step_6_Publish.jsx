import React, { useEffect, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { Dialog } from '@statisticsnorway/ssb-component-library';
import { usePost, usePut } from '../../../controllers/subsets-service';
import { useHistory } from 'react-router-dom';
import { AppContext } from '../../../controllers/context';
import { CheckCircle } from 'react-feather';
import { useQuery } from '../../../utils';

export const Step6Publish = () => {
    const { subset: { draft: {
        id,
        versionId,
        publishVersionPayload,
        metadataPayload,
        versionPayload,
        isNew
    }, dispatch} } = useContext(AppContext);
    const { t } = useTranslation();
    let history = useHistory();
    let query = useQuery();

    const [ post, setPOSTPayload, posting, errorPost ] = usePost();
    const [ update, setPUTPayload, updating, errorUpdate ] = usePut(id);

    useEffect(() => {
        const payload = query.get('publish')
            ? publishVersionPayload
            : query.get('metadata')
                ? metadataPayload
                : versionPayload;

        isNew()
            ? setPOSTPayload(payload)
            : setPUTPayload(payload);
    }, [])

    useEffect(() => {
        if (post || update) {
            setTimeout(() => {
                history.push(`/subsets/${id}/versions/${versionId}`);
                dispatch({action: 'reset'});
            }, 2000);
        }
    }, [ dispatch, id, versionId, history, post, update ])

    return (
        <div style={{ minHeight: '350px', display: 'flex', justifyContent: 'center'}}>
            { (!errorPost && !errorUpdate && !post && !update) &&
                <p>{ t('Sending data to the server')}...</p>
            }
            { (errorPost || errorUpdate) &&
            <div style={{
                width: '50%',
                height: '30%',
                border: 'none'
            }}>
                <Dialog type='warning' title={ t('Update failed', {
                    id,
                    versionId
                })
                }>
                    {`${errorPost || errorUpdate}`}
                </Dialog>
            </div>
            }
            { (post || update) &&
            <p style={{color: 'green'}}>
                <CheckCircle color='green'/> {t('Success')}. {t('Data is sent')}.
            </p>
            }
            <button onClick={ () => history.push(`/create?step=Metadata`) }>
                { t('Back to metadata') }
            </button>
        </div>
    );
};
