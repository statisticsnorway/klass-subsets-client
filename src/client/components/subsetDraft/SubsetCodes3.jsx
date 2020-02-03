import React, {useState, useEffect, useContext} from 'react';
import {Search} from '../../utils/Search';
import {AppContext} from '../../controllers/context';
import {Title} from '@statisticsnorway/ssb-component-library';
import { PlusSquare, Trash2, Info, List as ListIcon, AlertTriangle as Alert } from 'react-feather';

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

    {/* TODO: tooltips for classification icons */}
    return (<>
            <Title size={3}>Choose codes</Title>
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
                            <div style={{display: 'flex'}}>
                                <div style={{width: '400px'}}>{item.title}</div>

                                <button onClick={() => {
                                    item.showAlert = !item.showAlert;
                                    item.showCodes = false;
                                    setSearchResult([...searchResult]);
                                }}>
                                    <Alert color={item.error ? 'orange' : 'transparent'}/>
                                </button>

                                <button
                                    onClick={() => {
                                        item.included = !item.included;
                                        item.showAlert = false;
                                        item.showCodes = false;
                                        if (item.included) setCodes(codes.concat(item));
                                        else setCodes(codes.filter(i => i !== item));
                                        setSearchResult([...searchResult]);
                                    }}>
                                    <PlusSquare color={item.included ? '#C3DCDC' : '#1A9D49'}/>
                                </button>

                                <button onClick={() => {
                                    item.showCodes = !item.showCodes;
                                    item.showAlert = false;
                                    setSearchResult([...searchResult]);
                                }}>
                                    <ListIcon color={item.children ? '#3396D2' : '#C3DCDC'}/>
                                </button>

                                <button onClick={() => console.log('info', item)}><Info color='#62919A'/></button>

                                <button onClick={() => {
                                    setSearchResult(searchResult.filter(i => i !== item));
                                }}>
                                    <Trash2 color='#ED5935'/>
                                </button>
                            </div>

                            {item.showAlert && <div style={{
                                fontSize: '11px',
                                backgroundColor: 'orange',
                                padding: '5px',
                                opacity: '0.8',
                                width: '600px'
                            }}>{item.error}</div>}

                            {item.showCodes && <div style={{
                                fontSize: '11px',
                                backgroundColor: '#3396D2',
                                padding: '5px',
                                opacity: '0.8',
                                width: '600px'
                            }}>{item.children && item.children.map((code, i) =>
                                <p key={i}>{code.code} {code.name}</p>
                            ) }</div>}
                        </li>
                    )}
                </ul>
                : <p>Nothing is found</p>
            }

            <h3>Chosen classification codes</h3>
            {
                // TODO: show more data on item component (info block, date, etc?)
            }
            {codes && codes.length > 0
                ? <ul className='list'>
                    {codes.map((item, i) =>
                        <li key={i} style={{padding: '5px', width: '600px'}}>
                            <div style={{display: 'flex'}}>
                                <div style={{width: '400px'}}>{item.title}</div>
                            <button onClick={() => {
                                item.showAlert = !item.showAlert;
                                item.showCodes = false;
                                setSearchResult([...searchResult]);
                            }}>
                                <Alert color={item.error ? 'orange' : 'transparent'}/>
                            </button>                            <button
                                onClick={() => {
                                    item.included = !item.included;
                                    item.showAlert = false;
                                    item.showCodes = false;
                                    if (item.included) setCodes(codes.concat(item));
                                    else setCodes(codes.filter(i => i !== item));
                                    setSearchResult([...searchResult]);
                                }}>
                                <PlusSquare color={item.included ? '#C3DCDC' : '#1A9D49'}/>
                            </button>
                                <button onClick={() => {
                                    item.showCodes = !item.showCodes;
                                    item.showAlert = false;
                                    setSearchResult([...searchResult]);
                                }}>
                                <ListIcon color={item.children ? '#3396D2' : '#C3DCDC'}/>
                            </button>
                            <button onClick={() => console.log('info', item)}><Info color='#62919A'/></button>
                            <button onClick={() => {
                                item.included = !item.included;
                                setCodes(codes.filter(i => i !== item));
                                setSearchResult([...searchResult]);
                            }}>
                                <Trash2 color='#ED5935'/>
                            </button>
                            </div>
                            {item.showAlert && <div style={{
                                fontSize: '11px',
                                backgroundColor: 'orange',
                                padding: '5px',
                                opacity: '0.8',
                                width: '600px'
                            }}>{item.error}</div>}

                            {item.showCodes && <div style={{
                                fontSize: '11px',
                                backgroundColor: '#3396D2',
                                padding: '5px',
                                opacity: '0.8',
                                width: '600px'
                            }}>{item.children && item.children.map((code, i) =>
                                <p key={i}>
                                    <input type='checkbox' name='include' checked={code.checked}
                                           onChange={() => code.checked = !code.checked }
                                /> {code.code} {code.name}</p>
                            ) }</div>}
                        </li>)
            }
                </ul>
                : <p>No codes in the subset draft</p>}
        </>
    );
};
