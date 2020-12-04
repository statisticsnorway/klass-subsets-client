import { sanitize, nextDefaultName } from '../utils';

export const versionable = (state = {}) => ({

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
    }

});
