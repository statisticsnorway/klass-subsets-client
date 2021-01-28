import { useTranslation } from 'react-i18next';
import { eu, euTime } from 'utils';
import React from 'react';
import { BoxExpandable } from 'components';

export const BriefVersion = ({ id,
                        created,
                        lastModified,
                        validFrom,
                        validUntil,
                        codes = 0,
                        status,
                        toBeSaved
}) => {
    const { t } = useTranslation();

    // FIXME: decide whether it should be focusable
    return (
        <div title='Brief subset status' style={{ fontSize: '12px'}}>
            <BoxExpandable label='Current version'
                             text={ id || '-' }
                             color='#B6E8B8'
            />
            <BoxExpandable label='Version created'
                             text={ eu(created) || '-' }
                             color='#B6E8B8'
            />
            <BoxExpandable label='Version updated'
                             text={ euTime(lastModified) || '-' }
                             color='#B6E8B8'
            />
            <BoxExpandable label='Versions validity period'
                             text={`${ eu(validFrom) || '...' } - ${ eu(validUntil) || '...' }`}
                             color='#B6E8B8'
            />
            <BoxExpandable label='Amount of codes'
                             text={ codes }
                             color='#B6E8B8'
            />
            { status && <BoxExpandable label='Version status'
                                         text={ t(status) }
                                         color={ status === 'OPEN' ? '#9272FC' : '#ED5935' }
                                         light
            />}
            { toBeSaved && <BoxExpandable label='Version has been changed locally'
                                                text={ t('Modified locally') }
                                                color='bisque'
            />}
            <br style={{ clear: 'both' }}/>
        </div>
    );
};