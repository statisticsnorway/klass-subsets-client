import React from "react";
import "../../css/form.css";
import {availableLanguages, disableUsed} from "../../utils/languages";

export const SubsetMetadata = ({subset}) => {

    return (
        <>
            <br/>

            <NameFieldset names={subset.draft.names}
                          addName={() => subset.dispatch({action: "name_add"})}
                          removeName={(index) => subset.dispatch({action: "name_remove", data: index})}
                          handle={() => subset.dispatch({action: "update"})}
            />

            <br/>

            <fieldset>
                <label htmlFor="owner" style={{display:"block"}}>Owner</label>
                <input type="text" id="owner" value={subset.draft.ownerId}
                   onChange={(e) => {subset.dispatch({
                       action: "ownerId",
                       data: e.target.value });
                   }}/>
            </fieldset>

            <br/>

            <fieldset>
            <label style={{display:"block"}}>Valid period</label>
            <label>From:<input type="date"/></label>
            <label>To:<input type="date"/></label>
            </fieldset>

            <br/>

            <fieldset>
            <label>Subject
            <select style={{margin: "10px"}} value="Economics" onChange={(e) => console.log(e.target.value)}>
                <option value="Economics">Economics</option>
                <option value="Work">Work</option>
            </select>
            </label>
            </fieldset>

            <br/>

            <fieldset>
            <label htmlFor="description" style={{display:"block"}}>Description</label>
            <input type="textarea" id="description"
                   value={subset.draft.description}
                   onChange={(e) => { subset.dispatch({
                       action: "description",
                       data: e.target.value });
                   }}/>
            <LanguageSelect languages={availableLanguages()} selected={"en"}/>
            <button style={{margin: "20px"}}>+</button>
            </fieldset>

            <NameFieldset names={subset.draft.descriptions}
                          addName={() => subset.dispatch({action: "description_add"})}
                          removeName={(index) => subset.dispatch({action: "description_remove", data: index})}
                          handle={() => subset.dispatch({action: "update"})}
            />

            <br/>

            <label><input type="checkbox"/>Subscribe for changes</label>

            <br/><br/>

            <button onClick={() => {subset.dispatch({action: "empty"});}}>Empty</button>
            <button onClick={() => {subset.dispatch({action: "reset"});}}>Reset</button>

            <br/><br/>
        </>
    );
};

export const NameFieldset = ({names = [],
                             handle = (data) => console.log(data),
                             addName = () => console.log("+"),
                             removeName = (index) => console.log("-", index)}) => {

    const languages = availableLanguages();
    disableUsed(languages, names.map(name => name.lang));

    return (
        <fieldset>
            <label htmlFor="name" style={{display: "block"}}
            >Name</label>

            {names.map((name, index) => (
                <div key={index}>

                    <input type="text" id="name" value={name.name}
                           onChange={(e) => handle(name.name = e.target.value)}/>

                    <LanguageSelect languages={languages}
                                   selected={name.lang}
                                   onChange={(e) => handle(name.lang = e.target.value)}/>

                    {index === names.length-1 && index < languages.length-1 &&
                    <button style={{margin: "0 20px 0 20px"}}
                            onClick={() => addName()}
                    >+</button>}

                    {index > 0 &&
                    <button style={{margin: "0 20px 0 20px"}}
                            onClick={() => {removeName(index);}}
                    >-</button>}

                </div>
                ))
            }
        </fieldset>
    );
};

export const LanguageSelect = ({languages = availableLanguages(),
                                selected = false,
                                onChange = (e) => console.log(e.target.value)}) => {

    return (
        <select name="language"
                value={selected || languages.find(lang => lang.default)}
                onChange={(e) => onChange(e)}>
            {languages.map((lang, i) => (
            <option key={i} value={lang.abbr} disabled={lang.disabled}>{lang.full}</option>
                ))}
        </select>
    );
};