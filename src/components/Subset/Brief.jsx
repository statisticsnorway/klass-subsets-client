import React from 'react';
import { useTranslation } from 'react-i18next';
import { Text } from '@statisticsnorway/ssb-component-library';
import { eu, euTime } from '../../utils/strings';

export const Brief = ({ id, versionValidFrom, lastModified, status }) => {
    const { t } = useTranslation();

    return (
        <div style={{ margin: '0 0 30px 0'}}>
            <Text small style={{ margin: '50px 0' }}>
                { id || '-'}
                { t('Version valid from') }: <strong>{ eu(versionValidFrom) || '-' }  </strong>
                { t('Updated') }: <strong>{ euTime(lastModified) || '-' }  </strong>
                { t('Status') }: <strong>{ t(status) || '-' }  </strong>
            </Text>
        </div>
    );
};

