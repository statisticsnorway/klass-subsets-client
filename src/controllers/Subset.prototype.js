import { subsetDraft, STATUS_ENUM, languages, acceptablePeriod } from '../defaults';
import { nextDefaultName } from '../internationalization/languages';
import { URN } from './klass-api';
import { errorsControl } from './errorsControl';
import { versionable } from './versionsControl';
import { toId, sanitize, datePattern } from '../utils/strings';
import {orderByValidFromAsc, orderByValidFromDesc} from "../utils/arrays";

export function Subset (data) {
    const subset = {
        // step 1 Metadata

        _id: data?.id || data?._id || '',
        _shortName: data?.shortName || data?._shortName || '',
        _name: data?.name || data?._name || [],
        _classificationFamily: data?.classificationFamily || data?._classificationFamily,
        _owningSection: data?.owningSection || data?._owningSection || '',
        _description: data?.description || data?._description || [],
        _versions: data?.versions || data?._versions || [],

        // internal control
        // FIXME: default - a version valid at loading date
        _currentVersion: data?._currentVersion || data?.versions[0] || {},

        // not protected
        lastModified: data?.lastModified || null,
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
        /*originControl(subset),
        codesControl(subset),
        errorsControl(subset)*/
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

    Object.defineProperty(subset, 'createdBy', {
        get: () => { return subset._owningSection; },
        set: (createdBy = '') => {
            //console.debug('Set createdBy', createdBy, subset.isEditableCreatedBy());

            if (subset.isEditableCreatedBy()) {
                subset._owningSection = createdBy;
            }
        }
    });

    Object.defineProperty(subset, 'subject', {
        get: () => { return subset._classificationFamily; },
        set: (subject = '') => {
            //console.debug('Set subject', subject, subset.isEditableSubject());

            if (subset.isEditableSubject()) {
                subset._classificationFamily = subject;
            }
        }
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
        get: () => { return subset.earliestPublishedVersion?.validFrom; }
    });

    Object.defineProperty(subset, 'validUntil', {
        get: () => { return subset.latestPublishedVersion?.validUntil }
    });

    Object.defineProperty(subset, 'versions', {
        get: () => { return subset?._versions; },
    });

    Object.defineProperty(subset, 'publishedVersions', {
        get: () => { return subset?._versions?.filter(v => v.administrativeStatus === 'OPEN'); },
    });

    Object.defineProperty(subset, 'earliestPublishedVersion', {
        get: () => { return orderByValidFromAsc(subset?.publishedVersions)[0]; },
    });

    Object.defineProperty(subset, 'latestPublishedVersion', {
        get: () => { return orderByValidFromDesc(subset?.publishedVersions)[0]; },
    });

    Object.defineProperty(subset, 'drafts', {
        get: () => { return subset?._versions?.filter(v => v.administrativeStatus === 'DRAFT'); },
    });

    Object.defineProperty(subset, 'currentVersion', {
        set: (chosen = {}) => {
            // console.debug('Set administrativeStatus', status, subset.isEditableStatus(), STATUS_ENUM.includes(status));

            subset._currentVersion = subset.versions.find(v => v.version === chosen.version) || {};
            /*state._versionRationale = exists.versionRationale?.length > 0
                ? exists.versionRationale
                : [ nextDefaultName([]) ];
    */
        }
    });


    Object.defineProperty(subset, 'versionLastModified', {
        get: () => { return subset?._currentVersion.lastModified; },
    });

    Object.defineProperty(subset, 'version', {
        get: () => { return subset?._currentVersion.version; },
    });

    // FIXME not implemented yet
    Object.defineProperty(subset, 'versionToBeSaved', {
        get: () => { return subset?._currentVersion.toBeSaved; },
    });

    Object.defineProperty(subset, 'administrativeStatus', {
            get: () => { return subset._currentVersion.administrativeStatus; },
/*            set: (status = '') => {
                // console.debug('Set administrativeStatus', status, subset.isEditableStatus(), STATUS_ENUM.includes(status));

                if (subset.isEditableStatus() && STATUS_ENUM.includes(status)) {
                    subset._administrativeStatus = status;
                }
            }*/
    });
    /*
        Object.defineProperty(subset, 'isPublished', {
            get: () => { return subset._administrativeStatus  === 'OPEN';},
        });*/



 /*   Object.defineProperty(subset, 'version', {
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
*/
    Object.defineProperty(subset, 'versionValidFrom', {
        get: () => { return subset._currentVersion?.validFrom?.substr(0, 10); },
/*        set: (date = null) => {
            //console.debug('Set versionValidFrom', date);

            if (subset.isEditableVersionValidFrom) {

                subset.resetValidityPeriod();
                subset._versionValidFrom = date;
                subset.updateValidityPeriod();
            }
        }*/
    });

    Object.defineProperty(subset, 'versionValidUntil', {
        get: () => { return subset._currentVersion?.validUntil?.substr(0, 10) || null; },
        /*set: (date = null) => {
            //console.debug('Set versionValidUntil', date, subset.isEditableVersionValidUntil());

            if (subset.isEditableVersionValidUntil()) {

                subset.resetValidityPeriod();
                subset._versionValidUntil = date;
                subset.updateValidityPeriod();
            }
        }*/

    });
/*
    Object.defineProperty(subset, 'versionRationale', {
        get: () => { return subset._versionRationale; },
        set: (versionRationale = []) => {
            //console.debug('Set versionRationale', versionRationale);

            if (subset.isEditableVersionRationale()) {
                subset._versionRationale = versionRationale;
            }
        }
    });

    Object.defineProperty(subset, 'origin', {
        get: () => {
            return subset._administrativeDetails
                .find(d => d.administrativeDetailType === 'ORIGIN').values;
        },
        set: (origin = []) => {
            //console.debug('Set origin', origin, subset.isEditableOrigin());

            if (subset.isEditableOrigin()) {
                subset._administrativeDetails
                    .find(d => d.administrativeDetailType === 'ORIGIN')
                    .values = origin.filter(o => URN.isClassificationPattern(o));

                //subset._codes = subset.codes.filter(c => subset.origin.includes(URN.toURL(c.urn).classificationURN));
            }
        }
    });

    Object.defineProperty(subset, 'codes', {
        get: () => { return subset._codes; },
        set: (codes = []) => {
            // console.debug('Set codes and update origin', codes);

            if (subset.isEditableCodes()) {
                subset._codes = codes;
                subset.reorderCodes();
                subset.rerankCodes();
                subset.verifyOrigin();
            }
        }
    });

    Object.defineProperty(subset, 'errors', {
        get: () => {
            //console.debug('Get errors', subset._errors);

            return subset.validate();
        }
    });

    Object.defineProperty(subset, 'payload', {
        // TESTME
        // DOCME
        get: () => {
            const payload = {
                id: subset._id,
                shortName: subset._shortName,
                name: subset._name,
                administrativeStatus: subset._administrativeStatus,
                validFrom: subset._validFrom,
                validUntil: subset._validUntil,
                owningSection: subset._owningSection,
                administrativeDetails: subset._administrativeDetails,
                classificationFamily: subset._classificationFamily,
                description: subset._description,
                version: subset._version,
                versionRationale: subset._versionRationale,
                versionValidFrom: subset._versionValidFrom,
                codes: subset._codes
            };
            Object.keys(payload).forEach((key) => (
                (!payload[key] || payload[key] === '')
                && delete payload[key])
            );
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
    });*/

    return subset;
}

const editable = (state = {}) => ({

    isNew() {
        //console.debug('isNew', state.administrativeStatus === 'INTERNAL' && state.version === '1');

        return !state.createdDate;
    },


    isLatestSavedVersion() {
        //console.debug('isLatestSavedVersion');

        if (!state.previousVersions) {
            return null;
        }
        return state.latestVersion?.version === state.version;
    },

    isNewVersion() {
        //console.debug('isNewVersion', state.administrativeStatus === 'INTERNAL' && state.version !== '1');

        return state.administrativeStatus === 'INTERNAL'
            && state.version !== '1';
    },

    isAfterCoveredPeriod(date) {
        //console.debug('isAfterCoveredPeriod');

        return date
            && (date >= state.latestVersion?.validUntil
                || date > state.latestVersion?.versionValidFrom);
    },

    isBeforeCoveredPeriod(date) {
        //console.debug('isBeforeCoveredPeriod');

        return date
            && state.isInAcceptablePeriod(date)
            && date < state.validFrom;
    },

    isInCoveredPeriod(date) {
        const start = state.latestVersion?.validFrom || state._validFrom;
        const end = state.latestVersion
            ? state.latestVersion?.validUntil || state.latestVersion?.versionValidFrom
            : state._validUntil;
        return !end
            ? date === start
            : end === state.latestVersion?.versionValidFrom
                ? date >= start && date <= end
                : date >= start && date < end;
    },

    isEditableId() {
        return state.isNew();
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

    isEditableValidFrom() {
        return state.isNew() || state.isNewVersion();
    },

    isEditableValidUntil() {
        return true;
    },

    isEditableVersionValidFrom() {
        //console.debug('isEditableVersionValidFrom');

        return state.isNew()
            || (state.isNewVersion() && !state._versionValidFrom)
            || (state.isNewVersion()
                && state._versionValidFrom !== state.latestVersion?.validUntil)
            || (state.isNewVersion()
                && state._versionValidFrom === state.latestVersion?.validUntil
                && state._versionValidUntil === state.latestVersion?.validFrom
            )
    },

    isEditableVersionValidUntil() {
        //console.debug('isEditableVersionValidUntil');

        return (state.isLatestSavedVersion()
                && (!state.latestVersion?.validUntil
                    || state.latestVersion?.administrativeStatus !== 'OPEN'
                )
            )
            || (state.isNew()
                && state.isInAcceptablePeriod(state._versionValidFrom)
            )
            || (state.isNewVersion()
                && state._versionValidUntil !== state.latestVersion?.validFrom
                && state.isInAcceptablePeriod(state._versionValidFrom)
            )
    },

    isEditableOrigin() {
        return true;
    },

    isEditableDescription() {
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
        return date >= acceptablePeriod.from
            && date < acceptablePeriod.until;
    },

    isAcceptableLanguageCode(lang) {
        return (-1 !== languages
            .filter(l => l.draft)
            .findIndex(l => l.languageCode === lang));
    }
});

const nameControl = (state = {}) => ({

    addName(name = nextDefaultName(state.name)) {

        if (state.isEditableName()
            && state.name?.length < languages.filter(l => l.draft).length)
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
            && state.description?.length < languages.filter(l => l.draft).length) {
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
            && state.versionRationale?.length < languages.filter(l => l.draft).length)
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
        //console.debug('removeOrigin', origin);

        if (URN.isClassificationPattern(origin)) {
            state.origin = state.origin.filter(urn => urn !== origin);
            // TODO: move to defineProperty 'origin
            state.codes = state._codes.filter(c => !c.urn.startsWith(origin));
        }
    },

    verifyOrigin() {
        //console.debug('verifyOrigin');

        // TESTME
        // TODO: if origin values are not empty, check if all values are valid URNs

        const updated = new Set(state.origin);
        state.codes.forEach(c => updated.add(URN.toURL(c.urn).classificationURN));
        state.origin = [...updated];
    },

    hasOrigin(urn = '') {
        return state.origin?.includes(urn);
    }
});

const codesControl = (state = {}) => ({

    isChosenCode(urn = '') {
        //console.debug('isChosenCode', state.codes.findIndex(c => c.urn === urn) > -1);

        return URN.isCodePattern(urn) && state.codes.findIndex(c => c.urn === urn) > -1;
    },

    prependCodes(codes = []) {
        // console.debug('prependCodes', codes);

        const candidates = codes?.filter(c => !state.isChosenCode(c.urn));
        if (candidates.length > 0) {
            state.codes = [...candidates, ...state.codes];
        }
    },

    removeCodes(codes = []) {
        //console.debug('deleteCodes', codes);

        state.codes = state.codes.filter(c => !codes.find(s => s.urn === c.urn));
    },

    reorderCodes() {
        //console.debug('reorderCodes');

        state.codes.sort((a, b) => (a.rank - b.rank -1));
    },

    rerankCodes() {
        //console.debug('rerankCodes');

        state.codes.forEach((item, i) => {
            item.rank = i + 1
        });
    },

    changeRank(rank, codes) {
        //console.debug('changeRank', rank, codes);

        if (rank && rank !== '-') {
            state.codes = state.codes.map(c => codes.find(i => i.urn === c.urn)
                ? {...c, rank}
                : c
            )
        }
    }

});
