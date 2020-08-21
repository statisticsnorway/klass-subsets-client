import {toId, sanitize} from '../utils/strings';
import {subsetDraft, STATUS_ENUM} from './defaults';

export function Subset (data) {

    const subset  = {
        _id: data?.id || data?._id || '',
        _name: data?.name || data?._name || [],
        _shortName: data?.shortName || data?._shortName || '',
        _administrativeStatus: data?.administrativeStatus || data?._administrativeStatus || 'INTERNAL',
        _validFrom: data?.validFrom || data?._validFrom || null,
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
        _version: data?.version || data?._version || '1',
        versionRationale: data?.versionRationale || [],
        versionValidFrom: data?.versionValidFrom || null,
        versionValidUntil: data?.versionValidUntil || null, // just for local use, not part of Classification scheme
        codes: data?.codes || [],
        lastUpdatedDate: data?.lastUpdatedDate || null
    }

    Object.assign(
        subset,
        editable(subset),
        updatable(subset)
    );

    Object.defineProperty(subset, 'id', {
        get: () => { return subset._id },
        set: (id = '') => {
            if (subset.isEditableId()) {
                subset._id = toId(id);
                subset._shortName = id;
            }
        }
    });

    Object.defineProperty(subset, 'name', {
        get: () => { return subset._name },
        set: (name = []) => {
            if (subset.isEditableName()) {
                subset._name = name;
            }
        }
    });

    Object.defineProperty(subset, 'shortName', {
        get: () => { return subset._shortName },
        set: (shortName = '') => {
            if (subset.isEditableShortName()) {
                subset._shortName = sanitize(shortName, subsetDraft?.maxLengthShortName);
            }
        }
    });

    Object.defineProperty(subset, 'administrativeStatus', {
        get: () => { return subset._administrativeStatus },
        set: (status = '') => {
            if (subset.isEditableStatus() && STATUS_ENUM.includes(status)) {
                subset._administrativeStatus = status;
            }
        }
    });

    Object.defineProperty(subset, 'version', {
        get: () => { return subset._version },
        set: (version = '') => {
            if (subset.isEditableStatus() && parseInt(version)) {
                subset._version = version;
            }
        }
    });

    return subset;
}

const editable = (state = {}) => ({

    isEditableId() {
        return state._administrativeStatus === 'INTERNAL'
            && state._version === '1';
    },

    isEditableShortName() {
        return true;
    },

    isEditableName() {
        return true;
    },

    isEditableStatus() {
        return true;
    }
});

const updatable = (state = {}) => ({

    updateNameTextByIndex(index, text) {
        if (state.isEditableName()
            && index >= 0 && index < state._name?.length) {
            state._name[index].languageText = sanitize(text, subsetDraft?.maxLengthName);
            if (!state._shortName && state._name?.length > 0) {
                state.id = toId(text);
            }
        }
    }

});