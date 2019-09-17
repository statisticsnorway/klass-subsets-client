import React, {useContext} from "react";
import {AppContext} from "../controllers/context";

export default function Error() {
    const {errors} = useContext(AppContext);

    return (
        <>
            { errors.errors.map((error, index) => (
                <div key={index} >
                    <span style={{color: "red"}}>{error && `${error.status}: ${error.message}`}</span>
                    <button
                        style={{color:"red", background:"none", border:"none", fontWeight: "400"}}
                        onClick={(e) => { e.target.parentElement.remove();}}
                    >x
                    </button>
                </div>
            ))}
        </>
    );
}