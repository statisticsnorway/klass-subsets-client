import React from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { Link as SsbLink } from '@statisticsnorway/ssb-component-library';
import { BriefMetadata } from 'views';
import { EditButton } from 'components';

export const Banner = ({ data }) => {
    const { t } = useTranslation();
    let history = useHistory();

    // FIXME: translate placeholders
    // TODO: smart language choice
    return (
        <div style={{ margin: '50px 0' }}>
            <SsbLink href={ `/subsets/${data?.id}` }
                     linkType='profiled'>
                { data?.name?.find(name => name.languageCode === 'nb')?.languageText
                || t('No name')
                }
            </SsbLink>
            <EditButton disabled={ !data?.id }
                        clickHandler={() => history.push(`/editor?subsetId=${ data?.id }`)}
            />
            <BriefMetadata
                id={ data?.id }
                created={ data?.createdDate }
                lastModified={ data?.lastModified }
                available={ data?.versions?.length }
            />
            <p>{
                data?.description?.find(desc => desc.languageCode === 'nb')?.languageText
                || t('No description')
            }</p>
        </div>
    );
};

