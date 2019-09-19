import React, { createContext } from "react";
import { useSubset } from "../utils/useSubset";
import { useErrorRegister } from "../utils/useErrorRegister";

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
            [{
            status: "0",
            message: "Temporary: visual test 1 of error handling",
            source: "initial data"
        },
        {
            status: "1",
            message: "Temporary: visual test 2 of error handling",
            source: "initial data"
        }]
    );

    const subset = useSubset({
        ownerId: "Default ownerId",
        names: "Default name",
        description: "Default desc",
        codes: [
            {name: 'Item 1'},
            {name: 'Item 2'},
            {name: 'Item 3'}
        ]}
    );

    return (
        <AppContext.Provider value={{subset, errorRegister}}>
            {children}
        </AppContext.Provider>
    );
};