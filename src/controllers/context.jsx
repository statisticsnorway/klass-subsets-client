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
    const errorRegister = useErrorRegister([{
            status: "11034 BAD",
            message: "Something bad happend during testing of error handling",
        },
        {
            status: "15564 WARNING",
            message: "Something wrong in testing of error handling",
        }]
    );

    const subset = useSubset({
            ownerId: "Default ownerId",
            names: "Default name",
            description: "Default desc"
        }
    );

    return (
        <AppContext.Provider value={{subset, errorRegister}}>
            {children}
        </AppContext.Provider>
    );
};