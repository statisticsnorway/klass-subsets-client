import React from 'react';
import '../../css/pages.css';
import {Input} from '@statisticsnorway/ssb-component-library';
import {useTranslation} from 'react-i18next';
import {useGet} from '../../controllers/subsets-service';
import {Subsets} from '../Subset';

export default function SearchSubsetsPage() {

    const { t } = useTranslation();
    const [subsets] = useGet('');

    return (
        <div className='page'>
            <h3>{t('Search subsets')}</h3>
            <Input
                ariaLabel={t('Search subsets')}
                placeholder={t('Subset title')}
                searchField
            />
            <h3>{t('Search results')}</h3>
            {!subsets
                ? <p>{t('Loading...')}</p>
                : <Subsets items={subsets.sort((a,b) => (a.lastUpdatedDate - b.lastUpdatedDate))} />}
        </div>
    );
}