import { subsetDraft, STATUS_ENUM, languages, acceptablePeriod } from '../../defaults';
import { errorsControl } from './errorsControl';
import { versionable } from './versionsControl';
import { toId, sanitize, nextDefaultName, orderByValidFromAsc, orderByValidFromDesc, sanitizeArray } from '../../utils';

export function Subset (data) {
    const subset = {
        _id: data?.id || data?._id || '',
        _shortName: data?.shortName || data?._shortName || '',
        _name: data?.name || data?._name || [],
        _classificationFamily: data?.classificationFamily || data?._classificationFamily || '',
        _owningSection: data?.owningSection || data?._owningSection || '',
        _description: data?.description || data?._description || [],
        _versions: data?.versions || data?._versions || [],

        // internal controls
        // FIXME: default - a version valid at loading date
        _currentVersion: data?._currentVersion || data?.versions[0] || {},
        _origins: data?._origins || [],

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

    // FIXME: demo workaround
    Object.defineProperty(subset, 'metadataToBeSaved', {
        // FIXME: hardcoded workaround
        get: () => { return subset.isNew(); },
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
        get: () => {
            return subset._versions?.find(v => v.versionId === subset._currentVersion?.versionId);
        },
        set: ( chosen = {} ) => {
            // console.debug('Set currentVersion', chosen);

            subset._currentVersion = subset.versions?.find(v => v.versionId === chosen?.versionId) || {};
            if (subset._currentVersion?.versionRationale?.length === 0) {
                subset.versionRationale = [ nextDefaultName([]) ];
            }
        }
    });

    Object.defineProperty(subset, 'versionLastModified', {
        get: () => { return subset?.currentVersion?.lastModified; },
    });

    Object.defineProperty(subset, 'versionCreatedDate', {
        get: () => { return subset?.currentVersion?.createdDate; },
    });

    Object.defineProperty(subset, 'versionId', {
        get: () => { return subset?._currentVersion?.versionId; },
    });

    // FIXME not implemented yet
    Object.defineProperty(subset, 'versionToBeSaved', {
        get: () => { return subset.isNewVersion() },
    });

    Object.defineProperty(subset, 'administrativeStatus', {
        get: () => { return subset?.currentVersion?.administrativeStatus; },
    });

    Object.defineProperty(subset, 'isPublished', {
        get: () => { return subset.administrativeStatus  === 'OPEN';},
    });

    Object.defineProperty(subset, 'versionValidFrom', {
        get: () => {
            //console.debug('Get versionValidFrom', subset.currentVersion?.validFrom)

            return subset.currentVersion?.validFrom;
            },
        set: (date = null) => {
            //console.debug('Set versionValidFrom', date);

            if (subset.isEditableVersionValidFrom) {
                subset.currentVersion.validFrom = new Date(date)?.toJSON().substr(0, 10) || null;
            }
        }
    });

    Object.defineProperty(subset, 'versionValidUntil', {
        get: () => {
            //console.debug('Get versionValidUntil', subset.currentVersion?.validUntil)

            return subset.currentVersion?.validUntil;
        },
        set: (date = null) => {
            //console.debug('Set versionValidUntil', date, subset.isEditableVersionValidUntil());

            if (subset.isEditableVersionValidUntil()) {
                subset.currentVersion.validUntil = new Date(date)?.toJSON().substr(0, 10) || null;
            }
        }
    });

    Object.defineProperty(subset, 'versionRationale', {
        get: () => {
            // console.debug('Get versionRationale', subset.currentVersion?.versionRationale);

            return subset.currentVersion?.versionRationale;
            },
        set: (versionRationale = []) => {
            // console.debug('Set versionRationale', versionRationale);

            if (subset.isEditableVersionRationale() && versionRationale?.length > 0) {
                subset.currentVersion.versionRationale = sanitizeArray(
                    versionRationale,
                    subsetDraft.maxLengthVersionRationale
                );
            }
        }
    });

    Object.defineProperty(subset, 'origins', {
        get: () => {
            return new Set([...subset?._origins,
                ...subset?.currentVersion?.codes?.map(c => c.classificationId)
            ]);
        }
    });

    Object.defineProperty(subset, 'codesMap', {
        get: () => {
            return new Map(subset?.currentVersion.codes?.map(code => [
                `${code.classificationId}:${code.code}:${encodeURI(code.name)}`,
                code
            ])); },
    });

    Object.defineProperty(subset, 'codes', {
        get: () => { return subset?.currentVersion?.codes },
        set: (codes = []) => {
            // console.debug('Set codes', codes);

            if (subset.isEditableCodes()) {
                subset.currentVersion.codes = codes;
                subset.reorderCodes();
                subset.rerankCodes();
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
                owningSection: subset.owningSection,
                administrativeDetails: subset.administrativeDetails,
                classificationFamily: subset.classificationFamily,
                description: subset.description,
                version: subset.version,
                versionRationale: subset.versionRationale,
                versionValidFrom: subset.versionValidFrom,
                codes: subset.codes
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
        return !state.isPublished;
    },

    isEditableDescription() {
        return true;
    },

    isEditableVersionRationale() {
        return !state.isPublished;
    },

    isEditableCodes() {
        console.debug('isEditableCodes ', !state.isPublished)
        return !state.isPublished;
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

            state.versionRationale = state.currentVersion.versionRationale?.filter((item, i) => i !== index)
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

            state.currentVersion.versionRationale[index].languageText = sanitize(text, subsetDraft?.maxLengthDescription);
        }
    },

    updateVersionRationaleLanguageByIndex(index = -1, lang = '') {
        if (state.isEditableVersionRationale()
            && index >= 0 && index < state.versionRationale?.length
            && state.isAcceptableLanguageCode(lang))
        {
            //console.debug('updateVersionRationaleLanguageByIndex', index, lang);

            state.currentVersion.versionRationale[index].languageCode = lang;
        }
    }
});

const originControl = (state = {}) => ({

    addOrigin(id = '') {
        //console.debug('addOrigin', classificationId);

        state._origins = [id, ...state._origins];
    },

    removeOrigin(id = '') {
        //console.debug('removeOrigin', classificationId);

        state._origins = state._origins?.filter(o => o !== id);
        state.removeCodesWithClassificationId(id);
    }
});

const codesControl = (state = {}) => ({

    prependCodes(codes = []) {
        // console.debug('prependCodes', codes);

        const addition = codes.map(code => [
            `${code.classificationId}:${code.code}:${encodeURI(code.name)}`,
            { ...code, rank: -new Date().getTime() }
        ]);

        const merged = new Map([...addition, ...state.codesMap]);
        state.codes = [ ...merged.values() ];
    },

    removeCodes(codes = []) {
        //console.debug('deleteCodes', codes);

        const updated = state.codesMap;
        codes?.forEach(code => updated.delete(`${code.classificationId}:${code.code}:${encodeURI(code.name)}`));
        state.codes = [ ...updated.values() ];
    },

    removeCodesWithClassificationId(id) {
        state.codes = state.codes.filter(c => c.classificationId !== id);
    },

    reorderCodes() {
        //console.debug('reorderCodes');

        state._currentVersion.codes.sort((a, b) => (a.rank - b.rank -1));
    },

    rerankCodes() {
        //console.debug('rerankCodes');

        state._currentVersion.codes.forEach((item, i) => {
            item.rank = i + 1
        });
    },

    changeRank(rank, codes) {
        //console.debug('changeRank', rank, codes);

        if (rank && rank !== '-') {
            state._currentVersion.codes = state._currentVersion.codes.map(c => codes.find(i => i.urn === c.urn)
                ? {...c, rank}
                : c
            )
        }
    }

});
