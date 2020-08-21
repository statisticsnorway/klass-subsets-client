import React, {useContext} from 'react';
import '../../css/pages.css';
import {AppContext} from '../../controllers/context';
import {Navigation, Step} from './navigation';
import {Step_1_Metadata} from './Step_1_Metadata';
import {Step_2_Versions} from './Step_2_Versions';
import {Step_3_ChooseCodes} from './Step_3_ChooseCodes';
import {Step_4_Reorder} from './Step_4_Reorder';
import {Step_5_Publish} from './Step_5_Publish';
import {useTranslation} from 'react-i18next';

export default function SubsetForm() {
    const {subset} = useContext(AppContext);
    const { t } = useTranslation();

    return (
        <div className='page'>
            <Navigation>
                <Step label={t('Metadata')}><Step_1_Metadata/></Step>
                <Step label={t('Versions')}>
                    <Step_2_Versions subset={subset} />
                </Step>
                <Step label={t('Choose codes')}>
                    <Step_3_ChooseCodes subset={subset} />
                </Step>
                <Step label={t('Reorder codes')}>
                    <Step_4_Reorder subset={subset} />
                </Step>
                <Step label={t('Review and publish')}>
                    <Step_5_Publish subset={subset} />
                </Step>
            </Navigation>
        </div>
    );
}


