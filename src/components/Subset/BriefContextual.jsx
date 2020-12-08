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
        metadataToBeSaved,
        versionToBeSaved
    } } } = useContext(AppContext);
console.log({versions})
    return (
        <>
        { metadata &&
            <BriefMetadata
                id={ editable && isEditableId()
                    ? <IdForm id={ id }/>
                    : <Id id={ id }>{ id || '-' }</Id>
                }
                created={ createdDate }
                lastModified={ lastModified }
                validFrom={ validFrom }
                validUntil={ validUntil }
                published={ publishedVersions?.length }
                drafts={ drafts?.length }
                locals={ versions?.filter(v => v.administrativeStatus === 'INITIAL')?.length }
                // toBeSaved={ versions?.filter(v => v.toBeSaved).length }
                // FIXME: hardcoded workaround
                toBeSaved={ versions?.filter(v => v.versionRationale[0]?.languageText?.endsWith('111')).length }
                metadatatoBeSaved={ metadataToBeSaved }
            />
        }
        { currentVersion &&
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
