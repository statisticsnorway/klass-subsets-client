import React, {useContext} from 'react';
import '../../css/pages.css';
import {AppContext} from '../../controllers/context';
import {Navigation, Step} from '../../utils/navigation';
import {SubsetPublish} from './SubsetPublish';
import {SubsetReorder} from './SubsetReorder';
import {SubsetCodes} from './SubsetCodes';
import {SubsetMetadata} from './SubsetMetadata';
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
                <Step label={t('Review and publish')}><SubsetPublish subset={subset} /></Step>
            </Navigation>
        </div>
    );
}


