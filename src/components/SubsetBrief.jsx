import React, {useContext} from 'react';
import {AppContext} from '../controllers/context';
import {useTranslation} from 'react-i18next';
import {SubsetIdForm} from './subsetForm/forms';

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


