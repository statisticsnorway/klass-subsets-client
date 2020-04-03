import React, {useState, useEffect} from 'react';
import '../../css/pages.css';
import {Input, Dropdown} from '@statisticsnorway/ssb-component-library';
import {useTranslation} from 'react-i18next';
import {useGet} from '../../controllers/subsets-service';
import {Subsets} from '../Subset';
import {Search} from "../../utils/Search";

export default function SearchSubsetsPage() {

    const { t } = useTranslation();
    const [subsets] = useGet('');
    useEffect(() => setSearchValues(subsets), [subsets]);

    const [searchValues, setSearchValues] = useState([]);

    return (
        <div className='page'>
            <h3>{t('Search subsets')}</h3>

            <Search resource={subsets || []}
                    setChosen={(item) => setSearchValues(item)}
                    placeholder={t('Subset name')}
                    searchBy = {(input, resource) => input === '' ? subsets : resource
                            .filter(i => i.name[0].languageText.toLowerCase()
                                .search(input.toLowerCase()) > -1)}
                    searchible = {(item) => item[0].languageText}/>

            <h3>{t('Search results')}</h3>
            <Dropdown
                header={t('Sort by')}
                selectedItem={{ title: t('Last updated'), id: 'Last' }}
                items={[
                    { title: t('Last updated'), id: 'last' },
                    { title: t('Subset name'), id: 'name' },
                    { title: t('Owner'), id: 'owner' },
                    { title: t('Valid to'), id: 'validto' },
                ]}
            />
            {!searchValues
                ? <p>{t('Loading...')}</p>
                : <Subsets items={searchValues
                    .sort((a,b) => (a.lastUpdatedDate === b.lastUpdatedDate ? 0
                    : a.lastUpdatedDate > b.lastUpdatedDate ? -1 : 1))} />}
        </div>
    );
}