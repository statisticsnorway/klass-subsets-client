import {useReducer, useEffect} from 'react';
import {nextDefaultName} from './languages';
import {URN} from '../controllers/klass-api';

export const useSubset = (init =  {
    createdBy: '',
    name: [],
    validFrom: null,
    validUntil: null,
    administrativeDetails: [
        {
            administrativeDetailType: 'ANNOTATION',
            values: []
        },
        {
            administrativeDetailType: 'ORIGIN',
            values: []
        }
    ],
    description: [],
    administrativeStatus: 'DRAFT',
    codes: [],
    classifications: []
}
    ) => {

    function expandCode(source = {}, from = '', to = '') {
            const {code, classificationId, classificationURN} = URN.toURL(source.urn, from, to);
            return {
                ...source,
                code,
                classificationId,
                classificationURN,
                validFromInRequestedRange: from,
                validToInRequestedRange: to
            }
    }

    function verifyOrigin(origin = [], codes = []) {

        // TODO: if origin values are not empty, check if all values are valid URNs

        if (codes?.length === 0) return [...origin];

        const updated = new Set(origin);
        codes.forEach(c => updated.add(c.classificationURN));
        return [...updated];
    }

    function extractClassifications(urns = [], codes = []) {
        return urns.map(urn => ({
                urn,
                included: true,
                codes: codes
                    .filter(code => code.urn.startsWith(urn))
                    .map(code => ({
                        ...code,
                        included: true})
                    )
                    || []
            })
        );
    }

    function subsetReducer(state, {action, data = {}}) {
        switch (action) {
            case 'edit': {
                return  {...data};
            }
            case 'update': {
                return  {...state};
            }
            case 'name_add': {
                const name = nextDefaultName(state.name);
                return  name === null
                    ? {...state}
                    : {...state, name: [...state.name, name]};
            }
            case 'name_remove': {
                return {
                    ...state,
                    name: state.name?.filter((item, index) => index !== data)
                };
            }
            case 'from': {
                // FIXME: restrictions
                return {...state, validFrom: data};
            }
            case 'to': {
                // FIXME: restrictions
                return {...state, validUntil: data};
            }
            case 'createdBy': {
                return  {...state, createdBy: data};
            }
            case 'subject': {
                // FIXME: mutable change
                state.administrativeDetails
                    .find(d => d.administrativeDetailType === 'ANNOTATION')
                    .values[0] = data;
                return  {...state};
            }
            case 'description_add': {
                const description = nextDefaultName(state.description);
                return  description === null
                    ? {...state}
                    : {...state, description: [...state.description, description]};
            }
            case 'description_remove': {
                return {
                    ...state,
                    description: state.description?.filter((item, index) => index !== data)
                };
            }
            case 'remove_empty': {
                return {...state,
                    name: state.name.filter(item => item.languageText?.length > 0),
                    description: state.description.filter(item => item.languageText?.length > 0)
                };
            }
            case 'classifications_from_origin': {
                const classifications = extractClassifications(
                    state.administrativeDetails.find(d => d.administrativeDetailType === 'ORIGIN').values,
                    state.codes);
                console.log({classifications});
                return {...state, classifications};
            }
            case 'classifications_include': {
                data.included = true;
                return  {
                    ...state,
                    classifications: [data, ...state.classifications]};
            }
            case 'classifications_exclude': {
                data.included = false;
                data.codes.forEach(c => c.included = false);
                return  {
                    ...state,
                    classifications: state.classifications.filter(c => c.included)};
            }
            case 'codes_include': {
                data.classification.included = true;
                data.codes.forEach(c => c.included = true );

                if (!state.classifications.find(c => c.name === data.classification.name)) {
                    state.classifications = [
                        data.classification,
                        ...state.classifications];
                }
                return  {...state};
            }
            case 'classifications_codes_update': {
                console.log('classifications_codes_update', data.classification, data.codes);
                data.classification.codes = data.codes;
                return {...state};
            }
            case 'codes_exclude': {
                data.codes.forEach(c => c.included = false );
                return  {...state};
            }
            case 'reset': {
                sessionStorage.removeItem('draft');
                return init;
            }
            default:
                return state;
        }
    }

    // FIXME: if the draft in session storage is undefined, the whole app crashes with error message:
    // Error: A cross-origin error was thrown. React doesn't have access to the actual error object in development.
    // FIX: try catch
    const [draft, dispatch] = useReducer(subsetReducer, initialize());

    // FIXME: runs on every draft update, should run once the hook is initialized in the context
    function initialize() {
        const restored = JSON.parse(sessionStorage.getItem('draft'));
        if (restored) {
            console.log({restored});
            const codes = restored.codes?.map(code => expandCode(
                code,
                restored.validFrom?.substr(0, 10),
                restored.validTo?.substr(0, 10)
            ));
            console.log({codes});

            const annotation =
                restored.administrativeDetails?.find(d => d.administrativeDetailType === 'ANNOTATION')
                || init.administrativeDetails?.find(d => d.administrativeDetailType === 'ANNOTATION');

            const origin =
                restored.administrativeDetails?.find(d => d.administrativeDetailType === 'ORIGIN')
                || init.administrativeDetails?.find(d => d.administrativeDetailType === 'ORIGIN');

            origin.values = verifyOrigin(origin.values, codes);
            console.log({origin});

            restored.administrativeDetails = [ annotation, origin ]
        }

        return {...init, ...restored} || init;
    }

    useEffect(() => {
        sessionStorage.setItem('draft', JSON.stringify(draft));
    }, [draft]);

    return {draft, dispatch};

};