import React, {useEffect} from "react";
import "../../css/form.css";
import {TextLanguageFieldset} from "../../utils/forms";

export const SubsetMetadata = ({subset}) => {

    useEffect(() => {return () => subset.dispatch({action: "remove_empty"});}, []);

    return (
        <>
            <TextLanguageFieldset title="Names" items={subset.draft.names}
                                  add={() => subset.dispatch({action: "name_add"})}
                                  remove={(index) => subset.dispatch({action: "name_remove", data: index})}
                                  handle={() => subset.dispatch({action: "update"})}
                                  size={{cols: 40, rows: 1}}/>
                                  
            <fieldset>
                <label>Owner
                    <select style={{margin: "10px"}}
                            value={subset.draft.ownerId}
                            onChange={(e) => subset.dispatch({
                                action: "ownerId",
                                data: e.target.value })}>
                        <option value="ssb">SSB</option>
                        <option value="nav">NAV</option>
                    </select>
                </label>
            </fieldset>

            <fieldset>
                <label style={{display:"block"}}>Valid period</label>
                <label>From:<input type="date"
                                   value={subset.draft.valid.from}
                                   onChange={(e) => subset.dispatch(
                                       {action: "from", data: e.target.value})} /></label>
                <label>To:<input type="date"
                                 value={subset.draft.valid.to}
                                 onChange={(e) => subset.dispatch(
                                     {action: "to", data: e.target.value})} /></label>
            </fieldset>

            <fieldset>
                <label>Subject
                <select style={{margin: "10px"}}
                        value={subset.draft.subject}
                        onChange={(e) => subset.dispatch({
                            action: "subject",
                            data: e.target.value })}>
                    <option value="Economics">Economics</option>
                    <option value="Work">Work</option>
                </select>
                </label>
            </fieldset>

            <TextLanguageFieldset title="Description" items={subset.draft.descriptions}
                                  add={() => subset.dispatch({action: "description_add"})}
                                  remove={(index) => subset.dispatch({action: "description_remove", data: index})}
                                  handle={() => subset.dispatch({action: "update"})}
                                  size = {{cols: 40, rows: 4}}/>

            <label><input type="checkbox"/>Subscribe for changes</label>

            <br/><br/>

            <button onClick={() => {subset.dispatch({action: "empty"});}}>Empty</button>
            <button onClick={() => {subset.dispatch({action: "reset"});}}>Reset</button>

            <br/><br/>
        </>
    );
};
