import React, {createContext, useEffect} from "react";
import { useSubset } from "../utils/useSubset";
import { useErrorRegister } from "../utils/useErrorRegister";
import { useGet } from "./klass-api";

/** Context Principles
 *
 * @param All children components gat access to the application state variables and state update methods by using useContext hook
 * @returns Application global variables and state update methods. CpntextProvider only can change the app state variables.
 * @constructor initial state to each application state variable
 *
 * Application state variables:
 *  TODO: update the list
 * - config
 * - operational messages
 * - application messages
 * - subset draft
 * - last fetched subset
 * - form related data
 * - user info
 * - language settings
 * - search filters
 * - style preferences
 * - SSB sections
 *
 */

export const AppContext = createContext({});

export const ContextProvider = ({ children }) => {
    const errorRegister = useErrorRegister(
        /* FIXME: for visible test purposes. Remove before release! */
            []
    );

    const subset = useSubset({
        ownerId: "",
        names: [{ text: "Uttrekk for ...", lang: "nb" }],
        valid: { from: new Date().toISOString().substr(0, 10) },
        subject: "Work",
        descriptions: [{ text: "Beskrivelse", lang: "nb" }],
        codes: []
    });

    useEffect(() => console.log({ newState: subset.draft }),[subset.draft]);

    const [ssbsections] = useGet("ssbsections.json");

    return (
        <AppContext.Provider value={{subset, errorRegister, ssbsections}}>
            {children}
        </AppContext.Provider>
    );
};