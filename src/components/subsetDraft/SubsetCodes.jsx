
import React, {useState, useEffect} from "react";
import {Search} from "../../utils/Search";
import {List} from "../../utils/list";

export const SubsetCodes = ({subset}) => {
    // FIXME: sanitize input

    const [chosen, setChosen] = useState("");
    const [searchResult, setSearchResult] = useState([]);

    useEffect(() => console.log({ draft: subset.draft.codes }),[subset]);
    useEffect(() => {
        searchResult.length > 0 && subset.dispatch({action: "codes_add_checked", data: searchResult});
        setSearchResult(chosen
            ? [{ title: chosen, children:
                    [
                        { title: 'A' },
                        { title: 'B' }
                    ]}]
            : []);
    },[chosen]);

    const countries = ["Afghanistan","Albania","Algeria","Andorra","Angola","Anguilla","Antigua & Barbuda",
        "Argentina","Armenia","Aruba","Australia","Austria","Azerbaijan","Bahamas","Bahrain","Bangladesh",
        "Barbados","Belarus","Belgium","Belize","Benin","Bermuda","Bhutan","Bolivia","Bosnia & Herzegovina",
        "Botswana","Brazil","British Virgin Islands","Brunei","Bulgaria","Burkina Faso","Burundi","Cambodia",
        "Cameroon","Canada","Cape Verde","Cayman Islands","Central African Republic","Chad","Chile","China",
        "Colombia","Congo","Cook Islands","Costa Rica","Cote D Ivoire","Croatia","Cuba","Curacao","Cyprus",
        "Czech Republic","Denmark","Djibouti","Dominica","Dominican Republic","Ecuador","Egypt","El Salvador",
        "Equatorial Guinea","Eritrea","Estonia","Ethiopia","Falkland Islands","Faroe Islands","Fiji","Finland",
        "France","French Polynesia","French West Indies","Gabon","Gambia","Georgia","Germany","Ghana","Gibraltar",
        "Greece","Greenland","Grenada","Guam","Guatemala","Guernsey","Guinea","Guinea Bissau","Guyana","Haiti",
        "Honduras","Hong Kong","Hungary","Iceland","India","Indonesia","Iran","Iraq","Ireland","Isle of Man",
        "Israel","Italy","Jamaica","Japan","Jersey","Jordan","Kazakhstan","Kenya","Kiribati","Kosovo","Kuwait",
        "Kyrgyzstan","Laos","Latvia","Lebanon","Lesotho","Liberia","Libya","Liechtenstein","Lithuania","Luxembourg",
        "Macau","Macedonia","Madagascar","Malawi","Malaysia","Maldives","Mali","Malta","Marshall Islands",
        "Mauritania","Mauritius","Mexico","Micronesia","Moldova","Monaco","Mongolia","Montenegro","Montserrat",
        "Morocco","Mozambique","Myanmar","Namibia","Nauro","Nepal","Netherlands","Netherlands Antilles",
        "New Caledonia","New Zealand","Nicaragua","Niger","Nigeria","North Korea","Norway","Oman","Pakistan",
        "Palau","Palestine","Panama","Papua New Guinea","Paraguay","Peru","Philippines","Poland","Portugal",
        "Puerto Rico","Qatar","Reunion","Romania","Russia","Rwanda","Saint Pierre & Miquelon","Samoa",
        "San Marino","Sao Tome and Principe","Saudi Arabia","Senegal","Serbia","Seychelles","Sierra Leone",
        "Singapore","Slovakia","Slovenia","Solomon Islands","Somalia","South Africa","South Korea","South Sudan",
        "Spain","Sri Lanka","St Kitts & Nevis","St Lucia","St Vincent","Sudan","Suriname","Swaziland",
        "Sweden","Switzerland","Syria","Taiwan","Tajikistan","Tanzania","Thailand","Timor L'Este","Togo",
        "Tonga","Trinidad & Tobago","Tunisia","Turkey","Turkmenistan","Turks & Caicos","Tuvalu",
        "Uganda","Ukraine","United Arab Emirates","United Kingdom","United States of America","Uruguay",
        "Uzbekistan","Vanuatu","Vatican City","Venezuela","Vietnam","Virgin Islands (US)","Yemen","Zambia",
        "Zimbabwe"];

    return (
        <div className="page">
            <h3>Choose codes</h3>
            <Search items={countries}
                    setChosen={(item) => setChosen(item)}
                    placeholder="Country" />

            <h3>Search results</h3>
            {searchResult.length > 0
                ? <List listitems={searchResult} onBlur={() => console.log("blur")}/>
                : <p>Nothing to show</p>}

            <h3>Chosen classification codes</h3>
            {(subset.draft
                && subset.draft.codes
                && subset.draft.codes.length > 0)
                ? <List listitems={subset.draft.codes} />
                : <p>No codes in the subset draft</p>}
            <button onClick={() => console.log("current codes", subset.draft.codes)}
            >Show codes
            </button>
        </div>
    );
};
