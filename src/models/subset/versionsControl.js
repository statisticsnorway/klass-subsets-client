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
    }

});
