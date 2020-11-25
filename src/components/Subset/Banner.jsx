import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { AppContext } from '../../controllers/context';
import { Link as SsbLink } from "@statisticsnorway/ssb-component-library";
import { Brief } from './Brief';
import { Id } from './Id';
import { Edit } from 'react-feather';
import { Description } from './Description';

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
            <Brief
                id={ <Id>{ subsetData?.id || '-' }</Id> }
                versionValidFrom={ subsetData?.versionValidFrom }
                lastModified={ subsetData?.lastModified }
                status={ t(subsetData?.administrativeStatus) }
            />
            <Description text={
                subsetData?.description?.find(
                desc => desc.languageCode === 'nb')?.languageText
                || t('No description')
            }/>
        </div>
    );
};
