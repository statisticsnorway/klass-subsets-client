import React, {useContext} from "react";
import {AppContext} from "../controllers/context";

export default function Error() {
    const {errorRegister} = useContext(AppContext);

    return (
        <>
            { errorRegister.errors.map((error, index) => (
                <div key={index} >
                    <span style={{color: "red"}}>{`${error.status}: ${error.message}`}</span>
                    <button
                        style={{color:"red", background:"none", border:"none", fontWeight: "400"}}
                        onClick={(e) => {
                            //e.target.parentElement.remove();
                            errorRegister.dispatch({action: "remove", data: index})
                        }}
                    >x
                    </button>
                </div>
            ))}
        </>
    );
}