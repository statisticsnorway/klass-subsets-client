import { nextDefaultName } from '../internationalization/languages';

export const versionable = (state = {}) => ({

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
                return next?.versionValidFrom;
            }
            return exists.validUntil || state.validUntil;
        }
        return state.validUntil;
    },

    createNewVersion() {
        //console.debug('createNewVersion');

        state._version = `${ state.calculateNextVersionNumber() }`;
        state.administrativeStatus = 'INTERNAL';
        state.versionRationale = [ nextDefaultName([]) ];
        state.resetValidityPeriod();
    },


    createPreviousVersion() {
        //console.debug('createPreviousVersion');

        state.createNewVersion();
        state._versionValidFrom = null;
        state._versionValidUntil = state.latestVersion?.validFrom || state.validFrom;
    },

    createNextVersion() {
        //console.debug('createNextVersion');

        state.createNewVersion();
        state._versionValidFrom = state.latestVersion?.validUntil || null;
        state._versionValidUntil = null;
        state._validUntil = null;
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
            state._administrativeStatus = exists.administrativeStatus;

            state._validFrom = exists.validFrom;
            state._validUntil = exists.validUntil;

            state._versionValidUntil = state.calculateVersionValidUntil();
        }
    },

    resetValidityPeriod() {
        //console.debug('resetValidityPeriod');

        if (state.latestVersion) {
            state._validFrom = state.latestVersion?.validFrom;
            state._validUntil = state.latestVersion?.validUntil;
        }
    },

    updateValidityPeriod() {
        //console.debug('updateValidityPeriod');

        if (state.isInAcceptablePeriod(state._versionValidFrom) // A
            && (state.isNew()                              // B
                || state.isNewPreviousVersion()  // C
            ))
        {
            state._validFrom = state._versionValidFrom;
        }

        if ((!state._versionValidUntil      // D
                || state.isInAcceptablePeriod(state._versionValidUntil)   // E
            )
            && (state.isNew()   // B
                || state.isNewNextVersion()  // F
                || state.isLatestSavedVersion()    // G
            ))
        {
            state._validUntil = state._versionValidUntil;
        }
    },

    isNewPreviousVersion() {
        /*console.debug('isNewPreviousVersion');*/

        return state.isNewVersion()
            && state._versionValidUntil === state.latestVersion?.validFrom
            && state.isInAcceptablePeriod(state._versionValidFrom)
            && state.isBeforeCoveredPeriod(state._versionValidFrom);
    },

    isNewNextVersion() {
        //console.debug('isNewNextVersion');

        return state.isNewVersion()
            && (
                (state.latestVersion?.validUntil //1
                    && state._versionValidFrom === state.latestVersion?.validUntil)
                ||
                (!state.latestVersion?.validUntil //2
                    && state.isInAcceptablePeriod(state._versionValidFrom)
                    && state.isAfterCoveredPeriod(state._versionValidFrom))
            )
            && (
                !state._versionValidUntil //3
                ||
                (state.isInAcceptablePeriod(state._versionValidUntil) //4
                    && state._versionValidUntil > state._versionValidFrom)
            )
    },

});
