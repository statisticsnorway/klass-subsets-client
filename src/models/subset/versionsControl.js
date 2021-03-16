export const versionable = (state = {}) => ({

    createNewVersion() {
        // console.debug('createNextVersion');

        const newVersion = {
            versionId: `${ state.versions?.length + 1 }`,
            administrativeStatus: 'INTERNAL',
            versionRationale: [],
            validFrom: null,
            validUntil: null,
/*            administrativeDetails: [{
                administrativeDetailType: 'ORIGIN',
                values: [ ...state.administrativeDetails.values ]
                },
            ],*/
            administrativeDetails: [{
                    administrativeDetailType: 'ORIGIN',
                    values: []
                }],
            codes: state?.codes ? [ ...state?.codes ] : []
        }

        state.versions = [
            newVersion,
            ...state?.versions
        ];

        return newVersion;
    },

    syncVersion(updatedVersion = {}, tempId = '') {
        // console.log(updatedVersion, 'syncVersion/updatedVersion');

        if (updatedVersion?.subsetId !== state?.id) return;

        const exists = state.versions?.find(v => v.versionId === tempId);
        if (exists) {
            exists.versionId = updatedVersion.versionId;
            exists.lastModified = updatedVersion.lastModified;
            exists.createdDate = updatedVersion.createdDate;
            exists.administrativeStatus = updatedVersion.administrativeStatus;
            exists.validFrom = updatedVersion.validFrom;
            exists.validUntil = updatedVersion.validUntil;
            exists.codes = updatedVersion.codes;
            exists.versionRationale = updatedVersion.versionRationale;
            exists.statisticalUnits = updatedVersion.statisticalUnits;
        } else {
            state.versions = [ updatedVersion, ...state.versions ]
        }

        state.syncCurrentVersion(updatedVersion, tempId);
    },

    syncCurrentVersion(updatedVersion = {}, tempId = '') {
        // console.debug('syncCurrentVersion', updatedVersion);

        if (state.versionId === tempId) {
            state.currentVersion = updatedVersion;
        }
    }

});
