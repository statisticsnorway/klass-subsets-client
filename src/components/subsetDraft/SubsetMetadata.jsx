import React from "react";

export const SubsetMetadata = ({subset}) => {

    return (
        <>
            <br/><br/>

            <label htmlFor="name" style={{display:"block"}}>Name</label>
                <input type="text" id="name" value={subset.draft.names}
                   onChange={(e) => { subset.dispatch({
                       action: "names",
                       data: e.target.value });
                   }}/>
                <select name="language">
                    <option value="nb" defaultValue >Bokmål</option>
                    <option value="nn">Nynorsk</option>
                    <option value="en">English</option>
                </select>
                <button style={{margin: "20px"}}>+</button>

            <br/><br/>

            <label htmlFor="owner" style={{display:"block"}}>Owner</label>
                <input type="text" id="owner" value={subset.draft.ownerId}
                   onChange={(e) => {subset.dispatch({
                       action: "ownerId",
                       data: e.target.value });
                   }}/>

            <br/><br/>

            <label style={{display:"block"}}>Valid period</label>
            <label>From:<input type="date"/></label>
            <label>To:<input type="date"/></label>

            <br/><br/>
            <label>Subject
            <select style={{margin: "10px"}}>
                <option value="Economics" selected={true}>Economics</option>
                <option value="Work">Work</option>
                <option value="Work" >Economics</option>
            </select>
            </label>

            <br/><br/>

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

            <br/><br/>

            <label><input type="checkbox"/>Subscribe for changes</label>

            <br/><br/>

            <button onClick={() => {subset.dispatch({action: "empty"});}}>Empty</button>
            <button onClick={() => {subset.dispatch({action: "reset"});}}>Reset</button>

            <br/><br/>
        </>
    );
};