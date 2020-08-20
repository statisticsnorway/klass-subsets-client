import React, {createContext, useEffect} from 'react';
import {useSubset, useSubset2} from './useSubset';
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

// TODO: backup the context in session storage every 1 min?
// TODO: remove draft from session storage after successful submitting to the server
export const ContextProvider = ({ children }) => {
    const errorRegister = useErrorRegister(
        /* FIXME: for visible test purposes. Remove before release! */
            []
    );

    const subset2 = useSubset2();
    useEffect(() => console.log({ newState2: subset2.draft }),[subset2.draft]);

    const subset = useSubset();
    useEffect(() => console.log({ newState: subset.draft }),[subset.draft]);

    return (
        <AppContext.Provider value={{subset2, errorRegister}}>
            {children}
        </AppContext.Provider>
    );
};