import {toId, sanitize} from '../utils/strings';
import {subsetDraft, STATUS_ENUM, LANGUAGE_CODE_ENUM, axceptablePeriod} from './defaults';

export function Subset (data) {

    const subset  = {
        _id: data?.id || data?._id || '',
        _shortName: data?.shortName || data?._shortName || '',
        _name: data?.name || data?._name || [],
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
        _versionValidFrom: data?.versionValidFrom || data?._versionValidFrom || null,
        versionValidUntil: data?.versionValidUntil || null, // just for local use, not part of Classification scheme
        codes: data?.codes || [],
        lastUpdatedDate: data?.lastUpdatedDate || null,
        _previousSubsets: data?._previousSubsets || []
    }

    Object.assign(
        subset,
        editable(subset),
        updatable(subset),
        restrictable(subset)
    );

    Object.defineProperty(subset, 'id', {
        get: () => { return subset._id },
        set: (id = '') => {
            if (subset.isEditableId()) {
                subset._id = sanitize(toId(id), subsetDraft?.maxLengthId);
            }
        }
    });

    Object.defineProperty(subset, 'shortName', {
        get: () => { return subset._shortName },
        set: (shortName = '') => {
            if (subset.isEditableShortName()) {
                subset._shortName = sanitize(shortName, subsetDraft?.maxLengthShortName);
                subset.id = shortName;
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

    Object.defineProperty(subset, 'administrativeStatus', {
        get: () => { return subset._administrativeStatus },
        set: (status = '') => {
            if (subset.isEditableStatus() && STATUS_ENUM.includes(status)) {
                subset._administrativeStatus = status;
            }
        }
    });

    Object.defineProperty(subset, 'isPublished', {
        get: () => { return subset._administrativeStatus  === 'OPEN' },
    });

    Object.defineProperty(subset, 'validFrom', {
        get: () => { return subset._validFrom },
        set: (date = null) => {
            if (subset.isEditableValidFrom()
                && subset.isInAxceptablePeriod(date))
            {
                subset._validFrom = date;
                if (subset.isNew()) {
                    subset.versionValidFrom = date;
                }
            }
        }
    });

    Object.defineProperty(subset, 'version', {
        get: () => { return subset._version }
    });

    Object.defineProperty(subset, 'versionValidFrom', {
        get: () => { return subset._versionValidFrom },
        set: (date = null) => {
        }
    });

    Object.defineProperty(subset, 'previousSubsets', {
        get: () => { return subset._previousSubsets },
        set: (list = []) => {
            // FIXME: restrict, validate
            subset._previousSubsets = list;
        }
    });

    Object.defineProperty(subset, 'payload', {
        get: () => {
            const payload = {
                id: subset.id,
                shortName: subset.shortName,
                name: subset.name,
                administrativeStatus: subset.administrativeStatus,
                validFrom: subset.validFrom,
                validUntil: subset.validUntil,
                createdBy: subset.createdBy,
                administrativeDetails: subset.administrativeDetails,
                description: subset.description,
                version: subset.version,
                versionRationale: subset.versionRationale,
                versionValidFrom: subset.versionValidFrom,
                codes: subset.codes,
                lastUpdatedDate: new Date().toISOString()  // FIXME: has to be set on backend side+
            };
            Object.keys(payload).forEach((key) => (!payload[key] && delete payload[key]));
            return payload;
        }
    })

    return subset;
}

const editable = (state = {}) => ({

    isNew() {
        return state._administrativeStatus === 'INTERNAL'
            && state._version === '1'
    },

    isEditableId() {
        return this.isNew();
    },

    isEditableShortName() {
        return true;
    },

    isEditableName() {
        return true;
    },

    isEditableStatus() {
        return true;
    },

    isEditableValidFrom() {
        return this.isNew();
    },

    isEditableVersion() {
        return true;
    },

    isEditableVersionValidFrom() {
        return true;
    }
});

const updatable = (state = {}) => ({

    updateNameTextByIndex(index = -1, text = '') {
        if (state.isEditableName()
            && index >= 0 && index < state._name?.length)
        {
            state._name[index].languageText = sanitize(text, subsetDraft?.maxLengthName);
            if (!state.shortName && state.name?.length > 0) {
                state.id = toId(text);
            }
        }
    },

    updateNameLanguageByIndex(index = -1, lang = '') {
        if (state.isEditableName()
            && index >= 0 && index < state.name?.length
            && state.isAxceptableLanguageCode(lang))
        {
            state._name[index].languageCode = lang;
        }
    },

    addName(name) {
        if (state.isEditableName()
            && state.name?.length < LANGUAGE_CODE_ENUM.length)
        {
            state._name.push(name);
        }
    },

    removeNameByIndex(index) {
        if (state.isEditableName()
            && index >= 0 && index < state._name?.length)
        {
            state._name = state.name?.filter((item, i) => i !== index)
        }
    }

});

const restrictable = (state = {}) => ({

    isInAxceptablePeriod(date) {
        return date >= axceptablePeriod.from
            && date < axceptablePeriod.until;
    },
    
    isAxceptableLanguageCode(lang) {
        return LANGUAGE_CODE_ENUM.includes(lang);
    }
    
});