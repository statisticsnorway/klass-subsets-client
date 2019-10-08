import React from "react";
import "../../css/form.css";
import {setSelected} from "../../utils/languages";

export const SubsetMetadata = ({subset}) => {

    return (
        <>
            <br/>

            <NameFieldset names={subset.draft.names}
                          addName={() => subset.dispatch({action: "name_add"})}
                          handle={(name) => subset.dispatch({action: "name_update", data: name })}
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
            <select style={{margin: "10px"}}>
                <option value="Economics" selected={true}>Economics</option>
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
            <LanguageSelect languages={setSelected("en")}/>
            <button style={{margin: "20px"}}>+</button>
            </fieldset>

            <br/>

            <label><input type="checkbox"/>Subscribe for changes</label>

            <br/><br/>

            <button onClick={() => {subset.dispatch({action: "empty"});}}>Empty</button>
            <button onClick={() => {subset.dispatch({action: "reset"});}}>Reset</button>

            <br/><br/>
        </>
    );
};

export const NameFieldset = ({names = [{name: "Uttrekk for ...", lang: "nb"}],
                             handle = (data) => console.log(data),
                             addName = () => console.log("+")}) => {

    return (
        <fieldset>
            <label htmlFor="name" style={{display: "block"}}
            >Name</label>

            {names.map((name, index) => (
                <div key={index}>

                    <input type="text" id="name" value={name.name}
                   onChange={(e) => {
                       //subset.dispatch({action: "names", data: e.target.value});
                       handle(name.name = e.target.value);
                   }}/>

                   <LanguageSelect languages={setSelected(name.lang)} />

                   {index === names.length-1 &&
                    <button style={{margin: "0 20px 0 20px"}}
                            onClick={() => {addName();}}
                    >+</button>}
                </div>
                ))
            }
        </fieldset>
    );
};

export const LanguageSelect = ({languages = []}) => {
    return (
        <select name="language">
            {languages.map((lang, i) => (
            <option key={i} value={lang.abbr}
                    defaultValue={lang.default}
                    selected={lang.selected}
                    disabled={lang.disabled}>{lang.full}</option>
                ))}
        </select>
    );
};