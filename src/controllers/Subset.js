import {toId, sanitize} from '../utils/strings';
import {subsetDraft} from './defaults';

export function Subset (data) {
    const init  = {
        id: '',
        name: [],
        shortName: '',
        administrativeStatus: 'INTERNAL',
        validFrom: null,
        validUntil: null,
        createdBy: '',
        administrativeDetails: [
            {
                administrativeDetailType: 'ANNOTATION',
                values: []
            },
            {
                administrativeDetailType: 'ORIGIN',
                values: []
            }
        ],
        description: [],
        version: '1',
        versionRationale: [],
        versionValidFrom: null,
        versionValidUntil: null, // just for local use, not part of Classification scheme
        codes: []
    }

    const subset = {...init, ...data};

    return Object.assign(
        subset,
        editable(subset),
        updatable(subset)
    );
}

const editable = (state) => ({
    isEditableId() {
        return state.administrativeStatus === 'INTERNAL'
            && state.version === '1';
    },

    isEditableShortName() {
        return true;
    },

    isEditableName() {
        return true;
    }
});

const updatable = (state) => ({
    updateId(id) {
        if (state.isEditableId()) {
            state.id = toId(id);
            state.updateShortName(id);
        }
    },

    updateShortName(shortName) {
        if (state.isEditableShortName()) {
            state.shortName = sanitize(shortName, subsetDraft.maxLengthShortName);
        }
    },

    updateNameTextByIndex(index, text) {
        if (state.isEditableName()
            && index >= 0 && index < state.name.length) {
            state.name[index].languageText = sanitize(text, subsetDraft.maxLengthName);
            if (!state.shortName && state.name.length > 0) {
                state.updateId(toId(text));
            }
        }
    }
});