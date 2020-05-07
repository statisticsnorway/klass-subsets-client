import React, {useEffect, useState} from 'react';
import {Search} from '../../utils/Search';
import {Title} from '@statisticsnorway/ssb-component-library';
import {Classification} from './Classification';
import {useTranslation} from 'react-i18next';
import {useGet} from '../../controllers/klass-api';

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

    useEffect(() => {
        if (!draft.classifications || draft.classifications.length === 0) {
            dispatch({action: 'classifications_from_origin'});
        }
    }, []);

    const [searchValues, setSearchValues] = useState([]); // searchResult listens på Search

    useEffect(() => {
        const result = searchValues
            ? searchValues.map(v => draft.classifications.find(c => c.name === v.name) || v)
            : [];
        setSearchResult(result);
    }, [searchValues]);

    const [searchResult, setSearchResult] = useState([]); // searchResult to interact with users

    useEffect(() => {

        // FIXME: performance issue -- too slow
        // REASON: this will run on each checkbox click.
        // FIX: react differently, targeted to the individual classification

        dispatch({
            action: 'classifications_prepend_included',
            data: searchResult.filter(r => r.included)});
        dispatch({
            action: 'classifications_remove_excluded'
        });
    }, [searchResult]);

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
            <Search resource={classifications ? classifications._embedded.classifications : []}
                    setChosen={(item) => setSearchValues(item)}
                    placeholder={t('Type classification name')}
                    searchBy = {(input, resource) => input === '' ? [] : resource
                            .filter(i => i.name.toLowerCase()
                            .indexOf(input.toLowerCase()) > -1)}
            />

            { searchResult.length < 1
                ? <p>{t('Nothing is found')}</p>
                : <ul className='list'>{searchResult.map((classification, index) =>
                        <li key={index} style={{padding: '5px', width: '600px'}}>
                            <Classification item={classification}
                                            to={to} from={from}
                                            include={(data) => dispatch({
                                                action: 'classifications_include',
                                                data})
                                            }
                                            exclude={(data) => dispatch({
                                                action: 'classifications_exclude',
                                                data})
                                            }
                                            includeCode={(code) => dispatch({
                                                action: 'codes_include',
                                                data: {classification, code}})
                                            }
                                            excludeCode={(code) =>{
                                                dispatch({
                                                    action: 'codes_exclude',
                                                    data: {classification, code}
                                                });
                                            }
                                            }
                        /></li>)}
                </ul>
            }

            <Title size={3}>{t('Choose codes from classifications')}</Title>

            { !draft.classifications || draft.classifications.length < 1
                ? <p>{t('No classifications in the subset draft')}</p>
                : <ul className='list'>{draft.classifications.map((classification, index) =>
                        <li key={index} style={{padding: '5px', width: '600px'}}>
                            <Classification item={classification}
                                            to={to} from={from}
                                            exclude={(data) => dispatch({
                                                action: 'classifications_exclude',
                                                data})
                                            }
                                            includeCode={(code) => dispatch({
                                                action: 'codes_include',
                                                data: {classification, code}})
                                            }
                                            excludeCode={(code) => dispatch({
                                                action: 'codes_exclude',
                                                data: {classification, code}})
                                            }
                                            remove
                            />
                        </li>)}
                </ul>
            }
        </>
    );
};

