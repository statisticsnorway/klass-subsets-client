import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { GlobeButton } from '../../GlobeButton';
import { eu } from '../../../utils/strings';
import { languages as defaultLanguages } from '../../../defaults';
import { CodeDumb } from '../../Code';

export const HtmlView = ({
                                     version: {
                                         administrativeStatus,
                                         createdDate,
                                         lastModified,
                                         seriesId,
                                         validFrom,
                                         validUntil,
                                         version,
                                         statisticalUnits,
                                         codes,
                                         versionRationale
                                     }
                                 }) => {
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
                <span style={{ color: 'red'}}>{
                    t('No description in this language')}: { languages[langIndex].full}</span>
            }</p>

            <p><strong>{ t('Versions validity period') }: </strong>
                { validFrom || validUntil
                    ? `${ validFrom ? eu(validFrom) : '...' } - ${ validUntil ? eu(validUntil) : '...' }`
                    : `${ t('Period is not set') }.`
                }
            </p>

            <p><strong>{ t('Id') }:</strong> { version ? version : '-' }</p>
            <p><strong>{ t('Subset') }:</strong> { seriesId ? seriesId : '-' }</p>
            <p><strong>{ t('Status') }:</strong> { administrativeStatus ? t(administrativeStatus) : '-' }</p>
            <p><strong>{ t('Created') }:</strong> { createdDate ? eu(createdDate) : '-' }</p>
            <p><strong>{ t('Updated') }:</strong> { lastModified ? eu(lastModified) :'-' }</p>
            <p><strong>{ t('Statistical units') }:</strong> {
                statisticalUnits?.map(u => <span key={ u } className='p'> { u } </span>) || '-'}
            </p>

            <h3>{ t('Codes') }</h3>
            {/* FIXME: check the validity period is set correctly*/}
            { codes
                .sort((a,b) => (a.rank - b.rank))
                .map((code, i) => (
                    <CodeDumb key={ i } origin={ code } />
                    )
                )
            }
        </>
    );
}