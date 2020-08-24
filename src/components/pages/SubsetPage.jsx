import React, { useContext } from 'react';
import { Accordion, Paragraph, Title } from '@statisticsnorway/ssb-component-library';
import { useTranslation } from 'react-i18next';
import { useHistory, useParams } from 'react-router-dom';
import { useGet } from '../../controllers/subsets-service';
import { Code } from '../Code';
import { Edit } from 'react-feather';
import { AppContext } from '../../controllers/context';
import Spinner from '../Spinner';
import { Brief, Id } from '../SubsetBrief';

export const SubsetPage = () => {
    const { t } = useTranslation();

    let { id } = useParams();
    let history = useHistory();
    const {subset} = useContext(AppContext);

    const [subsetData, isLoadingSubsetData] = useGet(id);

    // FIXME: translate placeholders
    // TODO: smart language choice
    return(
        <div className='page'>
            {isLoadingSubsetData
                ? <div style={{margin: 'auto', width: '20%'}}><Spinner/></div>
                : !subsetData
                    ? <p>{t('Subset with id does not exist', {id})}.</p>
                    : <div>
                        <Title size={3}>
                            {subsetData.name?.find(name => name.languageCode === 'nb')?.languageText || t('No name')}
                            <Edit
                                style={{
                                    color: '#ED5935',
                                    margin: '0 10px',
                                    cursor: 'pointer'
                                }}
                                onClick={() => {
                                    subset.dispatch({action: 'edit', data: subsetData});
                                    history.push('/create');
                                }}/>
                        </Title>
                        <Brief
                            id={<Id>{subsetData?.id || '-'}</Id>}
                            version={subsetData?.version}
                            lastUpdatedDate={subsetData?.lastUpdatedDate}
                            status={subsetData?.administrativeStatus}
                        />
                        <Paragraph style={{fontSize: 'calc(10px + 0.8vmin)'}}>{subsetData.description?.find(
                            desc => desc.languageCode === 'nb')?.languageText || t('No description')}
                        </Paragraph>

                        <Paragraph>
                            <strong>{t('Owner')}:</strong> {subsetData.createdBy || '-'}
                        </Paragraph>
                        <Paragraph>
                            <strong>{t('Valid from')}:</strong> {subsetData.validFrom?.substr(0, 10) || '-'}
                        </Paragraph>
                        <Paragraph>
                            <strong>{t('Valid to')}:</strong> {subsetData.validUntil?.substr(0, 10)  || '-'}
                        </Paragraph>
                        <Paragraph>
                            <strong>{t('Subject')}:</strong> {subsetData.subject || '-'}
                        </Paragraph>

                        <Title size={3}>{t('Codes')}: </Title>
                        { subsetData.codes
                            ? subsetData.codes
                                .sort((a,b) => a.rank - b.rank)
                                .map((code, i) =>
                                    <Code key={i}
                                          origin={{
                                              ...code,
                                              validFromInRequestedRange: subsetData.versionValidFrom?.substr(0, 10),
                                              validToInRequestedRange: subsetData.validUntil?.substr(0, 10)
                                          }}
                                    />)
                            : []
                        }
                        <Accordion header={t('Raw JSON')}>
                            <pre>{JSON.stringify(subsetData, null, 4)}</pre>
                        </Accordion>
                    </div>
            }
        </div>
    );
};