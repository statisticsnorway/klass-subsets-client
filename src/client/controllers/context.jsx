import React, {createContext, useEffect} from 'react';
import { useSubset } from '../utils/useSubset';
import { useErrorRegister } from '../utils/useErrorRegister';
import { useGet } from './klass-api';

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

// TODO: backup the context in session storage every 1 min?
// TODO: remove draft from session storage after successful submitting to the server
export const ContextProvider = ({ children }) => {
    const errorRegister = useErrorRegister(
        /* FIXME: for visible test purposes. Remove before release! */
            []
    );

    // TODO: better defaults
    const draft = {
        ownerId: '',
        names: [],
        valid: { from: new Date(), to: null },
        subject: '',
        descriptions: [],
        classifications: [
            {
                "name": "Standard for næringsgruppering (SN)",
                "classificationType": "Klassifikasjon",
                "lastModified": "2020-01-22T07:56:26.000+0000",
                "_links": {
                    "self": {
                        "href": "https://data.ssb.no/api/klass/v1/classifications/6"
                    }
                },
                "included": true,
                "codes": [
                    {
                        "code": "01",
                        "parentCode": "A",
                        "level": "2",
                        "name": "Jordbruk og tjenester tilknyttet jordbruk, jakt og viltstell",
                        "shortName": "Jordbruk, tilhør. tjenester, jakt",
                        "presentationName": "",
                        "title": "01 Jordbruk og tjenester tilknyttet jordbruk, jakt og viltstell",
                        "classification": "Standard for næringsgruppering (SN)"
                    },
                    {
                        "code": "01.11",
                        "parentCode": "01.1",
                        "level": "4",
                        "name": "Dyrking av korn (unntatt ris), belgvekster og oljeholdige vekster",
                        "shortName": "Dyrking av korn, belgvekster mv.",
                        "presentationName": "",
                        "title": "01.11 Dyrking av korn (unntatt ris), belgvekster og oljeholdige vekster",
                        "included": true,
                        "rank": 1,
                        "classification": "Standard for næringsgruppering (SN)"
                    },
                    {
                        "code": "01.12",
                        "parentCode": "01.1",
                        "level": "4",
                        "name": "Dyrking av ris",
                        "shortName": "Dyrking av ris",
                        "presentationName": "",
                        "included": true,
                        "title": "01.12 Dyrking av ris",
                        "rank": 2,
                        "classification": "Standard for næringsgruppering (SN)"
                    },
                    {
                        "code": "01.13",
                        "parentCode": "01.1",
                        "level": "4",
                        "name": "Dyrking av grønnsaker, meloner, rot- og knollvekster",
                        "shortName": "Dyrking av grønnsaker, poteter mv.",
                        "presentationName": "",
                        "included": true,
                        "title": "01.13 Dyrking av grønnsaker, meloner, rot- og knollvekster",
                        "rank": 3,
                        "classification": "Standard for næringsgruppering (SN)"
                    },
                    {
                        "code": "01.14",
                        "parentCode": "01.1",
                        "level": "4",
                        "name": "Dyrking av sukkerrør",
                        "shortName": "Dyrking av sukkerrør",
                        "presentationName": "",
                        "title": "01.14 Dyrking av sukkerrør",
                        "classification": "Standard for næringsgruppering (SN)"
                    }
                ]
            }
        ]
    };
    const subset = useSubset(draft);

    useEffect(() => console.log({ newState: subset.draft }),[subset.draft]);

    const [ssbsections] = useGet('ssbsections.json');
    const [classificationfamilies] = useGet('classificationfamilies.json');
    // FIXME: more flexible url building based on first response?
    const [classifications] = useGet('classifications.json?includeCodelists=true&page=0&size=1000');

    return (
        <AppContext.Provider value={{subset, errorRegister, ssbsections, classificationfamilies, classifications}}>
            {children}
        </AppContext.Provider>
    );
};