import React, { useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AppContext } from 'controllers';
import { useKlassGet } from 'controllers/klass-api';
import { CodeListFetcher } from 'views';
import { eu } from 'utils';
import { Search, Help, HelpButton, ListTable } from 'components';

export const SearchCodeLists = () => {
    const { subset: {
        draft: {
            versionValidFrom,
            versionValidUntil
        }
    }} = useContext(AppContext);
    const { t } = useTranslation();

    // FIXME: more flexible url building based on first response?
    const [ classifications ] = useKlassGet('classifications.json?includeCodelists=true&page=0&size=1000');
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

            <h3>{ t('Search results') }
              <HelpButton
                title={ t('Help search results') }
                clickHandler={ () => setShowHelp(prev => !prev) } />
            </h3>
            <Help visible={ showHelp}
                  message={`${ t('Search results are restricted by versions validity period')} ${ 
                    eu(versionValidFrom) || '...' } - ${ 
                    eu(versionValidUntil) || '...' }`
            }/>

            <ListTable items={ searchResult.map(s => ({ id: s.id })) }
                       placeholder={ t('Nothing is found') }
                       component={ CodeListFetcher }
            />
        </>
    );
};
