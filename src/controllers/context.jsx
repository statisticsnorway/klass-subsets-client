import React, {createContext, useEffect} from 'react';
import {useSubset} from './useSubset';
import {useErrorRegister} from './useErrorRegister';

/** Context Principles
 *
 * @param All children components gat access to the application state variables and state update methods by using useContext hook
 * @returns Application global variables and state update methods. CpntextProvider only can change the app state variables.
 * @constructor initial state to each application state variable
 *
 * Application state variables:
 *  DOCME: update the list
 * - config
 * - operational messages
 * - application messages
 * - subset draft
 * - form related data
 * - user info
 * - language settings
 * - search filters
 * - style preferences
 *
 */

export const AppContext = createContext({});

export const ContextProvider = ({ children }) => {
    const errorRegister = useErrorRegister([]);

    const subset = useSubset();
    useEffect(() => console.info({ newState: subset.draft }),[subset.draft]);

    return (
        <AppContext.Provider value={{subset, errorRegister}}>
            {children}
        </AppContext.Provider>
    );
};
