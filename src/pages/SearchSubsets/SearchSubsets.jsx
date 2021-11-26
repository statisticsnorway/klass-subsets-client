import React, { useState, useEffect } from 'react';
import { CheckboxGroup, Dropdown } from '@statisticsnorway/ssb-component-library';
import { useTranslation } from 'react-i18next';
import { useSubsets } from 'controllers';
import { BannerList } from 'views';
import { Search, Spinner } from 'components';
import { Sliders } from 'react-feather';
import './search-container.css';

// TODO: split to smaller components
export const SearchSubsets = () => {

    const { t } = useTranslation();
    const [ subsets, errorSubsets ] = useSubsets();
    const [ searchResults, setSearchResults ] = useState([]);
    const [ showSettings, setShowSettings ] = useState(false);

    useEffect(() => setSearchResults(subsets), [ subsets ]);

    const errorMess = () => {
      let urlIndex = errorSubsets?.message.indexOf("http")
      return errorSubsets?.message.substring(0, urlIndex) +"\n" + errorSubsets?.message.substring(urlIndex)
        || subsets?.error?.message
        || subsets?.error
        || subsets?.message
    }

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

                { !subsets && !errorSubsets
                    ? <div style={{ marginTop: '15px' }}><Spinner/></div>
                    : errorSubsets
                        ? <p style={{ color: 'red', whiteSpace: 'pre-wrap' }}>
                            { t('Failed to connect to the server') }{': '}<br/>
                            <div style={{fontSize: 'smaller'}}>{ errorMess() }</div>
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
