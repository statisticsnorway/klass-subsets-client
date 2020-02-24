import React, {useContext, useEffect} from 'react';
import '../../css/pages.css';
import {AppContext} from '../../controllers/context';
import {Navigation, Step} from '../../utils/navigation';
import {SubsetReorder} from './SubsetReorder';
import {SubsetCodes} from './SubsetCodes';
import {SubsetMetadata} from './SubsetMetadata';
import {Button, Title} from '@statisticsnorway/ssb-component-library';
import {Subset} from '../Subset';
import {useTranslation} from "react-i18next";

export default function SubsetForm() {
    const {subset} = useContext(AppContext);
    const { t } = useTranslation();

    return (
        <div className='page'>
            <Navigation>
                <Step label={t('Metadata')}><SubsetMetadata subset={subset} /></Step>
                <Step label={t('Choose codes')}><SubsetCodes subset={subset} /></Step>
                <Step label={t('Reorder codes')}><SubsetReorder subset={subset} /></Step>
                <Step label={t('Review and publish')}><SubsetPreview subset={subset} /></Step>
            </Navigation>
        </div>
    );
}

// TODO: better preview (human pleasant)
export const SubsetPreview = ({subset}) => {
    const { t } = useTranslation();

    useEffect(() => subset.dispatch({action: 'remove_empty'}), []);

    return (
        <>
            <Title size={3}>{t('Review and publish')}</Title>
            <Subset subset={subset.draft}/>
            <Button onClick={() =>
                console.log('Publish subset: ', subset.draft)}>{t('Publish')}</Button>
            <br/><br/>
        </>
    );
};

