import { sanitize, nextDefaultName } from '../utils';

export const versionable = (state = {}) => ({

 /*   calculateNextVersionNumber() {
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
*/

    createNewVersion() {
        // console.debug('createNextVersion');

        const newVersion = {
            version: `${ state.versions?.length + 1 }`,
            administrativeStatus: 'INTERNAL',
            versionRationale: [],
/*            administrativeDetails: [{
                administrativeDetailType: 'ORIGIN',
                values: [ ...state.administrativeDetails.values ]
                },
            ],*/
            codes: [ ...state.codes ]
        }

        state.versions = [
            newVersion,
            ...state.versions
        ];

        return newVersion;
    },



 /*   resetValidityPeriod() {
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
        /!*console.debug('isNewPreviousVersion');*!/

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
    }*/

});
