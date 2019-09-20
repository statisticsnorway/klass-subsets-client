import React, {useState} from "react";
import "../../css/autosuggest.css";
import Autosuggest from 'react-autosuggest';

export const SubsetCodes = ({subset}) => {

    // FIXME: sanitize input

    // Imagine you have a list of languages that you'd like to autosuggest.
    const languages = [{name: 'Alabama', year: 1972}, {name: 'Alabamama', year: 2012}, {name: 'BAlabama', year: 2012}, {name: 'CcccccA', year: 2012}, {name: 'Eeeee-la', year: 2012}];

// When suggestion is clicked, Autosuggest needs to populate the input
// based on the clicked suggestion. Teach Autosuggest how to calculate the
// input value for every given suggestion.
    const getSuggestionValue = suggestion => suggestion.name;
// Use your imagination to render suggestions.
    const renderSuggestion = (suggestion) => (<div>{suggestion.name}</div>);

    // Teach Autosuggest how to calculate suggestions for any given input value.

    const [value, setValue] = useState("");
    const [suggestions, setSuggestions] = useState([]);
    // Autosuggest will call this function every time you need to update suggestions.
    const onChange = (event, { newValue }) => {setValue(newValue)};

    // Autosuggest will call this function every time you need to clear suggestions.
    const onSuggestionsClearRequested = () => {
        console.log("clear");
        setSuggestions([])
    };
    // You already implemented this logic above, so just use it.
    const onSuggestionsFetchRequested = ( {value} ) => {
        setSuggestions([]);
        const s = getSuggestions(value);
        console.log("fetch suggestions", value, s);
        setSuggestions([...s]);
        console.log("state suggestions", value, suggestions);
    };

    const getSuggestions = (value) => {
        console.log("get s value", value);
        const inputValue = value.trim().toLowerCase();
        console.log("getSuggestions", value, languages.filter(lang => lang.name.toLowerCase().search(inputValue) > -1));
        return inputValue.length === 0 ? []
            : languages.filter(lang => lang.name.toLowerCase().search(inputValue));
    };

    const inputProps = {
        placeholder: 'Type a programming language',
        value: value,
        onChange: onChange
    };

    return (
        <>
            <h3>Choose codes</h3>

            <Autosuggest
                suggestions={suggestions}
                onSuggestionsFetchRequested={onSuggestionsFetchRequested}
                onSuggestionsClearRequested={onSuggestionsClearRequested}
                getSuggestionValue={getSuggestionValue}
                renderSuggestion={renderSuggestion}
                inputProps={inputProps}
            />

            <button onClick={() => {console.log("Submit subset draft: ", subset.draft);}}>Save draft</button>
            <br/><br/>
        </>
    );
};