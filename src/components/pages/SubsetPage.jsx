import React from 'react';
import {Accordion, Paragraph, Title} from '@statisticsnorway/ssb-component-library';
import {useTranslation} from 'react-i18next';
import {useParams} from 'react-router-dom';
import {useGet} from '../../controllers/subsets-service';
import {URN} from '../../controllers/klass-api';

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
                : <div>
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

                    <Paragraph><strong>{t('Owner')}:</strong> {subset.createdBy || '-'}</Paragraph>
                    <Paragraph><strong>{t('Valid from')}:</strong> {subset.validFrom.substr(0, 10) || '-'}</Paragraph>
                    <Paragraph><strong>{t('Valid to')}:</strong> {subset.validUntil.substr(0, 10)  || '-'}</Paragraph>
                    <Paragraph><strong>{t('Subject')}:</strong> {subset.administrativeDetails
                        .find(d => d.administrativeDetailType === 'ANNOTATION')
                        .values[0] || '-'}</Paragraph>

                    <Title size={3}>{t('Codes')}: </Title>
                    {
                        subset.codes
                            .sort((a,b) => a.rank - b.rank)
                            .map((code, i) =>
                                <p key={i}>{code.rank}. {
                                    URN.toURL(
                                        code.urn,
                                        subset.validFrom.substr(0, 10),
                                        subset.validUntil.substr(0, 10))
                                }</p>)
                    }
                    <Accordion header={t('Raw JSON')}>
                        <pre>{JSON.stringify(subset, null, 4)}</pre>
                    </Accordion>
                </div>
            }
        </div>
    )
};