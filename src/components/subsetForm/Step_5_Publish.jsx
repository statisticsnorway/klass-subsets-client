import React, { useEffect, useContext } from 'react';
import '../../css/pages.css';
import { useTranslation } from 'react-i18next';
import { Button, Title, FormError } from '@statisticsnorway/ssb-component-library';
import { SubsetPreview } from '../Subset';
import { usePost, usePut } from '../../controllers/subsets-service';
import { useHistory } from 'react-router-dom';
import { SubsetBrief } from '../SubsetBrief';
import { AppContext } from '../../controllers/context';

export const Step5Publish = () => {
    const { subset } = useContext(AppContext);
    const { draft, dispatch } = subset;
    const { t } = useTranslation();
    let history = useHistory();

    const [post, setPOSTPayload,, errorPost] = usePost();
    const [update, setPUTPayload,, errorUpdate] = usePut(draft.id);

    useEffect(() => {
        if (post || update) {
            dispatch({action: 'reset'});
            history.push(`/subsets/${draft.id}/version/${draft.version}`);
        }
    }, [ post, update ]);

    // FIXME: workaround caused server not sending exception on error
    useEffect(() => {
        (errorPost || errorUpdate) &&
            alert(`Update failed: ${ errorPost || errorUpdate }`);
    }, [ errorPost, errorUpdate ]);

return (
        <>
            <Title size={3}>{t('Review and publish')}</Title>
            <SubsetBrief />

            <SubsetPreview subset={ draft }/>

            { Object.values(draft.errors).flat().length > 0 &&
                <FormError title={t('Some fields are not right')}
                           errorMessages={Object.values(draft.errors).flat().map(e => t(e))}
                />
            }

            <div style={{margin: '5px 0 5px 0', width: '60%'}}>

                <div style={{float: 'left', marginRight: '20px', padding: '0'}}>
                    <Button
                        disabled={ update !== null || draft.isPublished }
                        onClick={() => {
                            draft.isNew()
                                ? setPOSTPayload(draft.draftPayload)
                                : setPUTPayload(draft.draftPayload);
                        }
                        }>{t('Save')}
                    </Button>
                </div>

                <div style={{float: 'right'}}>
                    <Button
                        disabled={ post !== null || Object.values(draft.errors).flat().length > 0}
                        onClick={() => {
                            draft.isNew()
                                ? setPOSTPayload(draft.publishPayload)
                                : setPUTPayload(draft.publishPayload)
                        }
                        }>{t('Publish')}
                    </Button>
                </div>

                <br style={{clear: 'both'}}/>
            </div>

            <br/><br/>
        </>
    );
};
