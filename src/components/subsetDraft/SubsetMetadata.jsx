import React from "react";
import "../../css/form.css";
import {availableLanguages, disableUsed} from "../../utils/languages";

export const SubsetMetadata = ({subset}) => {

    return (
        <>
            <br/>

            <TextLanguageFieldset title="Names" items={subset.draft.names}
                                  add={() => subset.dispatch({action: "name_add"})}
                                  remove={(index) => subset.dispatch({action: "name_remove", data: index})}
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

            <TextLanguageFieldset title="Description" items={subset.draft.descriptions}
                                  add={() => subset.dispatch({action: "description_add"})}
                                  remove={(index) => subset.dispatch({action: "description_remove", data: index})}
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

export const TextLanguageFieldset = ({title, items = [],
                             handle = (data) => console.log(data),
                             add = () => console.log("+"),
                             remove = (index) => console.log("-", index)}) => {

    const languages = availableLanguages();
    disableUsed(languages, items.map(name => name.lang));

    return (
        <fieldset>
            <label htmlFor="name" style={{display: "block"}}
            >{title}</label>

            {items.map((item, index) => (
                <div key={index}>

                    <input type="text" id="name" value={item.text}
                           onChange={(e) => handle(item.text = e.target.value)}/>

                    <LanguageSelect languages={languages}
                                   selected={item.lang}
                                   onChange={(e) => handle(item.lang = e.target.value)}/>

                    {index === items.length-1 && index < languages.length-1 &&
                    <button style={{margin: "0 20px 0 20px"}}
                            onClick={() => add()}
                    >+</button>}

                    {index > 0 &&
                    <button style={{margin: "0 20px 0 20px"}}
                            onClick={() => {remove(index);}}
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