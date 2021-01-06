import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { GlobeButton } from 'components';
import { eu, isInPeriod } from 'utils';
import { languages as defaultLanguages } from 'defaults';
import { Code } from 'views';

export const HtmlView = ({ version: {
                             administrativeStatus,
                             createdDate,
                             lastModified,
                             subsetId,
                             validFrom,
                             validUntil,
                             versionId,
                             statisticalUnits,
                             codes,
                             versionRationale
}}) => {

    const { t } = useTranslation();
    const [ langIndex, setLangIndex ] = useState(0);
    const languages = defaultLanguages.filter(l => l.draft);

    return (
        <>
            <h3>{ t('Version rationale') }
                <GlobeButton
                    title={ t('Toggle language')}
                    clickHandler={ () => setLangIndex( (langIndex + 1) % languages.length)}
                />
            </h3>
            <p className='lead'>{
                versionRationale?.find(desc => desc.languageCode === languages[langIndex].languageCode)?.languageText
                ||
                <span style={{ color: 'red' }}>{
                    t('No description in this language')}: { languages[langIndex].full}</span>
            }</p>

            <p><strong>{ t('Versions validity period') }: </strong>
                { validFrom || validUntil
                    ? `${ validFrom ? eu(validFrom) : '...' } - ${ validUntil ? eu(validUntil) : '...' }`
                    : `${ t('Period is not set') }.`
                }
            </p>

            <p><strong>{ t('VersionId') }:</strong> { versionId || '-' }</p>
            <p><strong>{ t('SubsetId') }:</strong> { subsetId || '-' }</p>
            <p><strong>{ t('Status') }:</strong> { administrativeStatus ? t(administrativeStatus) : '-' }</p>
            <p><strong>{ t('Created') }:</strong> { createdDate ? eu(createdDate) : '-' }</p>
            <p><strong>{ t('Updated') }:</strong> { lastModified ? eu(lastModified) :'-' }</p>
            <p><strong>{ t('Statistical units') }:</strong> {
                statisticalUnits?.map(u => <span key={ u } className='p'> { u } </span>) || '-'}
            </p>

            <h3>{ t('Codes') }</h3>
            { codes
                .sort((a,b) => (a.rank - b.rank))
                .map((code, i) => (
                    <Code key={ i } origin={ code } valid={
                        isInPeriod(code.validFromInRequestedRange, validFrom, validUntil )
                        || isInPeriod(code.validToInRequestedRange, validFrom, validUntil )
                        || isInPeriod( validFrom, code.validFromInRequestedRange, code.validToInRequestedRange )
                        || isInPeriod( validUntil, code.validFromInRequestedRange, code.validToInRequestedRange )
                    } />)
                )
            }
        </>
    );
}