import React, {useState, useRef} from "react";
import "../css/autosuggest.css";

export const Search = ({resource = [],
                           setChosen = (item) => console.log("chosen item:", item),
                           placeholder = "Search",
                           searchBy = (input, source) =>
                               input === "" ? [] : source.filter(i => i.toLowerCase().search(input.toLowerCase()) > -1)
                       }) => {

    const dom = useRef(null);

    const [searchInput, setSearchInput] = useState("");
    const [suggestions, setSuggestions] = useState([]);
    const [active, setActive] = useState(-1);

    const handleInput = (e) => {
        setSearchInput(e.target.value);
        setSuggestions(searchBy(e.target.value, resource));
    };

    function keyHandler(e) {
        const keys = { DOWN: 40, UP: 38, ENTER: 13 };
        switch (e.keyCode) {
            case keys.DOWN: {
                setActive((active + 1) % suggestions.length);
                break;
            }
            case keys.UP: {
                setActive(active - 1 < 0 ? suggestions.length - 1 : active - 1);
                break;
            }
            case keys.ENTER: {
                e.preventDefault();
                handleChoice(active === -1 ? searchInput : suggestions[parseInt(active)].name);
                break;
            }
            default: break;
        }
    }

    function handleChoice(choice) {
        setSuggestions([]);
        setSearchInput(choice);
        dom.current.focus();
        setActive(-1);

        setChosen(searchBy(choice, resource));
    }

    function highlight(origin, substring) {
        const i = origin.toLowerCase().search(substring.toLowerCase());
        return  <>
            <span>{origin.substr(0, i)}</span>
            <span style={{color:"red"}}>{origin.substr(i, substring.length)}</span>
            <span>{origin.substr(i+substring.length, origin.length)}</span>
        </>;
    }

    // TODO: convert divs to list items (li)
    // FIXME: scroll and limit amount of suggestion shown by screen size

    // FIXME: sanitize input !!!!

    // TODO: async fetch ?

    return (
        <>
            <div className="autocomplete" style={{width:"300px"}}>
                <input type="search" name="countrySearch" ref={dom}
                       placeholder={placeholder} value={searchInput} onChange={handleInput}
                       onKeyDown={keyHandler} />
                <div id="autocomplete-list" className="autocomplete-items">
                    {suggestions.map((suggestion, i) => (
                        <div key={i} className={i===active ? "autocomplete-active" : "autocomplete"}
                             onClick={(e) => {
                                 e.preventDefault();
                                 setActive(i);
                                 handleChoice(suggestion.name);
                             }}>
                            {highlight(suggestion.name, searchInput)}
                        </div>))}
                </div>
            </div>
            <button onClick={() => handleChoice(searchInput)}>Search</button>
        </>
    );
};