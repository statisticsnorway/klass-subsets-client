import React, {useState} from 'react';
import {Search} from '../../controllers/Search';
import {Title} from '@statisticsnorway/ssb-component-library';
import {Classification} from './Classification';
import {useTranslation} from 'react-i18next';
import {useGet} from '../../controllers/klass-api';
import {URL} from '../../controllers/klass-api';
import '../../css/list.css';

/*
 *  TODO: (test) mock for service
 *  FIXME: sanitize input
 */

export const ChooseCodesFormStep = ({subset}) => {

    const {draft, dispatch} = subset;

    // FIXME: more flexible url building based on first response?
    const [classifications] = useGet('classifications.json?includeCodelists=true&page=0&size=1000');

    const { t } = useTranslation();

    const from = draft.versionValidFrom?.substr(0, 10) || draft.validFrom?.substr(0, 10);
    const to = draft.versionValidUntil?.substr(0, 10) || draft.validUntil?.substr(0, 10);
    const origin = draft.administrativeDetails?.find(d => d.administrativeDetailType === 'ORIGIN')?.values;

    const [searchResult, setSearchResult] = useState([]);

    /* TODO: tooltips for classification icons */
    return (<>
            <Title size={3}>{t('Choose classifications and code lists')}</Title>
            <p style={{color:'grey', fontSize:'11px'}}>
                {t('All search results will be restricted by validity period set for the version')}{
                from || to
                    ? from && to
                        ? `: ${t('from to', { from, to })}.`
                        : from
                            ? `: ${t('from', { from })}.`
                            : `: ${t('to', { to })}.`
                    : `: ${t('at', { date: new Date().toISOString().substr(0, 10)})}. ${t('Period is not set')}.`
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
                        />))}
                </ul>
            }

            <Title size={3}>{t('Choose codes from classifications')}</Title>

            { draft.codes?.length === 0 && origin?.length === 0
                ? <p>{t('No classifications in the subset draft')}</p>
                : <ul className='list'>
                    {origin
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
                            />)}
                </ul>
            }
        </>
    );
};

