import React from "react";

export const SubsetCodes = ({subset}) => {

    // FIXME: sanitize input

    return (
        <>
            <h3>Choose codes</h3>
            <button onClick={() => {console.log("Submit subset draft: ", subset.draft);}}>Save draft</button>
            <br/><br/>
        </>
    );
};