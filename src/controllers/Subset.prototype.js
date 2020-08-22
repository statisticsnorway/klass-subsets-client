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
        versionValidFrom: data?.versionValidFrom || null,
        _versionValidUntil: data?.versionValidUntil || data?._versionValidUntil || null,
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
        get: () => { return subset._id; },
        set: (id = '') => {
            console.debug('Set id', id);

            if (subset.isEditableId()) {
                subset._id = sanitize(toId(id), subsetDraft?.maxLengthId);
            }
        }
    });

    Object.defineProperty(subset, 'shortName', {
        get: () => { return subset._shortName; },
        set: (shortName = '') => {
            console.debug('Set shortName', shortName);

            if (subset.isEditableShortName()) {
                subset._shortName = sanitize(shortName, subsetDraft?.maxLengthShortName);
                subset.id = shortName;
            }
        }
    });

    Object.defineProperty(subset, 'name', {
        get: () => {
            console.debug('Get name', subset._name);

            return subset._name
        },
        set: (name = []) => {
            console.debug('Set name', name);

            if (subset.isEditableName()) {
                subset._name = name;
            }
        }
    });

    Object.defineProperty(subset, 'administrativeStatus', {
        get: () => { return subset._administrativeStatus; },
        set: (status = '') => {
            console.debug('Set administrativeStatus', status);

            if (subset.isEditableStatus() && STATUS_ENUM.includes(status)) {
                subset._administrativeStatus = status;
            }
        }
    });

    Object.defineProperty(subset, 'isPublished', {
        get: () => { return subset._administrativeStatus  === 'OPEN'; },
    });

    Object.defineProperty(subset, 'validFrom', {
        get: () => { return subset._validFrom; },
        set: (date = null) => {
            console.debug('Set validFrom', date);

            if (subset.isEditableValidFrom()
                && subset.isInAcceptablePeriod(date))
            {
                subset._validFrom = date;
                
                if (subset.isNew()) {
                    subset.versionValidFrom = date;
                }
            }
        }
    });

    Object.defineProperty(subset, 'version', {
        get: () => { return subset._version; }
    });

    Object.defineProperty(subset, 'previousSubsets', {
        get: () => { return subset._previousSubsets; },
        set: (list = []) => {
            console.debug('Set previousSubsets', list);

            // FIXME: restrict, validate the list
            subset._previousSubsets = list.sort((a, b) =>
                a.versionValidFrom < b.versionValidFrom ? -1 :
                    a.versionValidFrom > b.versionValidFrom ? 1 : 0);

            subset.versionValidUntil = subset.calculateVersionValidUntil();
        }
    });

    Object.defineProperty(subset, 'versionValidUntil', {
        get: () => { return subset._versionValidUntil; },
        set: (date = null) => {
            console.debug('Set versionValidUntil', date);

            if (!date || subset.isInAcceptablePeriod(date)) {
                subset._versionValidUntil = date;
            }
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
            console.debug('updateNameTextByIndex', index, text);

            state._name[index].languageText = sanitize(text, subsetDraft?.maxLengthName);
            if (!state.shortName && state.name?.length > 0) {
                state.id = toId(text);
            }
        }
    },

    updateNameLanguageByIndex(index = -1, lang = '') {
        if (state.isEditableName()
            && index >= 0 && index < state.name?.length
            && state.isAcceptableLanguageCode(lang))
        {
            console.debug('updateNameLanguageByIndex', index, lang);

            state._name[index].languageCode = lang;
        }
    },

    addName(name) {
        if (state.isEditableName()
            && state.name?.length < LANGUAGE_CODE_ENUM.length)
        {
            console.debug('addName', name);

            state._name = [ ...state._name, name ];
        }
    },

    removeNameByIndex(index) {
        if (state.isEditableName()
            && index >= 0 && index < state._name?.length)
        {
            console.debug('removeNameByIndex', index);

            state._name = state.name?.filter((item, i) => i !== index)
        }
    },

    calculateVersionValidUntil() {
        console.debug('calculateVersionValidUntil');

        const exists = state.previousSubsets?.find(v => v.version === state.version);
        if (exists) {
            const next = state.previousSubsets.filter(v => v.versionValidFrom > exists.versionValidFrom)
                .sort((a, b) =>
                    a.versionValidFrom < b.versionValidFrom ? -1 :
                        a.versionValidFrom > b.versionValidFrom ? 1 : 0)[0];

            return next?.versionValidFrom || state._versionValidUntil || null
        }
        return state._versionValidUntil;
    }

});

const restrictable = (state = {}) => ({

    isInAcceptablePeriod(date) {
        return date >= axceptablePeriod.from
            && date < axceptablePeriod.until;
    },
    
    isAcceptableLanguageCode(lang) {
        return LANGUAGE_CODE_ENUM.includes(lang);
    }
    
});