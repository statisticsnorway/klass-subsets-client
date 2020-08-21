import {toId, sanitize} from '../utils/strings';
import {subsetDraft} from './defaults';

export function Subset (data) {
    console.log({_data: data})
    const _subset  = {
        _id: data?.id || '',
        name: data?.name || [],
        shortName: data?.shortName || '',
        administrativeStatus: data?.administrativeStatus || 'INTERNAL',
        validFrom: data?.validFrom || null,
        validUntil: data?.validUntil || null,
        createdBy: data?.createdBy || '',
        administrativeDetails: data?.administrativeDetails
            || [
            {
                administrativeDetailType: 'ANNOTATION',
                values: []
            },
            {
                administrativeDetailType: 'ORIGIN',
                values: []
            }
        ],
        description: data?.description || [],
        version: data?.version || '1',
        versionRationale: data?.versionRationale || [],
        versionValidFrom: data?.versionValidFrom || null,
        versionValidUntil: data?.versionValidUntil || null, // just for local use, not part of Classification scheme
        codes: data?.codes || []
    }

    Object.assign(
        _subset,
        editable(_subset),
        updatable(_subset)
    );

    Object.defineProperty(_subset, 'id', {
        get: () => { return _subset._id },
        set: (id) => {
            console.log('set id', id);
            if (_subset.isEditableId()) {
                _subset._id = toId(id);
                _subset.updateShortName(id);
            }
        }
    });

    return _subset;
}

const editable = (state) => ({
    isEditableId() {
        return state._administrativeStatus === 'INTERNAL'
            && state._version === '1';
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
            state._shortName = sanitize(shortName, subsetDraft.maxLengthShortName);
        }
    },

    updateNameTextByIndex(index, text) {
        if (state.isEditableName()
            && index >= 0 && index < state.name.length) {
            state._name[index].languageText = sanitize(text, subsetDraft.maxLengthName);
            if (!state._shortName && state._name.length > 0) {
                state.id = toId(text);
            }
        }
    }
});