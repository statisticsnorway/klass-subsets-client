import React, { useContext } from 'react';
import { AppContext } from '../../controllers/context';
import { IdForm } from '../SubsetMetadata';
import { Brief as BriefMetadata } from './Metadata';
import { Brief as BriefVersion } from './Version';
import { Id } from './Id';

export const BriefContextual = ({
                                    editable = false,
                                    metadata = true,
                                    currentVersion = false
}) => {
    const { subset: { draft: {
        id,
        createdDate,
        lastModified,
        publishedVersions,
        drafts,
        validFrom,
        validUntil,
        versions,
        isEditableId,
        version,
        versionLastModified,
        versionCreatedDate,
        versionValidFrom,
        versionValidUntil,
        administrativeStatus,
        versionToBeSaved
    } } } = useContext(AppContext);

    return (
        <>
        { metadata &&
            <BriefMetadata
                id={ editable && isEditableId()
                    ? <IdForm/>
                    : <Id>{ id || '-' }</Id>
                }
                created={ createdDate }
                lastModified={ lastModified }
                published={ publishedVersions?.length }
                drafts={ drafts?.length }
                locals={ versions?.filter(v => v.administrativeStatus === 'INITIAL')?.length }
                validFrom={ validFrom }
                validUntil={ validUntil }
                toBeSaved={ versions?.filter(v => v.toBeSaved).length }
            />
        }
        {
            currentVersion &&
            <BriefVersion
                id={ version }
                lastModified={ versionLastModified }
                created={ versionCreatedDate }
                validFrom={ versionValidFrom }
                validUntil={ versionValidUntil }
                status={ administrativeStatus }
                toBeSaved={ versionToBeSaved }
            />
        }
    </>
    );
};
