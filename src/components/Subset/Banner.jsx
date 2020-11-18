import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { AppContext } from '../../controllers/context';
import { Link as SsbLink } from "@statisticsnorway/ssb-component-library";
import { Brief } from './Brief';
import { Id } from './Id';
import { Edit } from 'react-feather';

export const SubsetBanner = ({ subsetData }) => {
    const { t } = useTranslation();
    let history = useHistory();
    const { subset } = useContext(AppContext);

    // FIXME: translate placeholders
    // TODO: smart language choice
    return (
        <div style={{margin: '50px 0'}}>
            <SsbLink href={ `/subsets/${subsetData?.id}` }
                     linkType='profiled'>
                { subsetData?.name?.find(name => name.languageCode === 'nb')?.languageText
                || t('No name')
                }
            </SsbLink>
            <Edit style={{
                color: '#ED5935',
                margin: '0 10px',
                cursor: 'pointer'
            }}
                  onClick={() => {
                      subset.dispatch({ action: 'edit', data: subsetData });
                      history.push('/create');
                  }}/>
            <p style={{fontSize: 'calc(10px + 0.3vmin)'}}>
                <Brief
                    id={ <Id>{ subsetData?.id || '-' }</Id> }
                    versionValidFrom={ subsetData?.versionValidFrom }
                    lastUpdatedDate={ subsetData?.lastUpdatedDate }
                    status={ t(subsetData?.administrativeStatus) }
                />
            </p>
            <p style={{ fontSize: 'calc(10px + 0.8vmin)', margin: '-5px 0' }}>
                { subsetData?.description?.find(
                    desc => desc.languageCode === 'nb')?.languageText
                || t('No description')
                }
            </p>
        </div>
    );
};

