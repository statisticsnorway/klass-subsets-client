import React, { useContext, useState } from 'react';
import { Search } from '../../controllers/Search';
import { Title, Paragraph } from '@statisticsnorway/ssb-component-library';
import { Classification } from './Classification';
import { useTranslation } from 'react-i18next';
import { useGet } from '../../controllers/klass-api';
import { URL } from '../../controllers/klass-api';
import './list.css';
import { SubsetBrief } from '../Subset/SubsetBrief';
import { AppContext } from '../../controllers/context';
import { eu } from '../../utils/strings';

export const Step3ChooseCodes = () => {
    const { t } = useTranslation();

    /* TODO: tooltips for classification icons */
    return (<>
            <Title size={3}>{t('Choose classifications and code lists')}</Title>
            <SubsetBrief />
            <SearchForm />
            <IncludedCodeLists/>
        </>
    );
};

export const SearchForm = () => {
    const { subset } = useContext(AppContext);
    const { versionValidFrom, versionValidUntil } = subset.draft;
    const { t } = useTranslation();

    // FIXME: more flexible url building based on first response?
    const [ classifications ] = useGet('classifications.json?includeCodelists=true&page=0&size=1000');

    const [ searchResult, setSearchResult ] = useState([]);

    return (
        <>
            <Paragraph>
                { t('Search results are restricted by versions validity period')}
                { versionValidFrom || versionValidUntil
                    ? `: ${ t('from') } ${ eu(versionValidFrom) || '...' } ${
                            t('to')} ${ eu(versionValidUntil) || '...' }`
                    : `. ${ t('Period is not set') }.`
                }
            </Paragraph>
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
                ? <p>{t('Nothing is found')}</p>
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

export const IncludedCodeLists = () => {
    const { subset } = useContext(AppContext);
    const { t } = useTranslation();

    return (
        <>
            <Title size={3}>{t('Choose codes from classifications')}</Title>

            { subset.draft.origin?.length === 0
                ? <p>{t('No classifications in the subset draft')}</p>
                : <ul className='list'>
                    { subset.draft.origin
                        .map((urn, index) => <Classification key={urn + index} item={{urn}}/>)
                    }
                </ul>
            }
        </>
    );
};