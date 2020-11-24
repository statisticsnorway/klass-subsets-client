import React, { useContext, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { AppContext } from '../../controllers/context';
import { useGet } from '../../controllers/subsets-service';
import { subsetDraft } from '../../defaults';

export const IdForm = () => {
    const { subset } = useContext(AppContext);
    const { t } = useTranslation();

    const [exist,,, setPathExist] = useGet();

    useEffect(() => {
        subset.draft.isNew()
        && subset.draft.id?.length > 0
        && setPathExist(subset.draft.id);
    }, [ subset.draft.id ]);

    return (
        <div style={{display: 'inline-block'}}>
            <label htmlFor='shortName'>ID:</label>
            <input type='text'
                   id='shortName'
                   name='shortName'
                   value={subset.draft.id}
                   maxLength={ subsetDraft.maxLengthId }
                   onChange={(event) => {
                       setPathExist(event.target.value);
                       subset.dispatch({
                           action: 'shortName_update',
                           data: event.target.value
                       });
                   }}
                   style={{margin: '0 5px'}}
                   disabled={ !subset.draft.isNew() }
            />
            { exist && !exist.error &&
            <div className='ssb-input-error ' style={{width: '25%', position: 'absolute'}}>
                <span style={{padding: '0 10px 0 0'}}>{ t('Already used ID') }</span>
            </div>
            }

            { subset.draft?.errors?.id?.length > 0
            && subset.draft?.id?.length > 0 &&
            <div className='ssb-input-error ' style={{width: '25%', position: 'absolute'}}>
                {subset.draft?.errors?.id.map(error => (
                    <span key={error} style={{padding: '0 10px 0 0'}}>{t(error)}.</span>
                ))}
            </div>
            }
        </div>
    );
};