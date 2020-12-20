import React, { useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AppContext } from 'controllers';
import { useGet, URL } from 'controllers/klass-api';
import { CodeListFetcher } from 'components/Classification';
import { eu } from 'utils';
import { Search, Help, HelpButton, ListTabable } from 'components';

export const SearchFormContextual = () => {
    const { subset: {
        draft: {
            versionValidFrom,
            versionValidUntil
        }
    }} = useContext(AppContext);
    const { t } = useTranslation();

    // FIXME: more flexible url building based on first response?
    const [ classifications ] = useGet('classifications.json?includeCodelists=true&page=0&size=1000');
    const [ searchResult, setSearchResult ] = useState([]);
    const [ showHelp, setShowHelp ] = useState(false);

    return (
        <>
            <h3>{ t('Search code lists by name') }</h3>
            <Search resource={ classifications?._embedded?.classifications || []}
                    setChosen={ items => setSearchResult(items) }
                    placeholder={ t('Type classification name') }
                    searchBy ={(input, resource) =>
                        input === ''
                            ? []
                            : resource.filter(i => i.name.toLowerCase().indexOf(input.toLowerCase()) > -1)
                    }
            />

            <h3>{ t('Search results') }<HelpButton
                clickHandler={ () => setShowHelp(prev => !prev) } />
            </h3>
            <Help visible={ showHelp}
                  message={`${ t('Search results are restricted by versions validity period')} ${ 
                    eu(versionValidFrom) || '...' } - ${ 
                    eu(versionValidUntil) || '...' }`
            }/>

            <ListTabable items={ searchResult.map(s => ({ id: URL.info(s._links?.self?.href).id })) }
                             placeholder={ t('Nothing is found') }
                             component={ CodeListFetcher }
            />
        </>
    );
};
