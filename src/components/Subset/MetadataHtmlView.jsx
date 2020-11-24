import React, { useState } from 'react';
import { eu } from '../../utils/strings';
import { useTranslation } from 'react-i18next';
import { languages as defaultLanguages } from '../../defaults';
import { GlobeButton } from '../GlobeButton';
import { orderByValidFromAsc } from '../../utils/arrays';

export const MetadataHtmlView = ({
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
    const [ langIndex, setLangIndex ] = useState(0);
    const languages = defaultLanguages.filter(l => l.draft);
    const validFrom = versions?.length > 0
        && orderByValidFromAsc([...versions])[0].validFrom;
    const validUntil = versions?.length > 0
        && orderByValidFromAsc([...versions])[versions.length - 1].validUntil;

    return (
        <>
            <h3>{ t('Description') }
                <GlobeButton
                    title={ t('Toggle language')}
                    clickHandler={ () => setLangIndex( (langIndex + 1) % languages.length)}
                />
            </h3>
            <p className='lead'>{
                description?.find(desc => desc.languageCode === languages[langIndex].languageCode)?.languageText
                ||
                <span style={{ color: 'red'}}>{
                    t('No description for this language')}: {languages[langIndex].full
                }</span>
            }</p>

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
                statisticalUnits.map(u => <span key={ u } className='p'> { u } </span>)
                }
            </p>
            <p><strong>{ t('Owner') }:</strong> { owningSection }</p>
            <p><strong>{ t('Number of published versions') }:</strong> { versions?.length }</p>
            <p><strong>{ t('Created') }:</strong> { eu(createdDate) }</p>
            <p><strong>{ t('Last updated') }:</strong> { eu(lastModified) }</p>
        </>
    );
};

