import React from 'react';
import {Accordion, Paragraph, Title, Link as SsbLink} from '@statisticsnorway/ssb-component-library';
import {useTranslation} from 'react-i18next';
import {Code} from './Code';

export const SubsetPreview = ({ subset }) => {
    const { t } = useTranslation();

    // FIXME: show title in selected language, not just first in the name array.
    // TODO: show subset in other languages - switch button for language?

    const from = subset.validFrom?.toISOString().substr(0, 10);
    const to = subset.validUntil?.toISOString().substr(0, 10);

    return (
        <div className='subset-preview'>
            <Title className='subset-preview-titles' size={2}>{subset.name[0]?.languageText || t('Subset has got no title yet')}</Title>
            <Title className='subset-preview-titles' size={2} className='subset-id'><strong>ID:</strong> {subset.id || '-'}</Title>
            <Title className='subset-preview-titles' size={2}><strong>{t('Validity period')}</strong>{
                from && to
                ? `: ${t('from to', { from, to })}.`
                : from || to ? `: ${t('at', { date: from || to})}.`
                : `: ${t('Period is not set').toLocaleLowerCase()}.`}
            </Title>

            <Paragraph>{subset.description[0]?.languageText || t('No description')}</Paragraph>

            <Paragraph><strong>{t('Owner')}:</strong> {subset.createdBy || '-'}</Paragraph>

            <Paragraph><strong>{t('Subject')}:</strong> {subset.administrativeDetails
                .find(d => d.administrativeDetailType === 'ANNOTATION')
                .values[0] || '-'}</Paragraph>

            <Title size={3}>{t('Codes')}: </Title>
            {subset.codes
                .sort((a, b) => a.rank - b.rank)
                .map((code, i) => (
                    <Code key={i}
                          origin={{
                              ...code,
                              validFromInRequestedRange: from,
                              validToInRequestedRange: to
                          }}
                    />))}

            <Accordion header={t('Raw JSON')}>
                <pre>{JSON.stringify(subset, null, 4)}</pre>
            </Accordion>
        </div>
    );
};

export const SubsetBanner = ({ subset }) => {
    const { t } = useTranslation();

    // FIXME: translate placeholders
    // TODO: smart language choice
    return (
        <div className='subset-banner mb-40'>
            <SsbLink href={`/subsets/${subset?.id}`} linkType='profiled'>
                {subset?.name?.find(name => name.languageCode === 'nb')?.languageText || t('No name')}
            </SsbLink>
            <Paragraph className='subset-banner-p'>ID: <strong>{subset?.id || '-'}  </strong></Paragraph>
            <Paragraph className='subset-banner-p'>{t('Version')}: <strong>{subset?.version || '-'}  </strong></Paragraph>
            <Paragraph className='subset-banner-p'>{t('Updated')}: <strong>{subset?.lastUpdatedDate || '-'}  </strong></Paragraph>
            <Paragraph className='subset-banner-p'>{t('Status')}: <strong>{subset?.administrativeStatus || '-'}  </strong></Paragraph>
            
            <Paragraph className='subset-banner-p'> {subset?.description?.find(
                description => description.languageCode === 'nb')?.languageText || t('No description')}
            </Paragraph>
        </div>
    );
};

export const Subsets = ({ items }) => {
    return (
        <>
            {items?.length > 0 &&
                items.map((subset, i) => (
                    <SubsetBanner key={i} subset={subset} />
                ))}
        </>
    );
};
