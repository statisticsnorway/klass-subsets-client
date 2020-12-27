import { useReducer, useEffect } from 'react';
import { Subset } from './subset/Subset.prototype';

function subsetReducer( state, { action, data = {} }) {
    console.info({ action, data });
    switch (action) {
        case 'edit': {
            return Subset({...data });
        }
        case 'name_text': {
            state.updateNameTextByIndex(data.index, data.text);
            return Subset({...state});
        }
        case 'name_lang': {
            state.updateNameLanguageByIndex(data.index, data.lang);
            return Subset({...state});
        }
        case 'name_add': {
            state.addName();
            return Subset({...state});
        }
        case 'name_remove': {
            state.removeNameByIndex(data);
            return Subset({...state});
        }
        case 'shortName_update': {
            state.shortName = data;
            return Subset({...state});
        }
        case 'version_from': {
            state.versionValidFrom = data;
            return Subset({...state});
        }
        case 'version_to': {
            state.versionValidUntil = data;
            return Subset({...state});
        }
        case 'version_rationale_add': {
            state.addVersionRationale();
            return Subset({...state});
        }
        case 'version_rationale_remove': {
            state.removeVersionRationaleByIndex(data);
            return Subset({...state});
        }
        case 'version_rationale_text': {
            state.updateVersionRationaleTextByIndex(data.index, data.text);
            return Subset({...state});
        }
        case 'version_rationale_lang': {
            state.updateVersionRationaleLanguageByIndex(data.index, data.lang);
            return Subset({...state});
        }
        case 'version_switch': {
            state.currentVersion =
                data?.id === 'Create new version'
                ? state.createNewVersion()
                : data;
            return Subset({...state});
        }
        case 'owningSection': {
            state.owningSection = data;
            return  Subset({...state});
        }
        case 'classificationFamily': {
            // FIXME: mutable change
            state.classificationFamily = data;
            return Subset({...state});
        }
        case 'description_text': {
            state.updateDescriptionTextByIndex(data.index, data.text);
            return Subset({...state});
        }
        case 'description_lang': {
            state.updateDescriptionLanguageByIndex(data.index, data.lang);
            return Subset({...state});
        }
        case 'description_init': {
            if (state.description?.length !== 0) return state;
            state.addDescription();
            return Subset({...state});
        }
        case 'description_add': {
            state.addDescription();
            return Subset({...state});
        }
        case 'description_remove': {
            state.removeDescriptionByIndex(data);
            return Subset({...state});
        }
        case 'remove_empty': {
            state.removeEmptyNames();
            state.removeEmptyDescriptions();
            state.removeEmptyVersionRationales();
            return Subset({...state});
        }
        // DOCME: if a codelist is chosen, but no codes are checked,
        //  the code list remains in the subset until it explicitly excluded.
        case 'codelist_include': {
            state.addOrigin(data);
            return Subset({...state});
        }
        case 'codelist_exclude': {
            state.removeOrigin(data);
            return Subset({...state});
        }
        case 'codes_include': {
            state.prependCodes(data);
            return Subset({...state});
        }
        case 'codes_exclude': {
            state.removeCodes(data);
            return Subset({...state});
        }
        case 'codes_rerank': {
            state.changeRank(data.rank, data.codes)
            return Subset({...state});
        }
        case 'reset': {
            sessionStorage.removeItem('draft');
            return Subset();
        }
        default:
            return state;
    }
}

export const useSubset = (init = Subset()) => {

    // FIXME: if the draft in session storage is undefined, the whole app crashes with error message:
    // Error: A cross-origin error was thrown. React doesn't have access to the actual error object in development.
    // FIX: try catch
     const [ draft, dispatch ] = useReducer(subsetReducer, initialize());

    // FIXME: runs on every draft update, should run once the hook is initialized in the context
    // FIXME: discard on non-valid draft and return init
    function initialize() {
        const restored = JSON.parse(sessionStorage.getItem('draft'));
        return restored ? Subset({...init, ...restored}) : Subset();
    }

    useEffect(() => {
        sessionStorage.setItem('draft', JSON.stringify(draft));
    }, [ draft ]);

    return { draft, dispatch };
};
