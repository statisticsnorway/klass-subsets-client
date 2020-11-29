import { useTranslation } from 'react-i18next';
import { eu, euTime } from '../../../utils/strings';
import React from 'react';

export const Brief = ({ id,
                          created,
                          lastModified,
                          validFrom,
                          validUntil,
                          published = null,
                          drafts = null,
                          locals = null,
                          toBeSaved = null
}) => {
    const { t } = useTranslation();

    return (
        <p className='small'>
            { id || '-'}
            { created && t('Created') }: <strong>{ eu(created) || '-' }  </strong>
            { t('Updated') }: <strong>{ euTime(lastModified) || '-' }  </strong>
            { t('Subsets validity period') }: <strong>{ eu(validFrom) || '...' } - { eu(validUntil) || '...' } </strong>
            { t('Number of published versions') }: <strong>{ published }  </strong>
            { drafts && <span>{ t('Number of drafts') }: <strong>{ drafts }  </strong></span> }
            { locals && <span>{ t('Local drafts') }: <strong>{ locals }  </strong></span> }
            { toBeSaved && <span>{ t('To be saved') }: <strong>{ toBeSaved } </strong></span> }
        </p>
    );
};