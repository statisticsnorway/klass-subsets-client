
import React, {useState, useEffect} from "react";
import {Search} from "../../utils/Search";
import {List, useList} from "../../utils/list";

export const SubsetCodes = ({subset}) => {
    // FIXME: sanitize input

    // FIXME: search result must be an array
    const [chosen, setChosen] = useState([]);
    const searchResult = useList([]);
    const codes = useList(subset.draft.codes);

    useEffect(() => codes.update(subset.draft.codes),[subset]);
    useEffect(() => {
        searchResult.items.length > 0 && subset.dispatch({action: "codes_prepend_checked", data: searchResult.items});

        const result = chosen
            ? chosen.map(item => {

                    let already = codes.items.find(code => code.title === item);
                    return already ? already : {
                        title: item,
                        children:
                            [
                                {title: `${item} A`},
                                {title: `${item} B`}
                            ]
                    }
                }
            )
            : [];
        searchResult.update(result);
        codes.remove(chosen);
    },[chosen]);

    const countries = ["Afghanistan","Albania","Algeria","Andorra","Angola","Anguilla","Antigua & Barbuda",
        "Argentina","Armenia","Aruba","Australia","Austria","Azerbaijan","Bahamas","Bahrain","Bangladesh",
        "Barbados","Belarus","Belgium","Belize","Benin","Bermuda","Bhutan","Bolivia","Bosnia & Herzegovina",
        "Botswana","Brazil","British Virgin Islands","Brunei","Bulgaria","Burkina Faso","Burundi","Cambodia",
        "Cameroon","Canada","Cape Verde","Cayman Islands","Central African Republic","Chad","Chile","China",
        "Colombia","Congo","Cook Islands","Costa Rica","Cote d'Ivoire","Croatia","Cuba","Curacao","Cyprus",
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
