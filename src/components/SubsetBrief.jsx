import React, { useContext } from 'react';
import { AppContext } from '../controllers/context';
import { useTranslation } from 'react-i18next';
import { Text } from '@statisticsnorway/ssb-component-library';
import { SubsetIdForm } from './subsetForm/Step_1_Metadata';
import { eu, euTime} from '../utils/strings';

export const Brief = ({ id, versionValidFrom, lastUpdatedDate, status }) => {
    const { t } = useTranslation();

    return (
        <div style={{ margin: '0 0 30px 0'}}>
            <Text small style={{ margin: '50px 0' }}>
                { id || '-'}
                { t('Version valid from') }: <strong>{ eu(versionValidFrom) || '-' }  </strong>
                { t('Updated') }: <strong>{ euTime(lastUpdatedDate) || '-' }  </strong>
                { t('Status') }: <strong>{ t(status) || '-' }  </strong>
            </Text>
        </div>
    );
};

export const SubsetBrief = ({editable = false}) => {
    const { subset } = useContext(AppContext);
    const { id, versionValidFrom, lastUpdatedDate, administrativeStatus } = subset?.draft;

    return (
        <Brief
            id={ editable && subset?.draft?.isEditableId()
                ? <SubsetIdForm/>
                : <Id>{ id || '-' }</Id>
            }
            versionValidFrom={ versionValidFrom }
            lastUpdatedDate={ lastUpdatedDate }
            status={ administrativeStatus }
        />
    );
};

export const Id = (props) => {
    return (<>ID: <strong>{ props.children }</strong> </>);
};
