import React, { useContext } from 'react';
import { AppContext } from '../../controllers/context';
import { SubsetIdForm } from '../subsetForm/Step_1_Metadata';
import { Brief } from './Brief';
import { Id } from './Id';

export const BriefContextual = ({ editable = false }) => {
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
