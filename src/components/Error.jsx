import React, {useContext} from "react";
import {AppContext} from "../controllers/context";

export default function Error() {
    const {errorRegister} = useContext(AppContext);

    return (
        <>
            { errorRegister.errors.map((error, index) => (
                <div key={index}>
                    <span style={{color: "red"}}>{`${error.status}: ${error.message}`}</span>
                    <button
                        style={{color: "red", background: "none", border: "none", fontWeight: "600"}}
                        onClick={(e) => {errorRegister.dispatch({action: "remove", data: index})}}
                    >x
                    </button>
                </div>
            ))}
            { errorRegister.errors.length > 1 &&
                <button onClick={(e) => {errorRegister.dispatch({action: "empty"})}}
                >Dismiss all</button>
            }
        </>
    );
}