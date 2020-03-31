import React from 'react';
import {Accordion, Paragraph, Text, Title, Link as SsbLink} from '@statisticsnorway/ssb-component-library';
import {useTranslation} from 'react-i18next';

export const Subset = ({subset}) => {
    const { t } = useTranslation();

    // set classification name to each code
    subset.classifications.forEach(classification => classification.codes
            .forEach(code => code.classification = classification.name));

    // FIXME: show title to selected language, not just first in the name array.
    // TODO: show subset in other languages - switch button for language?

    const from = subset.valid.from && subset.valid.from.toISOString().substr(0, 10);
    const to = subset.valid.to && subset.valid.to.toISOString().substr(0, 10);

    const allCodes = [];
    subset.classifications.map(classification => allCodes.push(...classification.codes));
    allCodes.forEach(i => (i.title = `${i.code} ${i.name}`));

    return (
        <>
            <Title size={2}>{
                subset.names.length > 0 && subset.names[0].text
                    ? subset.names[0].text
                    : t('Subset has got no title yet')
            }</Title>
            {<Paragraph>ID: {subset.id || '-'}</Paragraph>}
            <Paragraph>{t('Validity period')}{
                from && to
                ? `: ${t('from to', { from, to })}.`
                : from || to ? `: ${t('at', { date: from || to})}.`
                : `: ${t('Period is not set').toLocaleLowerCase()}.`}
            </Paragraph>

            <Paragraph>{subset.descriptions.length > 0 && subset.descriptions[0].text
                ? subset.descriptions[0].text
                : t('No description')}
            </Paragraph>

            <Title size={3}>{t('Codes')}: </Title>
            {allCodes.filter(i => i.included)
                .sort((a,b) => (a.rank - b.rank))
                .map((code, i) => (
                    <Code key={i} code={code}/>))}

            <Accordion header={t('Raw JSON')}>
                <pre>{JSON.stringify(subset, null, 4)}</pre>
            </Accordion>
        </>
    );
};

export const Code = ({code}) => {
    const { t } = useTranslation();

    return (
        <Accordion header={code.name} subHeader={code.code || t('Code')}>
            <p><strong>{t('Short name')}:</strong> {code.shortName || '-'}</p>
            <p><strong>{t('Classification')}:</strong> {code.classification || '-'}</p>
            <p><strong>{t('Level')}:</strong> {code.level}</p>
            {code.parentCode && <p><strong>{t('Parent code')}:</strong> {code.parentCode}</p>}
            <p><strong>{t('Notes')}: </strong>
                {!code.notes
                ? <Text>-</Text>
                : code.notes.map(note => (
                <div style={{padding: '5px 25px 10px 25px'}}>
                    <Paragraph style={{width: '65%'}}>{note.note}</Paragraph>
                    <Text small><strong>«{note.versionName}»</strong> ({t('valid')}: {note.validFrom || '...'} - {note.validTo || '...'})</Text>
                </div>))}
            </p>
        </Accordion>
    );
};

// FIXME: translate placeholders
// TODO: smart language choice
export const SubsetBanner = ({subset}) => {
    return (
        <div style={{fontSize: 'calc(10px + 0.5vmin)', lineHeight: '50%'}}>
            <SsbLink href={`/subsets/${subset.id}`} linkType='profiled'>
                {subset?.name?.find(name => name.languageCode === 'nb')?.languageText || 'no title'}
            </SsbLink>
            <p>id: <strong>{subset?.id || 'N/A'}  </strong>
               version: <strong>{subset?.version || 'N/A'}  </strong>
               updated: <strong>{subset?.lastUpdatedDate || 'N/A'}  </strong>
               status: <strong>{subset?.administrativeStatus || 'N/A'}  </strong>
            </p>
            <p>{subset?.description?.find(
                description => description.languageCode === 'nb')?.languageText || 'no description'}</p>
        </div>
    )
};

export const Subsets = ({items}) => {
    return (
        <>{items && items.length > 0 &&
            items.map((subset, i) => (<SubsetBanner key={i} subset={subset} />))}
        </>
    )
};