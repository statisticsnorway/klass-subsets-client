import {useReducer, useEffect} from 'react';
import {nextDefaultName} from './languages';

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
    classifications: [],
    codes: []
}
    ) => {

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
                return {...state, name: state.name.filter((item, index) => index !== data)};
            }
            case 'from': {
                // FIXME: restrictions
                state.validFrom = data;
                return {...state};
            }
            case 'to': {
                // FIXME: restrictions
                state.validUntil = data;
                return {...state};
            }
            case 'description_add': {
                const description = nextDefaultName(state.description);
                return  description === null
                    ? {...state}
                    : {...state, description: [...state.description, description]};
            }
            case 'description_remove': {
                return {...state,
                    description: state.description.filter((item, index) => index !== data)};
            }
            case 'createdBy': {
                return  {...state, createdBy: data};
            }
            case 'subject': {
                state.administrativeDetails
                    .find(d => d.administrativeDetailType === 'ANNOTATION')
                    .values[0] = data;
                return  {...state};
            }
            case 'classifications': {
                return  {...state, classifications: data};
            }
            case 'classifications_prepend_included': {
                 const included = data.filter(item => !state.classifications?.includes(item) && (item.included
                    || item.codes?.find(code => code.included)));
                return  state.classifications
                    ? {...state, classifications: [...included, ...state.classifications]}
                    : {...state, classifications: [...included]};
            }
            case 'classifications_remove_excluded': {
                return  {...state, classifications: state.classifications.filter(c => c.included)};
            }
            case 'remove_empty': {
                return {...state,
                    name: state.name.filter(item => item.languageText?.length > 0),
                    description: state.description.filter(item => item.languageText?.length > 0)
                };
            }
            case 'reset': {
                sessionStorage.removeItem('draft');
                return init;
            }
            default:
                return state;
        }
    }

    const [draft, dispatch] = useReducer(
        subsetReducer,
        JSON.parse(sessionStorage.getItem('draft')) || init
    );

    useEffect(() => {
        sessionStorage.setItem('draft', JSON.stringify(draft));
    }, [draft]);

    return {draft, dispatch};

};