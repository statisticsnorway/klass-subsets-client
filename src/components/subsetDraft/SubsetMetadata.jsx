import React from "react";

export const SubsetMetadata = ({subset}) => {

    return (
        <>
            <br/><br/>

            <NameFieldset names="Uttrekk for ..."/>

            <br/><br/>

            <fieldset>
                <label htmlFor="owner" style={{display:"block"}}>Owner</label>
                <input type="text" id="owner" value={subset.draft.ownerId}
                   onChange={(e) => {subset.dispatch({
                       action: "ownerId",
                       data: e.target.value });
                   }}/>
            </fieldset>

            <br/><br/>

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
                <option value="Work" >Economics</option>
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
            <select id="language">
                <option value="nb" selected={true}>Bokmål</option>
                <option value="nn">Nynorsk</option>
                <option value="en">English</option>
            </select>
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

export const NameFieldset = ({names = "Uttrekk for ...",
                             handle = (data) => console.log(data),
                             languages = []}) => {
    return (
        <fieldset>
            <label htmlFor="name" style={{display: "block"}}>Name</label>
            <input type="text" id="name" value={names}
                   onChange={(e) => {
                       //subset.dispatch({action: "names", data: e.target.value});
                       handle(e);
                   }}/>
            <LanguageSelect languages={[
               {value: "nb", option: "Norsk bokmål"},
               {value: "no", option: "Nynorks"},
               {value: "en", option: "English"}]} />
            <button style={{margin: "20px"}}>+</button>
        </fieldset>
    );
};

export const LanguageSelect = ({languages = []}) => {
    return (
        <select name="language">
            <option value="nb" defaultValue>Bokmål</option>
            <option value="nn">Nynorsk</option>
            <option value="en">English</option>
        </select>
    );
};