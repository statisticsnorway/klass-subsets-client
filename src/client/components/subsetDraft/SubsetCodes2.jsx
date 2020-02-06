import React, {useState, useEffect, useContext} from 'react';
import {Search} from '../../utils/Search';
import {List, useList} from '../../utils/list';
import {AppContext} from '../../controllers/context';
import {Title} from '@statisticsnorway/ssb-component-library';

export const SubsetCodes = ({subset}) => {
    // FIXME: sanitize input
    // FIXME: fails on '(' input and in result string

    const [searchValues, setSearchValues] = useState([]);
    const searchResult = useList([]);
    const codes = useList(subset.draft.codes);

    useEffect(() => codes.update(subset.draft.codes),[subset]);

    // FIXME: make the list item update (show expandable control) when the codes arrived from klass-api
    // Solution: useEffect should depend on searchResult ?
    useEffect(() => {
        searchResult.items.length > 0 && subset.dispatch({
            action: 'codes_prepend_checked',
            data: searchResult.items
        });

        const result = searchValues
            ? searchValues.map(item => {
                    let already = codes.items.find(code => code.title === item.name);
                    if (already) {return already;}
                    else {
                        item.title = item.name;
                        item.children = [];
                        return item;
                    }
                })
            : [];
        searchResult.update(result);
        codes.remove(searchValues.map(i => i.name));
    },[searchValues]);

    useEffect(() => {
        codes.items.map(item => {
                fetch(`${item._links.self.href}/codesAt.json?date=${subset.draft.valid.from}`)
                    .then(response => response.json())
                    .then(data => item.children = addTitle(data.codes))
                    .catch(e => console.log(e));
            }
        )
    }, [codes]);

    function addTitle(array) {
        array.forEach(i => i.title = `${i.code} - ${i.name}`);
        return array;
    }
    const {classifications} = useContext(AppContext);

    // FIXME: use valid to date in the search!
    return (<>
            <Title size={3}>Choose classifications and code lists</Title>
            <p style={{color:'grey', fontSize:'11px'}}>
                All search results will be restricted by validity period set in metadata {subset.draft.valid.from}-{subset.draft.valid.to}
            </p>
            <Search resource={classifications ? classifications._embedded.classifications : []}
                    setChosen={(item) => setSearchValues(item)}
                    placeholder='Classification'
                    searchBy = {(input, resource) =>
                        input === '' ? [] : resource.filter(i => i.name.toLowerCase().search(input.toLowerCase()) > -1)}
            />

            {searchResult.items.length > 0
                ? <ul className='list'>
                    {searchResult.items.map((item) =>
                        <li>
                            <span className='content'>{item.title}</span>
                            <input type='checkbox' name='include' checked={item.checked}
                                   onChange={() => {
                                       item.checked = !item.checked;
                                       subset.dispatch({
                                           action: 'codes_prepend_checked', data: [item]
                                       })
                                   }}/>
                        </li>)
                    }
                </ul>
                : <p>Nothing is found</p>
            }

            <Title size={3}>Choose codes</Title>
            {// FIXME: remove unselected classifications! when? prompt? extra button?
             // TODO: show more data on item component (info block, date, etc?)
            }
            {codes && codes.items.length > 0
                ? <List list={codes} />
                : <p>No codes in the subset draft</p>}
    </>
    );
};
