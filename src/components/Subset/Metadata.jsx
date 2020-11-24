import React from 'react';
import { eu } from '../../utils/strings';
import { useTranslation } from 'react-i18next';

export const Metadata = ({
                             description = 'No description',
                             owningSection = '-',
                             classificationFamily = '-',
                             validFrom = null,
                             validUntil = null
                         }) => {
    const { t } = useTranslation();

    return (
        <>
            <h2>{ t('Metadata') }</h2>
            <p><strong>{ t('Subsets validity period') }</strong>
                { validFrom || validUntil
                    ? `: ${ t('from') } ${ eu(validFrom) || '...' } ${
                        t('to')} ${ eu(validUntil) || '...' }`
                    : `. ${ t('Period is not set') }.`
                }
            </p>

            <p>{ description }</p>
            <p><strong>{ t('Owner') }:</strong> { owningSection }</p>
            <p><strong>{ t('Subject') }:</strong> { classificationFamily }</p>
    </>);
};

