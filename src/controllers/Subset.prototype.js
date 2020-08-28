import { toId, sanitize } from '../utils/strings';
import { subsetDraft, STATUS_ENUM, LANGUAGE_CODE_ENUM, acceptablePeriod } from './defaults';
import { validate } from './validator';
import { nextDefaultName } from '../internationalization/languages';
import { URN } from './klass-api';

export function Subset (data) {

    const subset = {
        // step 1 Metadata
        _id: data?.id || data?._id || '',
        _shortName: data?.shortName || data?._shortName || '',
        _name: data?.name || data?._name || [],
        _administrativeStatus: data?.administrativeStatus || data?._administrativeStatus || 'INTERNAL',
        _validFrom: data?.validFrom || data?._validFrom || null,
        _validUntil: data?.validUntil || data?._validUntil || null,
        _createdBy: data?.createdBy || data?._createdBy || '',
        _administrativeDetails: data?.administrativeDetails || data?._administrativeDetails
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
        _description: data?.description || data?._description || [],

        // step 2 Versions
        _version: data?.version || data?._version || '1',
        _previousVersions: data?._previousVersions || null,
        _versionRationale: data?.versionRationale || data?._versionRationale || [],
        _versionValidFrom: data?.versionValidFrom || data?._versionValidFrom || null,
        _versionValidUntil: data?.versionValidUntil || data?._versionValidUntil || null,

        // Step 3 and 4 Codes
        _codes: data?.codes || data?._codes || [],

        // not protected
        lastUpdatedDate: data?.lastUpdatedDate || null,
        createdDate: data?.createdDate || null
    };

    Object.assign(
        subset,
        editable(subset),
        restrictable(subset),
        versionable(subset),

        nameControl(subset),
        descriptionControl(subset),
        versionRationaleControl(subset),
        originControl(subset),
        codesControl(subset)
    );

    Object.defineProperty(subset, 'id', {
        get: () => { return subset._id; },
        set: (id = '') => {
            //console.debug('Set id', id);

            if (subset.isEditableId()) {
                subset._id = sanitize(toId(id), subsetDraft?.maxLengthId);
            }
        }
    });

    Object.defineProperty(subset, 'shortName', {
        get: () => { return subset._shortName; },
        set: (shortName = '') => {
            //console.debug('Set shortName', shortName);

            if (subset.isEditableShortName()) {
                subset._shortName = sanitize(shortName, subsetDraft?.maxLengthShortName);
                subset.id = shortName;
            }
        }
    });

    Object.defineProperty(subset, 'name', {
        get: () => { return subset._name; },
        set: (name = []) => {
            //console.debug('Set name', name);

            if (subset.isEditableName()) {
                subset._name = name;
            }
        }
    });

    Object.defineProperty(subset, 'administrativeStatus', {
        get: () => { return subset._administrativeStatus; },
        set: (status = '') => {
            console.debug('Set administrativeStatus', status, subset.isEditableStatus(), STATUS_ENUM.includes(status));

            if (subset.isEditableStatus() && STATUS_ENUM.includes(status)) {
                subset._administrativeStatus = status;
            }
        }
    });

    Object.defineProperty(subset, 'createdBy', {
        get: () => { return subset._createdBy; },
        set: (createdBy = '') => {
            //console.debug('Set createdBy', createdBy, subset.isEditableCreatedBy());

            if (subset.isEditableCreatedBy()) {
                subset._createdBy = createdBy;
            }
        }
    });

    Object.defineProperty(subset, 'administrativeDetails', {
        get: () => { return subset._administrativeDetails; },
        set: (administrativeDetails = []) => {
            //console.debug('Set administrativeDetails', administrativeDetails,
            //    subset.isEditableSubject() && subset.isEditableOrigin());

            if (subset.isEditableSubject()
                && subset.isEditableOrigin())
            {
                subset._administrativeDetails = administrativeDetails;
            }
        }
    });

    Object.defineProperty(subset, 'subject', {
        get: () => { return subset._administrativeDetails
            .find(d => d.administrativeDetailType === 'ANNOTATION').values[0];
        },
        set: (subject = '') => {
            //console.debug('Set subject', subject, subset.isEditableSubject());

            if (subset.isEditableSubject()) {
                subset._administrativeDetails
                    .find(d => d.administrativeDetailType === 'ANNOTATION')
                    .values[0] = subject;
            }
        }
    });

    Object.defineProperty(subset, 'origin', {
        get: () => {
            return subset._administrativeDetails
                .find(d => d.administrativeDetailType === 'ORIGIN').values;
        },
        set: (origin = []) => {
            console.debug('Set origin', origin, subset.isEditableOrigin());

            if (subset.isEditableOrigin()) {
                subset._administrativeDetails
                    .find(d => d.administrativeDetailType === 'ORIGIN')
                    .values = origin;

                //subset._codes = subset.codes.filter(c => subset.origin.includes(URN.toURL(c.urn).classificationURN));
            }
        }
    });

    Object.defineProperty(subset, 'isPublished', {
        get: () => { return subset._administrativeStatus  === 'OPEN';},
    });


    Object.defineProperty(subset, 'description', {
        get: () => { return subset._description; },
        set: (description = []) => {
            //console.debug('Set description', description);

            if (subset.isEditableDescription()) {
                subset._description = description;
            }
        }
    });

    Object.defineProperty(subset, 'validFrom', {
        get: () => { return subset._validFrom; },
        set: (date = null) => {
            //console.debug('Set validFrom', date, subset.isEditableValidFrom());

            if (subset.isEditableValidFrom()) {

                subset._validFrom = date;

                if (subset.isNew()) {
                    subset._versionValidFrom = subset.validFrom;
                }
            }
        }
    });

    Object.defineProperty(subset, 'validUntil', {
        get: () => { return subset._validUntil; },
        set: (date = null) => {
            //console.debug('Set validUntil', date, subset.isEditableValidUntil());

            if (subset.isEditableValidUntil()) {
                subset._validUntil = date;
            }
        }
    });

    Object.defineProperty(subset, 'version', {
        get: () => { return subset._version; }
    });

    Object.defineProperty(subset, 'latestVersion', {
        get: () => {
            if (!subset.previousVersions) {
                return null;
            }
            return subset.previousVersions.sort((a,b) =>
            a.versionValidFrom < b.versionValidFrom ? 1 :
                a.versionValidFrom > b.versionValidFrom ? -1 : 0)[0]; }
    });

    Object.defineProperty(subset, 'previousVersion', {
        get: () => {
            if (!subset.previousVersions) {
                return null;
            }
            return subset.previousVersions?.find(v => v.version === `${parseInt(subset.version) - 1}`);
        }
    });

    Object.defineProperty(subset, 'previousVersions', {
        get: () => { return subset._previousVersions; },
        set: (list = []) => {
            //console.debug('Set previousVersions', list);

            // FIXME: restrict, validate the list
            subset._previousVersions = list.sort((a, b) =>
                a.versionValidFrom < b.versionValidFrom ? -1 :
                    a.versionValidFrom > b.versionValidFrom ? 1 : 0);

            if (!subset.isNewVersion() && !subset.isNew()) {
                subset.versionValidUntil = subset.calculateVersionValidUntil();
            }
        }
    });

       Object.defineProperty(subset, 'versionValidFrom', {
        get: () => { return subset._versionValidFrom?.substr(0, 10); },
        set: (date = null) => {
            //console.debug('Set versionValidFrom', date);

            if (subset.isEditableVersionValidFrom) {

                subset._versionValidFrom = date;

                if (subset.isNew()) {
                    subset._validFrom = subset.versionValidFrom;

                } else if (subset.isBeforeCoveredPeriod(date)) {
                    subset._versionValidUntil = subset.latestVersion?.validFrom;
                    subset._validFrom = subset.versionValidFrom;

                } else if (
                    subset._versionValidFrom > subset.latestVersion?.validFrom
                    || subset.versionValidUntil === subset.latestVersion?.validFrom)
                {
                    //console.debug('Covered period or later or illegal input - clean calculated dates');

                    subset._versionValidUntil = null;
                    subset._validFrom = subset.latestVersion?.validFrom
                }
            }
        }
    });

    Object.defineProperty(subset, 'versionValidUntil', {
        get: () => { return subset._versionValidUntil?.substr(0, 10); },
        set: (date = null) => {
            //console.debug('Set versionValidUntil', date, subset.isEditableVersionValidUntil());

            if (subset.isEditableVersionValidUntil()) {

                subset._versionValidUntil = date;

                if (subset.isNew()
                    || (subset.isNewVersion() && subset.isAfterCoveredPeriod(date))
                    || (subset.isNewVersion() && subset.isAfterCoveredPeriod(subset.versionValidFrom))
                    || subset.isLatestSavedVersion())
                {
                    subset._validUntil = subset._versionValidUntil;
                }
            }
        }
    });

    Object.defineProperty(subset, 'versionRationale', {
        get: () => { return subset._versionRationale; },
        set: (versionRationale = []) => {
            //console.debug('Set versionRationale', versionRationale);

            if (subset.isEditableVersionRationale()) {
                subset._versionRationale = versionRationale;
            }
        }
    });

    Object.defineProperty(subset, 'codes', {
        get: () => { return subset._codes; },
        set: (codes = []) => {
            console.debug('Set codes', codes);

            if (subset.isEditableCodes()) {
                subset._codes = codes;
            }
        }
    });

    Object.defineProperty(subset, 'errors', {
        get: () => {
            //console.debug('Get errors', subset._errors);

            return subset._errors;
            }
    });

    Object.defineProperty(subset, 'payload', {
        get: () => {
            const payload = {
                id: subset._id,
                shortName: subset._shortName,
                name: subset._name,
                administrativeStatus: subset._administrativeStatus,
                validFrom: subset._validFrom,
                validUntil: subset._validUntil,
                createdBy: subset._createdBy,
                administrativeDetails: subset._administrativeDetails,
                description: subset._description,
                version: subset._version,
                versionRationale: subset._versionRationale,
                versionValidFrom: subset._versionValidFrom,
                codes: subset._codes
            };
            Object.keys(payload).forEach((key) => (!payload[key] && delete payload[key]));
            return payload;
        }
    });

    Object.defineProperty(subset, 'draftPayload', {
        get: () => {
            return {
                ...subset.payload,
                administrativeStatus: 'DRAFT'
            };
        }
    });

    Object.defineProperty(subset, 'publishPayload', {
        get: () => {
            return {
                ...subset.payload,
                administrativeStatus: 'OPEN'
            };
        }
    });

    return subset.validate();
}

