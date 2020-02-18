import React from 'react';
import '../../css/pages.css';
import {Input} from '@statisticsnorway/ssb-component-library';
import {useTranslation} from 'react-i18next';


export default function SearchSubsetsPage() {

    const { t, i18n } = useTranslation();

    return (
        <div className='page'>
            <h3>{t('Search subsets')}</h3>
            {/*TODO: asap*/}
            <Input
                ariaLabel="Input field Search"
                placeholder="Search text"
                searchField
            />
            <h3>Search results</h3>
        </div>
    );
}