import React from 'react';
import { useTranslation } from 'react-i18next';
import { eu, euTime } from '../../utils/strings';

export const Brief = ({ id, versionValidFrom, lastModified, status }) => {
    const { t } = useTranslation();

    return (
        <p className='small'>
            { id || '-'}
            { t('Updated') }: <strong>{ euTime(lastModified) || '-' }  </strong>
            { versionValidFrom && <span>{ t('Version valid from') }: <strong>{ eu(versionValidFrom) }  </strong></span> }
            { status && <span>{ t('Status') }: <strong>{ t(status) }</strong></span> }
        </p>
    );
};

