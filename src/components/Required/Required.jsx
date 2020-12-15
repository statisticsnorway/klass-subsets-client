import React from 'react';
import { useTranslation } from 'react-i18next';

export const Required = () => {
    const { t } = useTranslation();

    return (<span
        title={ t('Required') }
        style={{ color: 'red' }}
    > * </span>);
}