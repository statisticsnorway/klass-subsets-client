import React from 'react';
import '../../css/pages.css';
import {Input} from '@statisticsnorway/ssb-component-library';
import {useTranslation} from 'react-i18next';


export default function SearchSubsetsPage() {

    const { t } = useTranslation();

    return (
        <div className='page'>
            <h3>{t('Search subsets')}</h3>
            {/*TODO: asap*/}
            <Input
                ariaLabel={t('Search subsets')}
                placeholder={t('Subset title')}
                searchField
            />
            <h3>{t('Search results')}</h3>
        </div>
    );
}