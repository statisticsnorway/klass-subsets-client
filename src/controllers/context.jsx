import React, {createContext, useEffect} from 'react';
import {useSubset} from '../utils/useSubset';
import {useErrorRegister} from '../utils/useErrorRegister';
import {useGet} from './klass-api';

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

    // TODO: better defaults
    const subset = useSubset();

    useEffect(() => console.log({ newState: subset.draft }),[subset.draft]);

    // FIXME: more flexible url building based on first response?
    const [classifications] = useGet('classifications.json?includeCodelists=true&page=0&size=1000');

    return (
        <AppContext.Provider value={{subset, errorRegister, classifications}}>
            {children}
        </AppContext.Provider>
    );
};