import React, {useState, useEffect} from 'react';
import '../../css/pages.css';
import {Dropdown, Paragraph, Title} from '@statisticsnorway/ssb-component-library';
import {useTranslation} from 'react-i18next';
import {useGet} from '../../controllers/subsets-service';
import {Subsets} from '../Subset';
import {Search} from '../../controllers/Search';
import Spinner from "../Spinner";

export default function SearchSubsetsPage() {

    const { t } = useTranslation();
    const [subsets, isLoadingSubsets] = useGet('');
    const [searchResults, setSearchResults] = useState([]);


    useEffect(() => setSearchResults(subsets), [subsets]);

    return (
        <div className='page'>
            <Title size={2}>{t('Search subsets')}</Title>

            <Search resource={subsets || []}
                    setChosen={(item) => setSearchResults(item)}
                    placeholder={t('Subset name')}
                    searchBy = {(input, resource) => input === '' ? subsets : resource
                            .filter(i => i.name[0].languageText.toLowerCase()
                                .indexOf(input.toLowerCase()) > -1)}
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

            {isLoadingSubsets
                ? <div style={{marginTop: '15px'}}><Spinner/></div>
                : !searchResults || searchResults.length === 0
                    ? <Paragraph>{t('Nothing is found')}</Paragraph>
                    : <Subsets items={searchResults
                        .sort((a,b) => (a.lastUpdatedDate === b.lastUpdatedDate
                            ? 0
                            : a.lastUpdatedDate > b.lastUpdatedDate ? -1 : 1))} />
            }
        </div>
    );
}