import { useTranslation } from 'react-i18next';
import { eu, euTime } from '../../../utils';
import React from 'react';
import { BlockExpandable } from '../../BoxExpandable';

export const Brief = ({ id,
                        created,
                        lastModified,
                        validFrom,
                        validUntil,
                        status,
                        toBeSaved
}) => {
    const { t } = useTranslation();

    // FIXME: decide whether it should be focusable
    return (
        <div title='Brief subset status' style={{ fontSize: '12px'}}>
            <BlockExpandable label='Current version'
                             text={ id || '-' }
                             color='#B6E8B8'
            />
            <BlockExpandable label='Version created'
                             text={ eu(created) || '-' }
                             color='#B6E8B8'
            />
            <BlockExpandable label='Version updated'
                             text={ euTime(lastModified) || '-' }
                             color='#B6E8B8'
            />
            <BlockExpandable label='Versions validity period'
                             text={`${ eu(validFrom) || '...' } - ${ eu(validUntil) || '...' }`}
                             color='#B6E8B8'
            />
            { status && <BlockExpandable label='Version status'
                                         text={ t(status) }
                                         color={ status === 'OPEN' ? '#9272FC' : '#ED5935' }
                                         light
            />}
            { toBeSaved && <BlockExpandable label='Version has been changed locally'
                                                text={ t('Modified locally') }
                                                color='#B6E8B8'
            />}
            <br style={{ clear: 'both' }}/>
        </div>
    );
};