import React, {useState, useRef} from "react";
import "../css/autosuggest.css";

export const Search = ({items = [],
                           setChosen = (item) => console.log("chosen item:", item),
                           placeholder = "Search"}) => {
    // inspired: https://www.w3schools.com/howto/howto_js_autocomplete.asp

    const dom = useRef(null);

    const [value, setValue] = useState("");
    const [suggestions, setSuggestions] = useState([]);
    const [active, setActive] = useState(-1);

    const handleInput = (e) => {
        setValue(e.target.value);
        e.target.value === ""
            ? setSuggestions([])
            : setSuggestions(items.filter(i =>
            i.toLowerCase().search(e.target.value.toLowerCase()) > -1));
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
                console.log("Chosen by ENTER", suggestions[active], value);
                handleChoice(active === -1 ? value : suggestions[active]);
                break;
            }
            default: break;
        }
    }

    function handleChoice(choice) {
        setSuggestions([]);
        setValue(choice);
        dom.current.focus();
        setActive(-1);

        choice.length > 0 && setChosen(choice);
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
                       placeholder={placeholder} value={value} onChange={handleInput}
                       onKeyDown={keyHandler} />
                <div id="autocomplete-list" className="autocomplete-items">
                    {suggestions.map((suggestion, i) => (
                        <div key={i} className={i===active ? "autocomplete-active" : "autocomplete"}
                             onClick={(e) => {
                                 e.preventDefault();
                                 console.log("Chosen by click", suggestion);
                                 setActive(i);
                                 handleChoice(suggestion);
                             }}>
                            {highlight(suggestion,value)}
                        </div>))}
                </div>
            </div>
            <button onClick={() => {
                console.log("Chosen by search button", value);
                handleChoice(value)
            }}>Search</button>
        </>
    );
};