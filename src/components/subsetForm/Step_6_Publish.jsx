import React, { useEffect, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { Dialog, Paragraph } from '@statisticsnorway/ssb-component-library';
import { usePost, usePut } from '../../controllers/subsets-service';
import { useHistory } from 'react-router-dom';
import { AppContext } from '../../controllers/context';
import { CheckCircle } from 'react-feather';
import { useQuery } from "../../utils/useQuery";

export const Step6Publish = () => {
    const { subset: { draft, dispatch } } = useContext(AppContext);
    const { t } = useTranslation();
    let history = useHistory();
    let query = useQuery();

    const [ post, setPOSTPayload, posting, errorPost ] = usePost();
    const [ update, setPUTPayload, updating, errorUpdate ] = usePut(draft.id);

    useEffect(() => {
        const payload = query.get('publish')
            ? draft.publishPayload
            : draft.draftPayload;

        draft.isNew()
            ? setPOSTPayload(payload)
            : setPUTPayload(payload);
    }, [])

    useEffect(() => {
        if (post || update) {
            setTimeout( () => {
                history.push(`/subsets/${draft.id}/versions/${draft.version}`);
                dispatch({ action: 'reset' });
            }, 2000);
        }
    }, [ dispatch, draft.id, draft.version, history, post, update ])

return (
        <>
            { (updating || posting) &&
                <Paragraph>{
                    t('Sending data to the server') }...
                </Paragraph>
            }
            { (errorPost || errorUpdate) &&
                <div  style={{
                    width: '50%',
                    height: '30%',
                    border: 'none'
                }}>
                    <Dialog type='warning' title={ t('Update failed', {
                        id: draft.id,
                        version: draft.version})
                    }>
                        {`${ errorPost || errorUpdate }`}
                    </Dialog>
                </div>
            }
            { (post || update) &&
                <Paragraph style={{ color: 'green' }}>
                    <CheckCircle color='green' /> { t('Success') }. { t('Data is sent') }.
                </Paragraph>
            }
        </>
    );
};
