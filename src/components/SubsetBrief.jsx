import React, {useContext, useEffect} from 'react';
import {AppContext} from '../controllers/context';
import {useTranslation} from 'react-i18next';
import {useGet as useGetSubset} from '../controllers/subsets-service';

export const SubsetBrief = ({editable = false}) => {
    const { subset } = useContext(AppContext);
    const { t } = useTranslation();

    return (
        <p style={{fontSize: 'calc(10px + 0.3vmin)'}}>
            {editable
                ? <SubsetIdForm />
                : <>ID: <strong>{subset.draft?.id || '-'}  </strong></>
            }
            {t('Version')}: <strong>{subset?.draft?.version || '-'}  </strong>
            {t('Updated')}: <strong>{subset?.draft?.lastUpdatedDate || '-'}  </strong>
            {t('Status')}: <strong>{t(subset?.draft?.administrativeStatus) || '-'}  </strong>
        </p>
    )
}

const SubsetIdForm = () => {
    const { subset } = useContext(AppContext);
    const { t } = useTranslation();

    const [exist,,, setPathExist] = useGetSubset();

    useEffect(() => {
        subset.draft.version === '1'
        && subset.draft.administrativeStatus === 'INTERNAL'
        && subset.draft.id?.length > 0
        && setPathExist(subset.draft.id);
    }, [subset.draft.id]);

    return (
        <>
            <label htmlFor='shortName'>ID:</label>
            <input type='text'
                   id='shortName'
                   name='shortName'
                   value={subset.draft.id}
                   // DOCME
                   maxLength='128'
                   onChange={(event) => {
                       setPathExist(event.target.value);
                       subset.dispatch({
                           action: 'shortName_update',
                           data: event.target.value
                       });
                   }}
                   style={{margin: '0 5px'}}
                   disabled={subset.draft.administrativeStatus !== 'INTERNAL'
                       || subset.draft.version !== '1'}
            />
            { subset.draft.id?.length > 0 && exist && !exist.error &&
            <div className='ssb-input-error ' style={{width: '25%', position: 'absolute'}}>
                <span style={{padding: '0 10px 0 0'}}>{t('Already used ID')}</span>
            </div>
            }
        </>
    )
}

