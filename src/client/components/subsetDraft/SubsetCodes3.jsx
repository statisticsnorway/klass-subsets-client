import React, {useState, useEffect, useContext} from 'react';
import {Search} from '../../utils/Search';
import {AppContext} from '../../controllers/context';
import {Title} from '@statisticsnorway/ssb-component-library';
import { PlusSquare, Trash2, Info, List as ListIcon, AlertTriangle as Alert } from 'react-feather';
import {Classification} from "../Subset";

export const SubsetCodes = ({subset}) => {
    // FIXME: sanitize input
    // FIXME: fails on '(' input and in result string

    const {classifications} = useContext(AppContext);

    const [searchValues, setSearchValues] = useState([]); // list of classifications
    const [searchResult, setSearchResult] = useState([]); // list of classifications with codes found
    const [codes, setCodes] = useState(subset.draft.codes); // list of classifications with codes included into the subset

    function complete(item) {
        let already = codes.find(code => code.title === item.name);
        if (already) {
            return already;
        } else {
            item.title = item.name;
            item.included = false;
            fetchCodes(item);
            return item;
        }
    }

    // FIXME: update state when done!
    // FIXME: parse the date !!!
    // FIXME: if both dates are set use proper service (codesFromTo) !!!
    // FIXME: proper error message
    function fetchCodes(classification) {
        console.log('fetching codes');
        let url = subset.draft.valid.from !== null
            ? `${classification._links.self.href}/codesAt.json?date=1990-02-02`
            : `${classification._links.self.href}/codesAt.json?date=null`;
        fetch(url)
            .then(response => response.json(url))
            .then(data => {
                classification.children = data.codes;
                classification.error = null;
            })
            .catch(e => {
                console.log(e);
                classification.error = e.message;
            });
    }

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
                All search results will be restricted by validity period set in metadata {JSON.stringify(subset.draft.valid.from)}-{JSON.stringify(subset.draft.valid.to)}
            </p>
            <Search resource={classifications ? classifications._embedded.classifications : []}
                    setChosen={(item) => setSearchValues(item)}
                    placeholder='Type classification name'
                    searchBy = {(input, resource) =>
                        input === '' ? [] : resource.filter(i => i.name.toLowerCase().search(input.toLowerCase()) > -1)}
            />

            {searchResult.length > 0
                ? <ul className='list'>
                    {searchResult.map((item, i) =>
                        <li key={i} style={{padding: '5px', width: '600px'}}>
                            <Classification item={item}
                                            update={() => setSearchResult([...searchResult])}
                                            add={() => {
                                                if (item.included) setCodes(codes.concat(item));
                                                else setCodes(codes.filter(i => i !== item));
                                            }}
                                            remove={() => setSearchResult(searchResult.filter(i => i !== item))}
                        />
                        </li>
                    )}
                </ul>
                : <p>Nothing is found</p>
            }

            <Title size={3}>Choose codes</Title>
            {/* TODO: show more data on item component (info block, date, etc?) */}
            {codes && codes.length > 0
                ? <ul className='list'>
                    {codes.map((item, i) =>
                        <li key={i} style={{padding: '5px', width: '600px'}}>
                            <Classification item={item}
                                            update={() => setSearchResult([...searchResult])}
                                            add={() => {
                                                if (item.included) setCodes(codes.concat(item));
                                                else setCodes(codes.filter(i => i !== item));
                                            }}
                                            remove={() => {
                                                setCodes(codes.filter(i => i !== item));
                                                setSearchResult([...searchResult]);
                                            }}
                                            checkbox />
                        </li>)}
                </ul>
                : <p>No codes in the subset draft</p>}
        </>
    );
};

