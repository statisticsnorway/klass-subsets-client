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
        codes: []
    }
    ) => {

    function verifyOrigin(origin = [], codes = []) {

        // TODO: if origin values are not empty, check if all values are valid URNs

        if (codes?.length === 0) {
            return [...origin]
        }

        const updated = new Set(origin);
        codes.forEach(c => updated.add(URN.toURL(c.urn).classificationURN));
        return [...updated];
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
            case 'codelist_include': {
                const annotation = state.administrativeDetails?.find(d => d.administrativeDetailType === 'ANNOTATION');
                const origin = state.administrativeDetails?.find(d => d.administrativeDetailType === 'ORIGIN');

                origin.values = origin.values.find(v => v === data) ? origin.values : [data, ...origin.values];
                return  {
                    ...state,
                    administrativeDetails: [annotation, origin]
                };
            }
            // DOCME: if a codelist is chosen, but no codes are checked,
            //  the code list remains in the subset until it explicitly excluded.
            case 'codelist_exclude': {
                const origin = state.administrativeDetails.find(d => d.administrativeDetailType === 'ORIGIN').values;
                state.administrativeDetails.find(d => d.administrativeDetailType === 'ORIGIN').values =
                    origin.filter(urn => urn !== data);

                const codes = state.codes.filter(c => !c.urn.startsWith(data));

                return  {...state, codes};
            }
            case 'codes_include': {
                const candidates = data.filter(c => !state.codes.find(s => s.urn === c.urn));
                const administrativeDetails = updateOrigin(state.administrativeDetails, candidates);
                return  {
                    ...state,
                    administrativeDetails,
                    codes: [...state.codes, ...candidates]};
            }
            case 'codes_exclude': {
                const candidates = state.codes.filter(c => !data.find(s => s.urn === c.urn));
                return  {
                    ...state,
                    codes: [...candidates]};
            }
            case 'reset': {
                sessionStorage.removeItem('draft');
                return init;
            }
            default:
                return state;
        }
    }

    // TESTME
    function updateOrigin(administrativeDetails, codes) {
        const annotation = administrativeDetails?.find(d => d.administrativeDetailType === 'ANNOTATION');
        const origin = administrativeDetails?.find(d => d.administrativeDetailType === 'ORIGIN');

        origin.values = verifyOrigin(origin.values, codes);

        return [annotation, origin];
    }

    // FIXME: if the draft in session storage is undefined, the whole app crashes with error message:
    // Error: A cross-origin error was thrown. React doesn't have access to the actual error object in development.
    // FIX: try catch
    const [draft, dispatch] = useReducer(subsetReducer, initialize());

    // FIXME: runs on every draft update, should run once the hook is initialized in the context
    // FIXME: discard on non-valid draft and return init
    function initialize() {
        const restored = JSON.parse(sessionStorage.getItem('draft'));
        if (restored) {

            const annotation =
                restored.administrativeDetails?.find(d => d.administrativeDetailType === 'ANNOTATION')
                || init.administrativeDetails?.find(d => d.administrativeDetailType === 'ANNOTATION');

            const origin =
                restored.administrativeDetails?.find(d => d.administrativeDetailType === 'ORIGIN')
                || init.administrativeDetails?.find(d => d.administrativeDetailType === 'ORIGIN');

            origin.values = verifyOrigin(origin.values, restored.codes);

            restored.administrativeDetails = [ annotation, origin ];
        }
        return {...init, ...restored} || init;
    }

    useEffect(() => {
        sessionStorage.setItem('draft', JSON.stringify(draft));
    }, [draft]);

    return {draft, dispatch};
};