
import React, {useState, useEffect} from "react";
import {Search} from "../../utils/Search";
import {List} from "../../utils/list";

export const SubsetCodes = ({subset}) => {
    // FIXME: sanitize input

    const [chosen, setChosen] = useState("");
    useEffect(() => console.log({ newState: chosen }),[chosen]);
    useEffect(() => {
        if (chosen) {
            subset.dispatch({action: "codes_add", data:
                { title: chosen, children:
                    [
                        { title: 'A' },
                        { title: 'B' }
                    ]}
            })}
    },[chosen]);

    const countries = ["Afghanistan","Albania","Algeria","Andorra","Angola","Anguilla","Antigua & Barbuda",
        "Argentina","Armenia","Aruba","Australia","Austria","Azerbaijan","Bahamas","Bahrain","Bangladesh",
        "Barbados","Belarus","Belgium","Belize","Benin","Bermuda","Bhutan","Bolivia","Bosnia & Herzegovina",
        "Botswana","Brazil","British Virgin Islands","Brunei","Bulgaria","Burkina Faso","Burundi","Cambodia",
        "Cameroon","Canada","Cape Verde","Cayman Islands","Central Arfrican Republic","Chad","Chile","China",
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

    const listItems = [
        { title: 'Arbeid', children:
                [
                    { title: 'A dfg' },
                    { title: 'B xfdggfh' },
                    { title: 'C xc' },
                    { title: 'D dfgs' },
                    { title: 'E salølæsødlfæsød' },
                ]
        },
        { title: 'Yrke', children:
                [
                    { title: '1 dfg' },
                    { title: '2 xfdggfh' },
                    { title: '3 xc' },
                    { title: '4 dfgs' },
                    { title: '5 salølæsødlfæsød' },
                    { title: '6 Zzzsødlfæsød' },
                ],
            expanded: true
        },
        { title: 'Commune', children:
                [
                    { title: 'I dfg' },
                    { title: 'II xfdggfh' },
                    { title: 'III xczzpppsk' },
                    { title: 'IV dfgs 1233' },
                    { title: 'V salæsød' },
                    { title: 'VI salølæsø' },
                    { title: 'VII aalokdk' },
                    { title: 'VIII domdomd', children:
                            [
                                { title: 'A dfg' },
                                { title: 'B xfdggfh' },
                                { title: 'C xc' },
                                { title: 'D dfgs' },
                                { title: 'E salølæsødlfæsød' },
                            ]},
                    { title: 'IX Pjfklsvnnn' },
                    { title: 'X AKOKO' },
                ]
        },
    ];

    return (
        <div className="page">
            <h3>Choose codes</h3>
            <Search items={countries}
                    setChosen={ (item) => setChosen(item) }
                    placeholder="Country"/>
            <h3>Search results</h3>
            {chosen.length < 1
                ? <p>Nothing to show</p>
                : <List1 items={subset.draft.codes} />}
            <h3>List demo</h3>
                <List listitems={listItems} />
                <button onClick={() => console.log("current state", listItems)}>Show data</button>
        </div>
    );
};


export const List1 = ({items = []}) => {

    return (<ul>
            {items.map((item, i) =>
                <ListItem key={i}
                          title={item.title}
                          children={item.children}
                          hidden={item.hidden}/>)}
        </ul>
    )
};

export const ListItem = ({title = "Title", children = [], hidden = true}) => {
    return (
        <li>
            <h4>{title}</h4>
            {!hidden && <List items={children} />}
        </li>
    )
};