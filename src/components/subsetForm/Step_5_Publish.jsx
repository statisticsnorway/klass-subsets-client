import React, {useEffect} from 'react';
import '../../css/pages.css';
import {useTranslation} from 'react-i18next';
import {Button, Title, FormError} from '@statisticsnorway/ssb-component-library';
import {SubsetPreview} from '../Subset';
import {usePost, usePut} from '../../controllers/subsets-service';
import {useHistory} from 'react-router-dom';

export const Step_5_Publish = ({subset}) => {
    const {draft, dispatch, errors} = subset;

    const { t } = useTranslation();

    let history = useHistory();

    const [post, setPOSTPayload,, errorPost] = usePost();
    const [update, setPUTPayload,, errorUpdate] = usePut(draft.id);

    useEffect(() => {
        if (post || update) {
            dispatch({action: 'reset'});
            history.push(`/subsets/${draft.id}`);
        }
    }, [post, update]);

    // FIXME: workaround caused server not sending exception on error
    useEffect(() => {
        (errorPost || errorUpdate) &&
            alert(`Update failed: ${errorPost || errorUpdate}`);
    }, [errorPost, errorUpdate]);

    useEffect(() =>
        !post && !update && dispatch({action: 'validate'}), [draft, dispatch]);

return (
        <>
            <Title size={3}>{t('Review and publish')}</Title>
            <p style={{fontSize: 'calc(10px + 0.3vmin)'}}>ID: <strong>{draft?.id || '-'}  </strong>
                {t('Version')}: <strong>{draft.version || '-'}  </strong>
                {t('Updated')}: <strong>{draft.lastUpdatedDate || '-'}  </strong>
                {t('Status')}: <strong>{t(draft.administrativeStatus) || '-'}  </strong>
            </p>

            <SubsetPreview subset={draft}/>

            { Object.values(errors).flat().length > 0 &&
                <FormError title={t('Some fields are not right')}
                           errorMessages={Object.values(errors).flat().map(e => t(e))}
                />
            }

            <div style={{margin: '5px 0 5px 0', width: '60%'}}>

                <div style={{float: 'left', marginRight: '20px', padding: '0'}}>
                    <Button
                        disabled={update !== null || draft.administrativeStatus === 'OPEN'}
                        onClick={() => draft.administrativeStatus === 'INTERNAL' && draft.version === '1'
                            ? setPOSTPayload(prepare('DRAFT', {...draft}))
                            : setPUTPayload(prepare('DRAFT', {...draft}))
                        }>{t('Save')}
                    </Button>
                </div>

                <div style={{float: 'right'}}>
                    <Button
                        disabled={post !== null || Object.values(errors).flat().length > 0}
                        onClick={() => draft.administrativeStatus === 'INTERNAL' && draft.version === '1'
                            ? setPOSTPayload(prepare('OPEN', {...draft}))
                            : setPUTPayload(prepare('OPEN', {...draft}))
                        }>{t('Publish')}
                    </Button>
                </div>

                <br style={{clear: 'both'}}/>
            </div>

            <br/><br/>
        </>
    );
};

function prepare(status = '', payload = {}) {
    payload.administrativeStatus = status;
    payload.version = `${payload.version}`;
    payload.lastUpdatedDate = new Date().toISOString(); // FIXME: has to be set on backend side+
    Object.keys(payload).forEach((key) => (payload[key] == null) && delete payload[key]);
    return payload;
}