import React, {useContext, useState} from 'react';
import { Search } from '../../controllers/Search';
import { Title, Paragraph } from '@statisticsnorway/ssb-component-library';
import { Classification } from './Classification';
import { useTranslation } from 'react-i18next';
import { useGet } from '../../controllers/klass-api';
import { URL } from '../../controllers/klass-api';
import '../../css/list.css';
import { SubsetBrief } from '../SubsetBrief';
import {AppContext} from '../../controllers/context';

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
    const { draft, dispatch } = subset;
    const { t } = useTranslation();

    // FIXME: more flexible url building based on first response?
    const [classifications] = useGet('classifications.json?includeCodelists=true&page=0&size=1000');
    const [searchResult, setSearchResult] = useState([]);

    const from = draft.versionValidFrom?.substr(0, 10)
    const to = draft.versionValidUntil?.substr(0, 10)

    return (
        <>
            <Paragraph>
                { t('Search results are restricted by versions validity period')}
                { from || to
                    ? `: ${ t('from') } ${ from || '...' } ${t('to')} ${ to || '...' }`
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
                            <Classification
                                key={c.urn + index}
                                item={c}
                                from={from} to={to}
                                chosenCodes={draft.codes}
                                chosen={origin.includes(c.urn)}
                                include={() => dispatch({
                                    action: 'codelist_include',
                                    data: c.urn
                                })}
                                exclude={() => dispatch({
                                    action: 'codelist_exclude',
                                    data: c.urn
                                })}
                                includeCodes={codes => dispatch({
                                    action: 'codes_include',
                                    data: codes
                                })}
                                excludeCodes={codes => dispatch({
                                    action: 'codes_exclude',
                                    data: codes
                                })}
                                disabled={draft.administrativeStatus === 'OPEN'}
                            />))}
                </ul>
            }
        </>
    );
};

export const IncludedCodeLists = () => {
    const {subset} = useContext(AppContext);
    const {draft, dispatch} = subset;
    const {t} = useTranslation();

    const from = draft.versionValidFrom?.substr(0, 10)
    const to = draft.versionValidUntil?.substr(0, 10)

    return (
        <>
            <Title size={3}>{t('Choose codes from classifications')}</Title>

            { draft.codes?.length === 0 && draft.origin?.length === 0
                ? <p>{t('No classifications in the subset draft')}</p>
                : <ul className='list'>
                    {draft.origin
                        .map((urn, index) =>
                            <Classification
                                key={urn + index}
                                item={{urn}}
                                to={to} from={from}
                                chosenCodes={draft.codes}
                                chosen={true}
                                exclude={() => dispatch({
                                    action: 'codelist_exclude',
                                    data: urn
                                })}
                                includeCodes={codes => dispatch({
                                    action: 'codes_include',
                                    data: codes
                                })}
                                excludeCodes={codes => dispatch({
                                    action: 'codes_exclude',
                                    data: codes
                                })}
                                disabled={draft.administrativeStatus === 'OPEN'}
                            />)}
                </ul>
            }
        </>
    );
};