const editable = (state = {}) => ({

    isNew() {
        /*console.debug('isNew', state.administrativeStatus === 'INTERNAL'
            && state.version === '1');
        */
        return state.administrativeStatus === 'INTERNAL'
            && state.version === '1';
    },

    isNewVersion() {
        //console.debug('isNewVersion', state.administrativeStatus === 'INTERNAL'
         //   && state.version !== '1');

        return state.administrativeStatus === 'INTERNAL'
            && state.version !== '1';
    },

    isLatestSavedVersion() {
        //console.debug('isLatestSavedVersion', state.latestVersion?.version === state.version);

        if (!state.previousVersions) {
            return null;
        }
        return state.latestVersion?.version === state.version;
    },

    isAfterCoveredPeriod(date) {
        //console.debug('isAfterCoveredPeriod', date
        //    && (date >= state.latestVersion?.validUntil || date > state.latestVersion?.versionValidFrom));

        return date
            && (date >= state.latestVersion?.validUntil
            || date > state.latestVersion?.versionValidFrom);
    },

    isBeforeCoveredPeriod(date) {
        //console.debug('isBeforeCoveredPeriod', date
        //    && state.isInAcceptablePeriod(date)
        //    && date < state.validFrom);

        return date
            && state.isInAcceptablePeriod(date)
            && date < state.validFrom;
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

    isEditableCreatedBy() {
        return true;
    },

    isEditableSubject() {
        return true;
    },

    isEditableOrigin() {
        return true;
    },

    isEditableDescription() {
        return true;
    },

    isEditableValidFrom() {
        return this.isNew() || this.isNewVersion();
    },

    isEditableValidUntil() {
        return true;
    },

    isEditableVersionValidFrom() {
        return true;
    },

    isEditableVersionValidUntil() {
        return true;
    },

    isEditableVersionRationale() {
        return true;
    },

    isEditableCodes() {
        return true;
    }
});

const restrictable = (state = {}) => ({

    isInAcceptablePeriod(date) {
        return date >= acceptablePeriod.from.toISOString()
            && date < acceptablePeriod.until.toISOString();
    },

    isAcceptableLanguageCode(lang) {
        return LANGUAGE_CODE_ENUM.includes(lang);
    },

    validate() {
        state._errors = validate.subset(state);
        return state;
    }
});

const versionable = (state = {}) => ({

    calculateNextVersionNumber() {
        //console.debug('calculateNextVersionNumber');

        return Math.max(...state.previousVersions.map(v => v.version)) + 1;
    },

    calculateVersionValidUntil() {
        //console.debug('calculateVersionValidUntil');

        const exists = state.previousVersions?.find(v => v.version === state.version);
        if (exists) {
            const next = state.previousVersions
                .filter(v => v.versionValidFrom > exists.versionValidFrom)
                .sort((a, b) =>
                    a.versionValidFrom < b.versionValidFrom ? -1 :
                        a.versionValidFrom > b.versionValidFrom ? 1 : 0)[0];
            if (next) {
                //console.debug('next', next);
                return next?.versionValidFrom;
            }
            return state.validUntil;
        }
        return state.validUntil;
    },

    createNewVersion() {
        //console.debug('createNewVersion');

        state._version = `${ state.calculateNextVersionNumber() }`;
        state.administrativeStatus = 'INTERNAL';
        state.versionRationale = [ nextDefaultName([]) ];
        state.versionValidFrom = state.latestVersion?.validUntil || null;
        state.versionValidUntil = null; 
    },

    switchToVersion(chosenVersion = '') {
        //console.debug('switchToVersion', chosenVersion);

        const exists = state.previousVersions.find(v => v.version === chosenVersion);
        if (exists) {

            state._version = exists.version;
            state._versionRationale = exists.versionRationale?.length > 0
                ? exists.versionRationale
                : [ nextDefaultName([]) ];
            state.codes = exists.codes || [];
            state._versionValidFrom = exists.versionValidFrom;
            state._versionValidUntil = state.calculateVersionValidUntil(exists);
            state._administrativeStatus = exists.administrativeStatus;

            state._validFrom = exists.validFrom;
            state._validUntil = exists.validUntil;
        }
    }
});

const nameControl = (state = {}) => ({

    addName(name = nextDefaultName(state.name)) {

        if (state.isEditableName()
            && state.name?.length < LANGUAGE_CODE_ENUM.length)
        {
            //console.debug('addName', name);

            state.name = [...state.name, name];
        }
    },

    removeNameByIndex(index) {
        if (state.isEditableName()
            && index >= 0 && index < state.name?.length)
        {
            //console.debug('removeNameByIndex', index);

            state.name = state.name?.filter((item, i) => i !== index);
        }
    },

    removeEmptyNames() {
        if (state.isEditableName()) {
            //console.debug('removeEmptyNames');

            state.name = state.name.filter(item => item.languageText?.length > 0);
        }
    },

    updateNameTextByIndex(index = -1, text = '') {
        if (state.isEditableName()
            && index >= 0 && index < state.name?.length) 
        {
            //console.debug('updateNameTextByIndex', index, text);

            state._name[index].languageText = sanitize(text, subsetDraft?.maxLengthName);
            if (!state.shortName && state.name?.length > 0) {
                state.id = toId(state.name[0].languageText);
            }
        }
    },

    updateNameLanguageByIndex(index = -1, lang = '') {
        if (state.isEditableName()
            && index >= 0 && index < state.name?.length
            && state.isAcceptableLanguageCode(lang)) 
        {
            //console.debug('updateNameLanguageByIndex', index, lang);

            state._name[index].languageCode = lang;
        }
    }
});

const descriptionControl = (state = {}) => ({

    addDescription(description = nextDefaultName(state.description)) {
        if (state.isEditableDescription()
            && state.description?.length < LANGUAGE_CODE_ENUM.length) {
            //console.debug('addDescription', description);

            state.description = [...state.description, description];
        }
    },

    removeDescriptionByIndex(index) {
        if (state.isEditableDescription()
            && index >= 0 && index < state.description?.length)
        {
            //console.debug('removeDescriptionByIndex', index);

            state.description = state.description?.filter((item, i) => i !== index);
        }
    },

    removeEmptyDescriptions() {
        if (state.isEditableDescription()) {
            //console.debug('removeEmptyDescriptions');

            state.description = state.description.filter(item => item.languageText?.length > 0);
        }
    },

    updateDescriptionTextByIndex(index = -1, text = '') {
        if (state.isEditableDescription()
            && index >= 0 && index < state.description?.length) 
        {
            //console.debug('updateDescriptionTextByIndex', index, text);

            state._description[index].languageText = sanitize(text, subsetDraft?.maxLengthDescription);
        }
    },

    updateDescriptionLanguageByIndex(index = -1, lang = '') {
        if (state.isEditableDescription()
            && index >= 0 && index < state.description?.length
            && state.isAcceptableLanguageCode(lang)) 
        {
            //console.debug('updateDescriptionLanguageByIndex', index, lang);

            state._description[index].languageCode = lang;
        }
    }
});

const versionRationaleControl = (state = {}) => ({

    addVersionRationale(versionRationale = nextDefaultName(state.versionRationale)) {
        if (state.isEditableVersionRationale()
            && state.versionRationale?.length < LANGUAGE_CODE_ENUM.length)
        {
            //console.debug('addVersionRationale', versionRationale);

            state.versionRationale = [...state.versionRationale, versionRationale];
        }
    },

    removeVersionRationaleByIndex(index) {
        if (state.isEditableVersionRationale()
            && index >= 0 && index < state.versionRationale?.length)
        {
            //console.debug('removeVersionRationaleByIndex', index);

            state.versionRationale = state.versionRationale?.filter((item, i) => i !== index)
        }
    },

    removeEmptyVersionRationales() {
        if (state.isEditableVersionRationale()) {
            //console.debug('removeEmptyVersionRationales');

            state.versionRationale = state.versionRationale.filter(item => item.languageText?.length > 0);
        }
    },


    updateVersionRationaleTextByIndex(index = -1, text = '') {
        if (state.isEditableVersionRationale()
            && index >= 0 && index < state.versionRationale?.length)
        {
            //console.debug('updateVersionRationaleTextByIndex', index, text);

            state._versionRationale[index].languageText = sanitize(text, subsetDraft?.maxLengthDescription);
        }
    },

    updateVersionRationaleLanguageByIndex(index = -1, lang = '') {
        if (state.isEditableVersionRationale()
            && index >= 0 && index < state.versionRationale?.length
            && state.isAcceptableLanguageCode(lang))
        {
            //console.debug('updateVersionRationaleLanguageByIndex', index, lang);

            state._versionRationale[index].languageCode = lang;
        }
    }
});

const originControl = (state = {}) => ({

    addOrigin(origin = '') {
        //console.debug('addOrigin', origin);

        if (URN.isClassificationPattern(origin)
            && !state.origin.includes(origin))
        {
            state.origin = [origin, ...state.origin];
        }
    },

    removeOrigin(origin = '') {
        console.debug('removeOrigin', origin);

        if (URN.isClassificationPattern(origin)) {
            state.origin = state.origin.filter(urn => urn !== origin);
            // TODO: move to defineProperty 'origin
            state.codes = state._codes.filter(c => !c.urn.startsWith(origin));
        }
    }

});

const codesControl = (state = {}) => ({

    isChosenCode(urn = '') {
        //console.debug('isChosenCode', state.codes.findIndex(c => c.urn === urn) > -1);

        if (URN.isCodePattern(urn))
        {
            return state.codes.findIndex(c => c.urn === urn) > -1;
        }
    }

});
