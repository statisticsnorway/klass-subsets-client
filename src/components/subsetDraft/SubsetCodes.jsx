import React, {useContext, useEffect, useState} from 'react';
import {Search} from '../../utils/Search';
import {AppContext} from '../../controllers/context';
import {Title} from '@statisticsnorway/ssb-component-library';
import {Classification} from './Classification';
import {useTranslation} from "react-i18next";


/*
 *  TODO: (test) mock for service
 *  FIXME: sanitize input
 *  FIXME: fails on '(' input and in result string
 *  FIXME: notes for codes !
 */

export const SubsetCodes = ({subset}) => {
    const {classifications} = useContext(AppContext);
    const { t } = useTranslation();

    const from = subset.draft.valid.from && subset.draft.valid.from.toISOString().substr(0, 10);
    const to = subset.draft.valid.to && subset.draft.valid.to.toISOString().substr(0, 10);

    const [searchValues, setSearchValues] = useState([]); // list of classification names
    const [searchResult, setSearchResult] = useState([]); // list of classifications with codes found

    useEffect(() => {
        const result = searchValues
            ? searchValues.map(v => subset.draft.classifications.find(c => c.name === v.name) || v)
            : [];
        setSearchResult(result);
    }, [searchValues]);

    useEffect(() => {
        subset.dispatch({
            action: 'classifications_prepend_included',
            data: searchResult.filter(r => r.included)});
        subset.dispatch({
            action: 'classifications_remove_excluded'
        })
    }, [searchResult]);

    /* TODO: tooltips for classification icons */
    return (<>
            <Title size={3}>Choose classifications and code lists</Title>
            <p style={{color:'grey', fontSize:'11px'}}>
                {t('All search results will be restricted by validity period set in metadata')}{
                from && to
                    ? `: ${t('from to', { from: from, to: to })}.`
                    : from || to ? `: ${t('at', { date: from || to})}.`
                    : `. ${t('Period is not set')}.`
            }
            </p>
            <Search resource={classifications ? classifications._embedded.classifications : []}
                    setChosen={(item) => setSearchValues(item)}
                    placeholder={t('Type classification name')}
                    searchBy = {(input, resource) =>
                        input === '' ? [] : resource
                            .filter(i => i.name.toLowerCase()
                            .search(input.toLowerCase()) > -1)}
            />

            { searchResult.length < 1
                ? <p>{t('Nothing is found')}</p>
                : <ul className='list'>{searchResult.map((classification, index) =>
                        <li key={index} style={{padding: '5px', width: '600px'}}>
                            <Classification item={classification}
                                            to={to} from={from}
                                            update={() => setSearchResult([...searchResult])}
                        /></li>)}
                </ul>
            }

            <Title size={3}>{t('Choose codes from classifications')}</Title>

            { !subset.draft.classifications || subset.draft.classifications.length < 1
                ? <p>{t('No classifications in the subset draft')}</p>
                : <ul className='list'>{subset.draft.classifications.map((classification, index) =>
                        <li key={index} style={{padding: '5px', width: '600px'}}>
                            <Classification item={classification}
                                            to={to} from={from}
                                            update={() => setSearchResult([...searchResult])}
                                            remove={() => {
                                                classification.included = false;
                                                setSearchResult([...searchResult]);
                                            }}/>
                        </li>)}
                </ul>
            }
        </>
    );
};

