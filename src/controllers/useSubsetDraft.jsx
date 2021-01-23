import { useReducer, useEffect } from 'react';
import { Subset } from 'models';

function subsetReducer( state, { action, data = {} }) {
    console.info({ action, data, state });
    switch (action) {
        case 'edit': {
            if (state.id === data.id) return state;
            return Subset({...data });
        }
        case 'metadata_sync': {
            if (state.id === data.id) {
                state.name = data.name;
                state.lastModified = data.lastModified;
                state.createdDate = data.createdDate;
                state.shortName = data.shortName;
                state.owningSection = data.owningSection;
                state.classificationFamily = data.classificationFamily;
                state.description = data.description;
            }
            return Subset({...state });
        }
        case 'name_text': {
            state.updateNameTextByIndex(data.index, data.text);
            return Subset({...state});
        }
        case 'name_lang': {
            state.updateNameLanguageByIndex(data.index, data.lang);
            return Subset({...state});
        }
        case 'name_init': {
            if (state.name?.length !== 0) return state;
            state.addName();
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
        case 'version_from': {
            state.versionValidFrom = data;
            return Subset({...state});
        }
        case 'version_to': {
            state.versionValidUntil = data;
            return Subset({...state});
        }
        case 'version_to_sync': {
            const exists = state.versions.find(v => v.versionId === data.versionId);
            if (!exists
                || exists.administrativeStatus !== 'OPEN'
                || data.lastModified <= exists.lastModified
            ) return state;

            // DOCME: when the lastModified is updated it wont be possible to sync other fields
            exists.validUntil = data.validUntil;
            exists.lastModified = data.lastModified;
            return Subset({...state});
        }
        case 'version_rationale_init': {
            if (state.versionRationale?.length !== 0) return state;
            state.addVersionRationale();
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
        case 'version_init': {
            if (state.versions?.length !== 0) return state;
            state.currentVersion = state.createNewVersion();
            return Subset({...state});
        }
        case 'version_switch': {
            if (state.currentVersion?.versionId === data?.versionId) return state;
            console.log('changing current version)')
            state.currentVersion =
                data?.versionId === `${ state.versions?.length + 1 }`
                    ? state.createNewVersion()
                    : data;
            return Subset({...state});
        }
        case 'version_sync': {
            state.syncVersion(data.update, data.tempId);
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

export const useSubsetDraft = (init = Subset()) => {

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
