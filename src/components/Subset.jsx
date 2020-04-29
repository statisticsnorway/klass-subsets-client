import React from 'react';
import {Accordion, Paragraph, Title, Link as SsbLink} from '@statisticsnorway/ssb-component-library';
import {useTranslation} from 'react-i18next';
import {Code} from './Code';

export const SubsetPreview = ({subset}) => {
    const { t } = useTranslation();

    // FIXME: show title in selected language, not just first in the name array.
    // TODO: show subset in other languages - switch button for language?

    const from = subset.validFrom?.toISOString().substr(0, 10);
    const to = subset.validUntil?.toISOString().substr(0, 10);

    return (
        <>
            <Title size={2}>{subset.name[0]?.languageText || t('Subset has got no title yet')}</Title>
            <Paragraph><strong>ID:</strong> {subset.id || '-'}</Paragraph>
            <Paragraph><strong>{t('Validity period')}</strong>{
                from && to
                ? `: ${t('from to', { from, to })}.`
                : from || to ? `: ${t('at', { date: from || to})}.`
                : `: ${t('Period is not set').toLocaleLowerCase()}.`}
            </Paragraph>

            <Paragraph>{subset.description[0]?.languageText || t('No description')}</Paragraph>

            <Paragraph><strong>{t('Owner')}:</strong> {subset.createdBy || '-'}</Paragraph>

            <Paragraph><strong>{t('Subject')}:</strong> {subset.administrativeDetails
                .find(d => d.administrativeDetailType === 'ANNOTATION')
                .values[0] || '-'}</Paragraph>

            <Title size={3}>{t('Codes')}: </Title>
            {subset.codes
                .sort((a,b) => (a.rank - b.rank))
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
        </>
    );
};

export const SubsetBanner = ({subset}) => {
    const { t } = useTranslation();

    // FIXME: translate placeholders
    // TODO: smart language choice
    return (
        <div style={{lineHeight: '50%', margin: '50px 0'}}>
            <SsbLink href={`/subsets/${subset?.id}`} linkType='profiled'>
                {subset?.name?.find(name => name.languageCode === 'nb')?.languageText || t('No name')}
            </SsbLink>
            <p style={{fontSize: 'calc(10px + 0.3vmin)'}}>ID: <strong>{subset?.id || '-'}  </strong>
                {t('Version')}: <strong>{subset?.version || '-'}  </strong>
                {t('Updated')}: <strong>{subset?.lastUpdatedDate || '-'}  </strong>
                {t('Status')}: <strong>{subset?.administrativeStatus || '-'}  </strong>
            </p>
            <p style={{fontSize: 'calc(10px + 0.8vmin)'}}>{subset?.description?.find(
                description => description.languageCode === 'nb')?.languageText || t('No description')}
            </p>
        </div>
    )
};

export const Subsets = ({items}) => {
    return (
        <>{items?.length > 0 &&
            items.map((subset, i) => (<SubsetBanner key={i} subset={subset} />))}
        </>
    )
};
