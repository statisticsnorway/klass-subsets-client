import React from 'react';
import { eu } from '../../../utils/strings';
import { useTranslation } from 'react-i18next';
import { orderByValidFromAsc } from '../../../utils/arrays';
import { TitledBlock } from '../../TitledBlock';

export const HtmlView = ({
    subset: {
        id,
        description,
        owningSection,
        classificationFamily,
        versions,
        createdDate,
        lastModified,
        shortName,
        statisticalUnits
    }
}) => {
    const { t } = useTranslation();
    const validFrom = versions?.length > 0
        && orderByValidFromAsc([...versions])[0].validFrom;
    const validUntil = versions?.length > 0
        && orderByValidFromAsc([...versions])[versions.length - 1].validUntil;

    return (
        <>
            <TitledBlock title='Description' translatable texts={ description } />

            <p><strong>{ t('Subsets validity period') }: </strong>
                { validFrom || validUntil
                    ? `${ validFrom ? eu(validFrom) : '...' } - ${ validUntil ? eu(validUntil) : '...' }`
                    : `${ t('Period is not set') }.`
                }
            </p>

            <p><strong>{ t('ID') }:</strong> { id }</p>
            <p><strong>{ t('Short name') }:</strong> { shortName }</p>
            <p><strong>{ t('Subject') }:</strong> { classificationFamily }</p>
            <p><strong>{ t('Statistical units') }:</strong> {
                statisticalUnits.map(u => <span key={ u } className='p'> { u } </span>)}
            </p>
            <p><strong>{ t('Owner') }:</strong> { owningSection }</p>
            <p><strong>{ t('Number of published versions') }:</strong> {
                versions.filter(v => v.administrativeStatus === 'OPEN')?.length }
            </p>
            <p><strong>{ t('Number of drafts') }:</strong> {
                versions?.filter(v => v.administrativeStatus === 'DRAFT')?.length }
            </p>
            <p><strong>{ t('Created') }:</strong> { eu(createdDate) }</p>
            <p><strong>{ t('Last updated') }:</strong> { eu(lastModified) }</p>
        </>
    );
};

