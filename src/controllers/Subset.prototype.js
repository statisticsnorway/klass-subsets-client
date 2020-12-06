import { subsetDraft, STATUS_ENUM, languages, acceptablePeriod } from '../defaults';
import { URN } from './klass-api';
import { errorsControl } from './errorsControl';
import { versionable } from './versionsControl';
import { toId, sanitize, datePattern, nextDefaultName, orderByValidFromAsc, orderByValidFromDesc, sanitizeArray } from '../utils';

export function Subset (data) {
    const subset = {
        _id: data?.id || data?._id || '',
        _shortName: data?.shortName || data?._shortName || '',
        _name: data?.name || data?._name || [],
        _classificationFamily: data?.classificationFamily || data?._classificationFamily || '',
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
        originControl(subset),
        codesControl(subset),
        errorsControl(subset)
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

    Object.defineProperty(subset, 'owningSection', {
        get: () => { return subset._owningSection; },
        set: (owningSection = '') => {
            //console.debug('Set owningSection', owningSection, subset.isEditableowningSection());

            if (subset.isEditableOwningSection()) {
                subset._owningSection = owningSection;
            }
        }
    });

    Object.defineProperty(subset, 'classificationFamily', {
        get: () => { return subset._classificationFamily; },
        set: (classificationFamily = '') => {
            //console.debug('Set classificationFamily', classificationFamily, subset.isEditableClassificationFamily());

            if (subset.isEditableClassificationFamily()) {
                subset._classificationFamily = classificationFamily;
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
        set: ( versions = [] ) => {
            // console.debug('Set versions', versions);

            subset._versions = [ ...versions ]
        }
    });

    Object.defineProperty(subset, 'publishedVersions', {
        get: () => { return subset?._versions?.filter(v => v.administrativeStatus === 'OPEN'); },
    });

    Object.defineProperty(subset, 'earliestPublishedVersion', {
        get: () => {
            if (!subset?.versions) {
                return null;
            }
            return orderByValidFromAsc(subset?.publishedVersions)[0]; },
    });

    Object.defineProperty(subset, 'latestPublishedVersion', {
        get: () => {
            if (!subset?.versions) {
                return null;
            }
            return orderByValidFromDesc(subset?.publishedVersions)[0];
       },
    });

    Object.defineProperty(subset, 'drafts', {
        get: () => { return subset?._versions?.filter(v => v.administrativeStatus === 'DRAFT'); },
    });

    Object.defineProperty(subset, 'currentVersion', {
        set: ( chosen = {} ) => {
            console.debug('Set currentVersion', chosen);

            subset._currentVersion = subset.versions?.find(v => v.version === chosen?.version) || {};
            if (subset._currentVersion?.versionRationale?.length === 0) {
                subset.versionRationale = [ nextDefaultName([]) ];
            }
        }
    });

    Object.defineProperty(subset, 'versionLastModified', {
        get: () => { return subset?._currentVersion?.lastModified; },
    });

    Object.defineProperty(subset, 'version', {
        get: () => { return subset?._currentVersion?.version; },
    });

    // FIXME not implemented yet
    Object.defineProperty(subset, 'versionToBeSaved', {
        get: () => { return true; },
    });

    Object.defineProperty(subset, 'administrativeStatus', {
            get: () => { return subset?._currentVersion?.administrativeStatus; },
/*            set: (status = '') => {
                // console.debug('Set administrativeStatus', status, subset.isEditableStatus(), STATUS_ENUM.includes(status));

                if (subset.isEditableStatus() && STATUS_ENUM.includes(status)) {
                    subset._administrativeStatus = status;
                }
            }*/
    });

    Object.defineProperty(subset, 'isPublished', {
        get: () => { return subset.administrativeStatus  === 'OPEN';},
    });

    Object.defineProperty(subset, 'versionValidFrom', {
        get: () => {
            // console.debug('get versionValidFrom')

            return subset._currentVersion?.validFrom?.substr(0, 10);
            },
        set: (date = null) => {
            //console.debug('Set versionValidFrom', date);

            if (subset.isEditableVersionValidFrom) {

                subset._currentVersion.validFrom = date;
            }
        }
    });

    Object.defineProperty(subset, 'versionValidUntil', {
        get: () => {
            // console.debug('get versionValidUntil')

            return subset._currentVersion?.validUntil?.substr(0, 10) || null;
            },
        set: (date = null) => {
            //console.debug('Set versionValidUntil', date, subset.isEditableVersionValidUntil());

            if (subset.isEditableVersionValidUntil()) {

                subset._currentVersion.validUntil = date;
            }
        }

    });

    Object.defineProperty(subset, 'versionRationale', {
        get: () => { return subset._currentVersion.versionRationale; },
        set: (versionRationale = []) => {
            //console.debug('Set versionRationale', versionRationale);

            if (subset.isEditableVersionRationale() && versionRationale?.length > 0) {
                subset._currentVersion.versionRationale = sanitizeArray(
                    versionRationale,
                    subsetDraft.maxLengthVersionRationale
                );
            }
        }
    });

    // FIXME: Replace with Set / Map
    Object.defineProperty(subset, 'origin', {
        get: () => {
            return subset._currentVersion.administrativeDetails
                .find(d => d.administrativeDetailType === 'ORIGIN').values;
        },
        set: (origin = []) => {
            //console.debug('Set origin', origin, subset.isEditableOrigin());

            if (subset.isEditableOrigin()) {
                subset._currentVersion.administrativeDetails
                    .find(d => d.administrativeDetailType === 'ORIGIN')
                    .values = origin.filter(o => URN.isClassificationPattern(o));

                //subset._codes = subset.codes.filter(c => subset.origin.includes(URN.toURL(c.urn).classificationURN));
            }
        }
    });

    Object.defineProperty(subset, 'codes', {
        get: () => { return subset._currentVersion?.codes; },
        set: (codes = []) => {
            // console.debug('Set codes and update origin', codes);

            if (subset.isEditableCodes()) {
                subset._currentVersion.codes = codes;
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
                id: subset.id,
                shortName: subset.shortName,
                name: subset.name,
                administrativeStatus: subset.administrativeStatus,
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
    });

    return subset;
}

const editable = (state = {}) => ({

    isNew() {
        //console.debug('isNew', state.administrativeStatus === 'INTERNAL' && state.version === '1');

        return !state.createdDate;
    },

    isLatestPublishedVersion() {
        //console.debug('isLatestSavedVersion');

        if (!state.versions) {
            return null;
        }
        return state.latestPublishedVersion?.version === state.version;
    },

    isNewVersion() {
        //console.debug('isNewVersion', state.administrativeStatus === 'INTERNAL' && state.version !== '1');

        return state.administrativeStatus === 'INTERNAL'
            && state.version !== '1';
    },

/*    isAfterCoveredPeriod(date) {
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
    },*/

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

    isEditableOwningSection() {
        return true;
    },

    isEditableClassificationFamily() {
        return true;
    },

    isEditableVersionValidFrom() {
        //console.debug('isEditableVersionValidFrom');

        return !state.isPublished
    },

    isEditableVersionValidUntil() {
        //console.debug('isEditableVersionValidUntil');

        return !state.isPublished || state.isLatestPublishedVersion();
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
        return date >= acceptablePeriod?.from
            && date < acceptablePeriod?.until;
    },

    isAcceptableLanguageCode(lang) {
        return (-1 !== languages
            .filter(l => l.draft)
            .findIndex(l => l.languageCode === lang));
    }
});

const nameControl = (state = {}) => ({

    addName(name = nextDefaultName(state?.name)) {

        if (state.isEditableName()
            && state?.name?.length < languages.filter(l => l.draft).length)
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

            state.name = state.name?.filter(item => item.languageText?.length > 0);
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

            state.versionRationale = state._currentVersion.versionRationale?.filter((item, i) => i !== index)
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

            state._currentVersion.versionRationale[index].languageText = sanitize(text, subsetDraft?.maxLengthDescription);
        }
    },

    updateVersionRationaleLanguageByIndex(index = -1, lang = '') {
        if (state.isEditableVersionRationale()
            && index >= 0 && index < state.versionRationale?.length
            && state.isAcceptableLanguageCode(lang))
        {
            //console.debug('updateVersionRationaleLanguageByIndex', index, lang);

            state._currentVersion.versionRationale[index].languageCode = lang;
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
            state.codes = state._currentVersion.codes.filter(c => !c.urn.startsWith(origin));
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
