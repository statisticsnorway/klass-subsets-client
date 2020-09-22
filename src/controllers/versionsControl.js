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
        console.debug('createNextVersion');

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
        // console.debug('updateValidityPeriod');

        if (state.isInAcceptablePeriod(state._versionValidFrom)
            && (state.isNew()
                || state.isNewPreviousVersion()
            ))
        {
            state._validFrom = state._versionValidFrom;
        }

        if ((!state._versionValidUntil
                || state.isInAcceptablePeriod(state._versionValidUntil)
            )
            && (state.isNew()
                || state.isNewNextVersion()
                || state.isLatestSavedVersion()
            ))
        {
            state._validUntil = state._versionValidUntil;
        }
    }

});
