
import React, {useState, useEffect, useContext} from "react";
import {Search} from "../../utils/Search";
import {List, useList} from "../../utils/list";
import {AppContext} from "../../controllers/context";

export const SubsetCodes = ({subset}) => {
    // FIXME: sanitize input

    // FIXME: fails on "(" input and in result string

    const [chosen, setChosen] = useState([]);
    const searchResult = useList([]);
    const codes = useList(subset.draft.codes);

    useEffect(() => codes.update(subset.draft.codes),[subset]);
    useEffect(() => {
        searchResult.items.length > 0 && subset.dispatch({
            action: "codes_prepend_checked",
            data: searchResult.items
        });

        const result = chosen
            ? chosen.map(item => {

                    let already = codes.items.find(code => code.title === item.name);
                    if (already) return already;
                    else {
                        const x = {title: item.name, children: []};
                        fetch(`${item._links.self.href}/codesAt.json?date=2019-11-01`)
                            .then(response => response.json())
                            .then(data => x.children = convertToList(data.codes))
                            .catch(e => console.log(e));
                        return x;
                    }
                }
            )
            : [];
        searchResult.update(result);
        codes.remove(chosen.map(i => i.name));
    },[chosen]);

    function convertToList(array) {
        array.forEach(i => i.title = `${i.code} - ${i.name}`);
        const children = array.filter(i => i.parentCode === null);
        children.forEach(parent => findChildren(array, parent));
        return children;
    }

    function findChildren(array, parent) {
        parent.children = array.filter(i => i.parentCode === parent.code);
        parent.children.forEach(child => findChildren(array, child));
    }

    const {classifications} = useContext(AppContext);
    useEffect(() => console.log({classifications: classifications}),[classifications]);

    return (
        <div className="page">
            <h3>Choose codes</h3>
            <Search resource={classifications ? classifications._embedded.classifications : []}
                    setChosen={(item) => setChosen(item)}
                    placeholder="Country"
                    searchBy = {(input, resource) =>
                        input === "" ? [] : resource.filter(i => i.name.toLowerCase().search(input.toLowerCase()) > -1)}
            />

            <h3>Search results</h3>
            {searchResult.items.length > 0
                ? <List list={searchResult} />
                : <p>Nothing to show</p>}

            <h3>Chosen classification codes</h3>
            {codes && codes.items.length > 0
                ? <List list={codes} />
                : <p>No codes in the subset draft</p>}
            <button onClick={() => console.log("current codes", subset.draft.codes)}
            >Show codes
            </button>
        </div>
    );
};
