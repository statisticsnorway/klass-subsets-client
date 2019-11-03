
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
                    return already ? already : {
                        title: item.name,
                        children:
                            [
                                {title: `${item.name} A`},
                                {title: `${item.name} B`}
                            ]
                    }
                }
            )
            : [];
        searchResult.update(result);
        codes.remove(chosen.map(i => i.name));
    },[chosen]);

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
