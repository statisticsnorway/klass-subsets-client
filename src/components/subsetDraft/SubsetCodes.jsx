import React, {useState} from 'react';
import {Search} from '../../utils/Search';
import {Title} from '@statisticsnorway/ssb-component-library';
import {Classification} from './Classification';
import {useTranslation} from 'react-i18next';
import {useGet} from '../../controllers/klass-api';
import {URL} from '../../controllers/klass-api';

/*
 *  TODO: (test) mock for service
 *  FIXME: sanitize input
 *  FIXME: notes for codes: restrict period!
 */

export const SubsetCodes = ({subset}) => {

    const {draft, dispatch} = subset;

    // FIXME: more flexible url building based on first response?
    const [classifications] = useGet('classifications.json?includeCodelists=true&page=0&size=1000');

    const { t } = useTranslation();

    const from = draft.validFrom?.substr(0, 10);
    const to = draft.validUntil?.substr(0, 10);
    const origin = draft.administrativeDetails?.find(d => d.administrativeDetailType === 'ORIGIN')?.values;

    const [searchResult, setSearchResult] = useState([]);

    /* TODO: tooltips for classification icons */
    return (<>
            <Title size={3}>{t('Choose classifications and code lists')}</Title>
            <p style={{color:'grey', fontSize:'11px'}}>
                {t('All search results will be restricted by validity period set in metadata')}{
                from && to
                    ? `: ${t('from to', { from, to })}.`
                    : from || to ? `: ${t('at', { date: from || to})}.`
                    : `. ${t('Period is not set')}.`
            }
            </p>
            <Search resource={ classifications?._embedded?.classifications || []}
                    setChosen={ items => setSearchResult(items) }
                    placeholder={t('Type classification name')}
                    searchBy = { (input, resource) => input === '' ? [] : resource
                            .filter(i => i.name.toLowerCase()
                            .indexOf(input.toLowerCase()) > -1)}
            />

            { !searchResult && searchResult?.length === 0
                ? <p>{t('Nothing is found')}</p>
                : <ul className='list'>
                    {searchResult
                    .map(c => (c.urn ? c : {...c, urn: URL.toURN(c._links?.self?.href).urn}))
                    .map((c, index) => (
                        <li key={index} style={{padding: '5px', width: '600px'}}>
                            <Classification item={c} from={from} to={to}
                                            chosenCodes={draft.codes}
                                            chosen={origin.includes(c.urn)}
                                            include={ () => dispatch({
                                                action: 'classifications_include',
                                                data: c.urn})
                                            }
                                            exclude={ () => dispatch({
                                                action: 'classifications_exclude',
                                                data: c.urn})
                                            }
                                            includeCodes={ codes => dispatch({
                                                action: 'codes_include',
                                                data: codes})
                                            }
                                            excludeCodes={ codes => dispatch({
                                                action: 'codes_exclude',
                                                data: codes})
                                            }
                        /></li>))}
                </ul>
            }

            <Title size={3}>{t('Choose codes from classifications')}</Title>

            { draft.codes?.length === 0 && origin?.length === 0
                ? <p>{t('No classifications in the subset draft')}</p>
                : <ul className='list'>
                    {origin.map((urn, index) =>
                        <li key={index} style={{padding: '5px', width: '600px'}}>
                            <Classification item={{urn}}
                                            to={to} from={from}
                                            chosenCodes={draft.codes}
                                            chosen={true}
                                            exclude={ () => dispatch({
                                                action: 'classifications_exclude',
                                                data: urn})
                                            }
                                            includeCodes={ codes => dispatch({
                                                action: 'codes_include',
                                                data: codes})
                                            }
                                            excludeCodes={ codes => dispatch({
                                                action: 'codes_exclude',
                                                data: codes})
                                            }
                                            remove
                            />
                        </li>)}
                </ul>
            }
        </>
    );
};

