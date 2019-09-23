import React, {useState, useRef} from "react";
import "../css/autosuggest.css";

export const Search = ({value, suggestions, onChange, onSubmit, onBlur}) => {

    // inspired: https://www.w3schools.com/howto/howto_js_autocomplete.asp

    const countrySearch = useRef(null);

    const [active, setActive] = useState(-1);

    function keyHandler(e) {
        if (e.keyCode === 40) {/*DOWN*/
            setActive(active => (active+1) % suggestions.length);
        } else if (e.keyCode === 38) { /*UP*/
            setActive(active => active-1 < 0 ? suggestions.length-1 : active-1);
        } else if (e.keyCode === 13) {/*ENTER*/
            e.preventDefault();
            onEnter(active);
        }
    }

    function onEnter(index) {
        console.log("choosen2");
        if (index === -1) {
            return countrySearch.current.value;
        } else {
            countrySearch.current.value = suggestions[index];
            return suggestions[index]
        }
    }

    // TODO: convert divs to list items (li)
    // TODO: return useful object

    return (
        <form autoComplete="off"
              onSubmit={onSubmit}
                onBlur={onBlur}>
            <div className="autocomplete" style={{width:"300px"}}>
                <input type="search" name="countrySearch" ref={countrySearch}
                       placeholder="Country" value={value} onChange={onChange}
                       onKeyDown={keyHandler} />
                <div id="autocomplete-list" className="autocomplete-items">
                    {suggestions.map((suggestion, i) => (
                        <div key={i} className={i===active? "autocomplete-active" : "autocomplete"}
                             onClick={() => console.log("choosen", suggestion)}>
                            {suggestion}
                        </div>))}
                </div>
            </div>
            <input type="submit" value="Search" />
        </form>
    );
};