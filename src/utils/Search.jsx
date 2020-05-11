import React, { useState, useRef } from 'react';
import '../css/autosuggest.css';
import { Search as SearchIcon } from 'react-feather';

export const Search = ({ resource = [],
    setChosen = () => {},
    placeholder = 'Type name',
    searchible = (item) => (item),
    searchBy = (input, source) => 
        input === ''
            ? []
            : source.filter(i => i.toLowerCase().indexOf(input.toLowerCase()) > -1)
    }) => {

    const dom = useRef(null);

    const [searchInput, setSearchInput] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [active, setActive] = useState(-1);

    const handleInput = (e) => {
        setSearchInput(e.target.value);
        setSuggestions(searchBy(e.target.value, resource));
    };

    function keyHandler(e) {
        const keys = {
            DOWN: 40,
            UP: 38,
            ENTER: 13
        };
        switch (e.keyCode) {
            case keys.DOWN: {
                setActive((active + 1) % suggestions.length);
                break;
            }
            case keys.UP: {
                setActive(active - 1 < 0
                    ? suggestions.length - 1
                    : active - 1);
                break;
            }
            case keys.ENTER: {
                e.preventDefault();
                handleChoice(active === -1
                    ? searchInput
                    : searchible(suggestions[parseInt(active)].name));
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
        const i = origin.toLowerCase().indexOf(substring.toLowerCase());
        return <>
            <span>{origin.substr(0, i)}</span>
            <span style={{ backgroundColor: '#62919A' }}>{origin.substr(i, substring.length)}</span>
            <span>{origin.substr(i + substring.length, origin.length)}</span>
        </>;
    }

    // TODO: convert divs to list items (li)
    // FIXME: scroll and limit amount of suggestion shown by screen size
    // FIXME: sanitize input !!!!
    // TODO: async fetch ?
    return (
        <div className="ssb-input ">
            <div className="input-wrapper" style={{ width: '100%' }}>
                <input type='search' className='with-icon'
                    name='classificationSearch'
                    ref={dom}
                    placeholder={placeholder} value={searchInput} onChange={handleInput}
                    onKeyDown={keyHandler} />
                <div id='autocomplete-list' className='autocomplete-items'>
                    {suggestions.map((suggestion, i) => (
                        <div key={i}
                            className={i === active ? 'autocomplete-active' : 'autocomplete'}
                            onClick={(e) => {
                                e.preventDefault();
                                setActive(i);
                                handleChoice(searchible(suggestion.name));
                            }}>
                            {highlight(searchible(suggestion.name), searchInput)}
                        </div>))}
                </div>
                <button className='icon-wrapper search-icon'
                    onClick={() => handleChoice(searchInput)}><SearchIcon /></button>
            </div>
        </div>
    );
};