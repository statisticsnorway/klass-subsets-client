import React, { useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AppContext } from '../../controllers/context';
import { useGet } from '../../controllers/klass-api';
import { Classification } from '../Classification';
import { eu } from '../../utils/strings';
import { Search } from '../../controllers/Search';
import { URL } from '../../controllers/klass-api';

export const SearchFormContextual = () => {
    const { subset } = useContext(AppContext);
    const { versionValidFrom, versionValidUntil } = subset.draft;
    const { t } = useTranslation();

    // FIXME: more flexible url building based on first response?
    const [ classifications ] = useGet('classifications.json?includeCodelists=true&page=0&size=1000');

    const [ searchResult, setSearchResult ] = useState([]);

    return (
        <>
            <p>
                { t('Search results are restricted by versions validity period')}
                { versionValidFrom || versionValidUntil
                    ? `: ${ t('from') } ${ eu(versionValidFrom) || '...' } ${
                        t('to')} ${ eu(versionValidUntil) || '...' }`
                    : `. ${ t('Period is not set') }.`
                }
            </p>
            <Search resource={ classifications?._embedded?.classifications || []}
                    setChosen={ items => setSearchResult(items) }
                    placeholder={ t('Type classification name') }
                    searchBy ={(input, resource) =>
                        input === ''
                            ? []
                            : resource.filter(i => i.name.toLowerCase().indexOf(input.toLowerCase()) > -1)
                    }
            />

            { !searchResult && searchResult?.length === 0
                ? <p>{ t('Nothing is found') }</p>
                : <ul className='list'>
                    {searchResult
                        .map(c => (c.urn ? c : {...c, urn: URL.toURN(c._links?.self?.href).urn}))
                        .map((c, index) => (
                            <Classification key={ c.urn + index } item={ c } includible />))
                    }
                </ul>
            }
        </>
    );
};