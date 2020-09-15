import { useReducer, useEffect } from 'react';
import { URN } from './klass-api';
import { Subset } from './Subset.prototype';

let errors = {
    id: [],
    name: [],
    validFrom: [],
    validUntil: [],
    period: [],
    createdBy: [],
    annotation: [],
    description: [],
    versionRationale: [],
    versionValidFrom: [],
    versionValidUntil: [],
    versionPeriod: [],
    origin: [],
    codes: []
};

function subsetReducer(state, {action, data = {}}) {
    console.info({action, data});
    switch (action) {
        case 'edit': {
            return Subset({...data,
                administrativeStatus: data?.administrativeStatus || 'DRAFT'
            });
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
        case 'from': {
            state.validFrom = data;
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
        case 'previous_versions': {
            state.previousVersions = data;
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
            data === 'New version'
                ? state.createNewVersion()
                : state.switchToVersion(data);
            return Subset({...state});
        }
        case 'to': {
            state.validUntil = data;
            return Subset({...state});
        }
        case 'createdBy': {
            state.createdBy = data;
            return  Subset({...state});
        }
        case 'subject': {
            // FIXME: mutable change
            state.subject = data;
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
        case 'codes_cache': {
            state.codes = state.codes.map(s => s.urn !== data.urn ? s : {...s, ...data});
            return state;
        }
        case 'reset': {
            sessionStorage.removeItem('draft');
            return Subset();
        }
        default:
            return state;
    }
}

function reorder(list) {
    if (list?.length > 0) {
        list.sort((a, b) => (a.rank - b.rank -1));
    }
    return rerank(list);
}

function rerank(list) {
    return list.map((item, i) => ({
        ...item,
        rank: i + 1
    }));
}

export const useSubset = (init = Subset()) => {

    // FIXME: if the draft in session storage is undefined, the whole app crashes with error message:
    // Error: A cross-origin error was thrown. React doesn't have access to the actual error object in development.
    // FIX: try catch
     const [draft, dispatch] = useReducer(subsetReducer, initialize());

    // FIXME: runs on every draft update, should run once the hook is initialized in the context
    // FIXME: discard on non-valid draft and return init
    function initialize() {
        const restored = JSON.parse(sessionStorage.getItem('draft'));
        return restored ? Subset({...init, ...restored}) : Subset();
    }

    useEffect(() => {
        sessionStorage.setItem('draft', JSON.stringify(draft));
    }, [draft]);

    return {draft, dispatch, errors};
};
