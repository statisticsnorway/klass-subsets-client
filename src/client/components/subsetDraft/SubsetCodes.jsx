import React, {useState, useEffect, useContext} from 'react';
import {Search} from '../../utils/Search';
import {AppContext} from '../../controllers/context';
import {Title} from '@statisticsnorway/ssb-component-library';
import {Classification} from './Classification';


/*
 *  TODO: search input style with ssb-component-library
 *  TODO: (test) mock for service
 *  FIXME: sanitize input
 *  FIXME: fails on '(' input and in result string
 *  FIXME: notes for codes !
 */

export const SubsetCodes = ({subset}) => {
    const {classifications} = useContext(AppContext);

    const [searchValues, setSearchValues] = useState([]); // list of classifications
    const [searchResult, setSearchResult] = useState([]); // list of classifications with codes found

    const from = subset.draft.valid.from && subset.draft.valid.from.toISOString().substr(0, 10);
    const to = subset.draft.valid.to && subset.draft.valid.to.toISOString().substr(0, 10);

    function complete(item) {
        let already = subset.draft.classifications.find(classification => classification.name === item.name);
        if (already) {
            return already;
        } else {
            item.included = false;
            fetchCodes(item);
            return item;
        }
    }

    // TODO move to Classification
    // TODO use fallback and loader
    function fetchCodes(classification) {
        if (!from && !to) {
            classification.error = "No validity period or date is set";
            subset.dispatch({action: 'classifications', data: subset.draft.classifications});
            return;
        }
        let url = from && to
            ? `${classification._links.self.href}/codes.json?from=${from},to=${to}`
            : `${classification._links.self.href}/codesAt.json?date=${from || to}`;

        fetch(url)
            .then(response => response.json(url))
            .then(data => {
                classification.codes = data.codes;
                classification.error = null;
                subset.dispatch({action: 'classifications', data: subset.draft.classifications});
            })
            .catch(e => {
                classification.error = e.message;
                subset.dispatch({action: 'classifications', data: subset.draft.classifications});
            });
    }

    // FIXME make fetch in background !!!
    useEffect(() => {
        const result = searchValues
            ? searchValues.map(item => complete(item))
            : [];
        setSearchResult(result);
    }, [searchValues]);

    /* TODO: tooltips for classification icons */
    return (<>
            <Title size={3}>Choose classifications and code lists</Title>
            <p style={{color:'grey', fontSize:'11px'}}>
                All search results will be restricted by validity period set in metadata{
                from && to
                    ? `: from ${from} to ${to}.`
                    : from || to ? `: at ${from || to}.`
                    : '. Period is not set.'
            }
            </p>
            <Search resource={classifications ? classifications._embedded.classifications : []}
                    setChosen={(item) => setSearchValues(item)}
                    placeholder='Type classification name'
                    searchBy = {(input, resource) =>
                        input === '' ? [] : resource.filter(i => i.name.toLowerCase().search(input.toLowerCase()) > -1)}
            />

            {searchResult.length < 1 ? <p>Nothing is found</p>
                : <ul className='list'>{searchResult.map((classification, index) =>
                        <li key={index} style={{padding: '5px', width: '600px'}}>
                            <Classification item={classification}
                                            update={() => setSearchResult([...searchResult])}
                                            remove={() => setSearchResult(searchResult.filter(i => i !== classification))}
                                            add={() => {classification.included
                                                ? subset.dispatch({
                                                        action: 'classifications', data: subset.draft.classifications.concat(classification)})
                                                : subset.dispatch({
                                                        action: 'classifications', data: subset.draft.classifications.filter(i => i !== classification)})
                                            }}
                        /></li>)}
                </ul>
            }

            <Title size={3}>Choose codes from classifications</Title>

            {/* TODO: show more data on item component (info block, date, etc?) */}
            {/* TODO: select all , invert selection , unselect all */}

            { !subset.draft.classifications || subset.draft.classifications.length < 1
                ? <p>No classifications in the subset draft</p>
                : <ul className='list'>{subset.draft.classifications.map((classification, index) =>
                        <li key={index} style={{padding: '5px', width: '600px'}}>
                            <Classification item={classification} checkbox
                                            update={() => setSearchResult([...searchResult])}
                                            add={() => {
                                                classification.included
                                                ? subset.dispatch({
                                                        action: 'classifications', data: subset.draft.classifications.concat(classification)})
                                                : subset.dispatch({
                                                        action: 'classifications', data: subset.draft.classifications.filter(i => i !== classification)})
                                            }}
                                            remove={() => {
                                                subset.dispatch({
                                                    action: 'classifications', data: subset.draft.classifications.filter(i => i !== classification)});
                                                setSearchResult([...searchResult]);
                                            }}/>
                        </li>)}
                </ul>
            }
        </>
    );
};

