import React from 'react';
import {Accordion, Paragraph, Text, Title, Link as SsbLink} from '@statisticsnorway/ssb-component-library';
import {useTranslation} from 'react-i18next';
import {useParams} from 'react-router-dom';
import {useGet} from '../controllers/subsets-service';

export const SubsetPage = () => {
    const { t } = useTranslation();

    let { id } = useParams();
    const [subset] = useGet(id);

    // FIXME: translate placeholders
    // TODO: smart language choice
    return(
        <div className='page'>
            {!subset
                ? <p>{t('Subset with id does not exist', {id})}.</p>
                : <div style={{lineHeight: '50%'}}>
                    <Title size={3}>
                        {subset.name?.find(name => name.languageCode === 'nb')?.languageText || 'no title'}
                    </Title>
                    <p style={{fontSize: 'calc(10px + 0.3vmin)'}}>ID: <strong>{subset?.id || '-'}  </strong>
                        {t('Version')}: <strong>{subset.version || '-'}  </strong>
                        {t('Updated')}: <strong>{subset.lastUpdatedDate || '-'}  </strong>
                        {t('Status')}: <strong>{subset.administrativeStatus || '-'}  </strong>
                    </p>
                    <Paragraph style={{fontSize: 'calc(10px + 0.8vmin)'}}>{subset.description?.find(
                        desc => desc.languageCode === 'nb')?.languageText || t('No description')}
                    </Paragraph>
                    {
                        subset.codes
                            .sort((a,b) => a.rank - b.rank)
                            .map((code, i) => <p key={i}>{code.rank}. {code.urn}</p>)
                    }
                </div>
            }
        </div>
    )
};

export const SubsetPreview = ({subset}) => {
    const { t } = useTranslation();

    // set classification name to each code
    subset.classifications.forEach(classification => classification.codes
            .forEach(code => code.classification = classification.name));

    // FIXME: show title in selected language, not just first in the name array.
    // TODO: show subset in other languages - switch button for language?

    const from = subset.valid.from && subset.valid.from.toISOString().substr(0, 10);
    const to = subset.valid.to && subset.valid.to.toISOString().substr(0, 10);

    const allCodes = [];
    subset.classifications.map(classification => allCodes.push(...classification.codes));
    allCodes.forEach(i => (i.title = `${i.code} ${i.name}`));

    return (
        <>
            <Title size={2}>{subset.name[0]?.languageText || t('Subset has got no title yet')}</Title>
            <Paragraph>ID: {subset.id || '-'}</Paragraph>
            <Paragraph>{t('Validity period')}{
                from && to
                ? `: ${t('from to', { from, to })}.`
                : from || to ? `: ${t('at', { date: from || to})}.`
                : `: ${t('Period is not set').toLocaleLowerCase()}.`}
            </Paragraph>

            <Paragraph>{subset.description[0]?.languageText || t('No description')}
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

export const SubsetBanner = ({subset}) => {
    const { t } = useTranslation();

    // FIXME: translate placeholders
    // TODO: smart language choice
    return (
        <div style={{lineHeight: '50%'}}>
            <SsbLink href={`/subsets/${subset.id}`} linkType='profiled'>
                {subset?.name?.find(name => name.languageCode === 'nb')?.languageText || t('No name')}
            </SsbLink>
            <p style={{fontSize: 'calc(10px + 0.3vmin)'}}>ID: <strong>{subset?.id || 'N/A'}  </strong>
                {t('Version')}: <strong>{subset?.version || 'N/A'}  </strong>
                {t('Updated')}: <strong>{subset?.lastUpdatedDate || 'N/A'}  </strong>
                {t('Status')}: <strong>{subset?.administrativeStatus || 'N/A'}  </strong>
            </p>
            <p style={{fontSize: 'calc(10px + 0.8vmin)'}}>{subset?.description?.find(
                description => description.languageCode === 'nb')?.languageText || t('No description')}
            </p>
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