import React, {useContext} from "react";
import "../../css/pages.css";
import {AppContext} from "../../controllers/context";
import {Navigation, Step} from "../../utils/navigation";
import {SubsetReorder} from "./SubsetReorder";
import {SubsetCodes} from "./SubsetCodes";

export default function SubsetForm() {
    const {subset} = useContext(AppContext);

    return (
        <div className="page">
            <h2>Create new subset</h2>
            <Navigation>
                <Step label={"Metadata"}><SubsetMetadata subset={subset} /></Step>
                <Step label={"Choose codes"}><SubsetCodes subset={subset} /></Step>
                <Step label={"Reorder codes"}><SubsetReorder subset={subset} /></Step>
                <Step label={"Preview"}><SubsetPreview subset={subset} /></Step>
            </Navigation>
        </div>
    );
}

export const SubsetPreview = ({subset}) => {
    return (
        <>
            <h3>Subset preview</h3>
            <pre>{JSON.stringify(subset.draft, null, 4)}</pre>
            <button onClick={() => {console.log("Publish subset: ", subset.draft);}}>Publish</button>
            <br/><br/>
        </>
    );
};

export const SubsetMetadata = ({subset}) => {

    return (
        <>
            <h3>Norwegian name</h3>
            <input type="text" value={subset.draft.names}
                   onChange={(e) => { subset.dispatch({
                       action: "names",
                       data: e.target.value });
                   }}/>

            <h3>Norwegian description</h3>
            <input type="text" value={subset.draft.description}
                   onChange={(e) => { subset.dispatch({
                       action: "description",
                       data: e.target.value });
                   }}/>

            <h3>Owner</h3>
            <input type="text" value={subset.draft.ownerId}
                   onChange={(e) => {subset.dispatch({
                       action: "ownerId",
                       data: e.target.value });
                   }}/>

            <br/><br/>

            <button onClick={() => {subset.dispatch({action: "empty"});}}>Empty</button>
            <button onClick={() => {subset.dispatch({action: "reset"});}}>Reset</button>

            <br/><br/>
        </>
    );
};
