import React, {useContext} from 'react';
import '../../css/pages.css';
import {AppContext} from '../../controllers/context';
import {Navigation, Step} from './navigation';
import {PublishFormStep} from './PublishFormStep';
import {ReorderFormStep} from './ReorderFormStep';
import {ChooseCodesFormStep} from './ChooseCodesFormStep';
import {MetadataFormStep} from './MetadataFormStep';
import {useTranslation} from "react-i18next";

export default function SubsetForm() {
    const {subset} = useContext(AppContext);
    const { t } = useTranslation();

    return (
        <div className='page'>
            <Navigation>
                <Step label={t('Metadata')}>
                    <MetadataFormStep subset={subset} />
                </Step>
                <Step label={t('Choose codes')}>
                    <ChooseCodesFormStep subset={subset} />
                </Step>
                <Step label={t('Reorder codes')}>
                    <ReorderFormStep subset={subset} />
                </Step>
                <Step label={t('Review and publish')}>
                    <PublishFormStep subset={subset} />
                </Step>
            </Navigation>
        </div>
    );
}


