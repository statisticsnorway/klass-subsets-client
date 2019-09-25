import React, {createContext, useEffect} from "react";
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
            { title: 'Arbeid', children:
                    [
                        { title: 'A dfg' },
                        { title: 'B xfdggfh' },
                        { title: 'C xc' },
                        { title: 'D dfgs' },
                        { title: 'E salølæsødlfæsød' },
                    ]
            },
            { title: 'Yrke', children:
                    [
                        { title: '1 dfg' },
                        { title: '2 xfdggfh' },
                        { title: '3 xc' },
                        { title: '4 dfgs' },
                        { title: '5 salølæsødlfæsød' },
                        { title: '6 Zzzsødlfæsød' },
                    ],
                hidden: false
            }
        ]
    });

    useEffect(() => console.log({ newState: subset.draft }),[subset.draft]);

    return (
        <AppContext.Provider value={{subset, errorRegister}}>
            {children}
        </AppContext.Provider>
    );
};