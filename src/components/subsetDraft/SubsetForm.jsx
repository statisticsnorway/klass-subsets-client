import React, {useContext} from "react";
import "../../css/pages.css";
import {AppContext} from "../../controllers/context";
import {Navigation, Step} from "../../utils/navigation";
import {SubsetReorder} from "./SubsetReorder";
import {SubsetCodes} from "./SubsetCodes";
import {SubsetMetadata} from "./SubsetMetadata";

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

