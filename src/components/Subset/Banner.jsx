import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { AppContext } from '../../controllers/context';
import { Link as SsbLink } from '@statisticsnorway/ssb-component-library';
import { Brief, Id, Description } from '../Subset';
import { Edit } from 'react-feather';

export const Banner = ({ data }) => {
    const { t } = useTranslation();
    let history = useHistory();
    const { subset } = useContext(AppContext);

    // FIXME: translate placeholders
    // TODO: smart language choice
    return (
        <div style={{margin: '50px 0'}}>
            <SsbLink href={ `/subsets/${data?.id}` }
                     linkType='profiled'>
                { data?.name?.find(name => name.languageCode === 'nb')?.languageText
                || t('No name')
                }
            </SsbLink>
            <Edit style={{
                color: '#ED5935',
                margin: '0 10px',
                cursor: 'pointer'
            }}
                  onClick={() => {
                      subset.dispatch({ action: 'edit', data });
                      history.push('/create');
                  }}/>
            <Brief
                id={ <Id>{ data?.id || '-' }</Id> }
                versionValidFrom={ data?.versionValidFrom }
                lastModified={ data?.lastModified }
                status={ t(data?.administrativeStatus) }
            />
            <Description text={
                data?.description?.find(
                desc => desc.languageCode === 'nb')?.languageText
                || t('No description')
            }/>
        </div>
    );
};

