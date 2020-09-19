export const errorsControl = (state = {}) => ({

    validateId() {
        return !state.id || state.id.length === 0 || !(typeof state.id === 'string' || state.id instanceof String)
            ? ['ID is a mandatory field']
            : !(/([a-z0-9-_])$/.test(state.id))
                ? ['Only lower case letters, numbers, dashes, and underscores are allowed']
                : [];
    },

    validateName() {
        return state.name?.length > 0
            ? []
            : ['At least one name is required'];
    },

    validateValidFrom() {
        return state.validFrom ?
            []
            : ['A valid from date is required'];
    },

    validatePeriod(from, to) {
        return !from || !to
            ? []
            : from > to
                ? ['Period cannot start later than end']
                : from === to
                    ? ['Period cannot include and exclude the same day']
                    : [];
    },

    validateVersionPeriod() {
        return this.validatePeriod(state.versionValidFrom, state.versionValidUntil);
    },

    validateSubsetPeriod() {
        return this.validatePeriod(state.validFrom, state.validUntil);
    },

    validateVersionValidFrom() {
        console.debug('validateVersionValidFrom', {
            isNew: state.isNew(),
            isNewVersion: state.isNewVersion(),
            earlierThanValidUntil: state._versionValidFrom <= state._validUntil,
            laterThanValidFrom: state._versionValidFrom >= state._validFrom,
            laterThenValidUntil_Gap: state._versionValidFrom > state._validUntil
        })
        return !state._versionValidFrom
            ? ['A valid version from date is required']
            : !state.isNewVersion()
                ? []
                : state._versionValidFrom > state._validUntil
                    ? ['Versions cannot have gaps on validity periods']
                    : state.isInCoveredPeriod(state._versionValidFrom)
                        ? ['This date is already covered in previous versions']
                        : [];
    },

    validateCreatedBy() {
        return state.createdBy?.length > 0 ? [] : ['Owner is required'];
    },

    validateCodes() {
        return state.codes?.length > 0 ? [] : ['At least one code is required'];
    },

    validate() {
        //console.debug('validate');

        return {
            id: state.validateId(),
            name: state.validateName(),
            validFrom: state.validateValidFrom(),
            validUntil: [],
            period: state.validateSubsetPeriod(),
            createdBy: state.validateCreatedBy(),
            annotation: [],
            description: [],
            origin: [],
            administrativeStatus: [],
            versionValidFrom: state.validateVersionValidFrom(),
            versionPeriod: state.validateVersionPeriod(),
            codes: state.validateCodes()
        };
    }

});