import React, { useContext } from 'react';
import { AppContext } from 'controllers/context';
import { BriefMetadata, BriefVersion } from 'views';

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
        versionId,
        versionLastModified,
        versionCreatedDate,
        versionValidFrom,
        versionValidUntil,
        administrativeStatus,
        metadataToBeSaved,
        versionToBeSaved,
        codes,
    } } } = useContext(AppContext);

    return (
        <>
        { metadata &&
            <BriefMetadata
                id={ id }
                editable={ editable && isEditableId() }
                created={ createdDate }
                lastModified={ lastModified }
                validFrom={ validFrom }
                validUntil={ validUntil }
                published={ publishedVersions?.length }
                drafts={ drafts?.length }
                locals={ versions?.filter(v => v.administrativeStatus === 'INITIAL')?.length }
                // toBeSaved={ versions?.filter(v => v.versionToBeSaved).length }
                metadataToBeSaved={ metadataToBeSaved }
            />
        }
        { currentVersion &&
            <BriefVersion
                id={ versionId }
                lastModified={ versionLastModified }
                created={ versionCreatedDate }
                validFrom={ versionValidFrom }
                validUntil={ versionValidUntil }
                codes={ codes?.length }
                status={ administrativeStatus }
                toBeSaved={ versionToBeSaved }
            />
        }
    </>
    );
};
