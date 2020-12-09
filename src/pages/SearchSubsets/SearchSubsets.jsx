import React, { useState, useEffect } from 'react';
import {CheckboxGroup, Dropdown} from '@statisticsnorway/ssb-component-library';
import { useTranslation } from 'react-i18next';
import { useGet } from '../../controllers/subsets-service';
import { BannerList } from '../../components/Subset';
import { Search } from '../../controllers/Search';
import { Spinner } from '../../components/Spinner';
import { Sliders } from 'react-feather';
import './search-container.css';

export const SearchSubsets = () => {

    const { t } = useTranslation();
    const [ subsets, isLoadingSubsets, errorSubsets ] = useGet('');
    const [ searchResults, setSearchResults ] = useState([]);
    const [ showSettings, setShowSettings ] = useState(false);

    useEffect(() => setSearchResults(subsets), [subsets]);

    return (
        <div id='search-container'>
            <div id='search-zone'>
                <h2>{ t('Search subsets') }</h2>

                <Search resource={ subsets || [] }
                        setChosen={ (item) => setSearchResults(item) }
                        placeholder={ t('Subset name') }
                        searchBy={ (input, resource) => input === '' ? subsets : resource
                            .filter(i => i.name[0].languageText.toLowerCase()
                                .indexOf(input.toLowerCase()) > -1) }
                        searchible={ (item) => item[0].languageText}/>

            </div>
            <div id='results'>
                <h2>{ t('Search results') }

                    <button aria-label='Set up result filtering and sorting'
                            title='Filters'
                            onClick={ () => setShowSettings(!showSettings) }
                        ><Sliders size='20' color='#62919A'/>
                    </button>
                </h2>
                { showSettings &&
                    <>
                        <Dropdown
                            header={ t('Sort by') }
                            selectedItem={{ title: t('Last updated'), id: 'Last' }}
                            items={[
                                { title: t('Last updated'), id: 'last' },
                                { title: t('Subset name'), id: 'name' },
                                { title: t('Owner'), id: 'owner' },
                                { title: t('Valid to'), id: 'validto' },
                            ]}
                        />
                        <CheckboxGroup
                            header={ t('Filters') }
                            onChange={() => {}}
                            orientation='column'
                            selectedValue='includeFuture'
                            items={[
                                { label: 'includeFuture', value: 'includeFuture' },
                                { label: 'includeDrafts', value: 'includeDrafts' },
                                { label: 'includeDeprecated', value: 'includeDeprecated' }
                            ]}
                        />
                    </>
                }

                    { isLoadingSubsets
                        ? <div style={{ marginTop: '15px' }}><Spinner/></div>
                        : errorSubsets || subsets?.error
                            ? <p style={{ color: 'red' }}>{ t('Failed to connect to the server: ') }{
                                errorSubsets?.message
                                || subsets?.error?.message
                                || subsets?.error
                                || subsets?.message}
                            </p>
                            : !searchResults || searchResults.length === 0
                                ? <p>{ t('Nothing is found') }</p>
                                : <BannerList items={ searchResults
                                    .sort((a,b) => (a.lastModified === b.lastModified
                                        ? 0
                                        : a.lastModified > b.lastModified ? -1 : 1))} />
                    }

            </div>
        </div>
    );
}