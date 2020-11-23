import React, { useContext } from 'react';
import { AppContext } from '../../controllers/context';
import { IdForm } from '../SubsetMetadata';
import { Brief } from './Brief';
import { Id } from './Id';

export const BriefContextual = ({ editable = false }) => {
    const { subset } = useContext(AppContext);
    const { id, versionValidFrom, lastModified, administrativeStatus } = subset?.draft;

    return (
        <Brief
            id={ editable && subset?.draft?.isEditableId()
                ? <IdForm/>
                : <Id>{ id || '-' }</Id>
            }
            versionValidFrom={ versionValidFrom }
            lastModified={ lastModified }
            status={ administrativeStatus }
        />
    );
};
