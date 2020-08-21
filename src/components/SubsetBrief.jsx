import React, {useContext} from 'react';
import {AppContext} from '../controllers/context';
import {useTranslation} from 'react-i18next';
import {SubsetIdForm} from './subsetForm/Step_1_Metadata';

export const Brief = ({id, version, lastUpdatedDate, status}) => {
    const { t } = useTranslation();

    return (
        <p style={{fontSize: 'calc(10px + 0.3vmin)'}}>
            {id || '-'}
            {t('Version')}: <strong>{version || '-'}  </strong>
            {t('Updated')}: <strong>{lastUpdatedDate || '-'}  </strong>
            {t('Status')}: <strong>{t(status) || '-'}  </strong>
        </p>
    );
};

export const SubsetBrief = ({editable = false}) => {
    const { subset } = useContext(AppContext);
    const { id, version, lastUpdatedDate, administrativeStatus } = subset?.draft;

    return (
        <Brief
            id={editable && subset.draft.isEditableId()
                ? <SubsetIdForm/>
                : <Id>{id || '-'}</Id>
            }
            version={version}
            lastUpdatedDate={lastUpdatedDate}
            status={administrativeStatus}
        />
    );
};

export const Id = (props) => {
    return (<>ID: <strong>{props.children}</strong> </>);
};