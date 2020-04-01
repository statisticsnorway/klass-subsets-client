import {useReducer} from 'react';
import {nextDefaultName} from './languages';

export const useSubset = (init =  {
    ownerId: '',
    name: [],
    valid: { from: null, to: null },
    subject: '',
    description: [],
    classifications: []}
    ) => {

    function subsetReducer(state, {action, data = {}}) {
        switch (action) {
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
                state.valid.from = data;
                return {...state};
            }
            case 'to': {
                // FIXME: restrictions
                state.valid.to = data;
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
            case 'ownerId': {
                return  {...state, ownerId: data};
            }
            case 'subject': {
                return  {...state, subject: data};
            }
            case 'classifications': {
                return  {...state, classifications: data};
            }
            case 'classifications_prepend_included': {
                 const included = data.filter(item => !state.classifications.includes(item) && (item.included
                    || item.codes.find(code => code.included)));
                return  {...state, classifications: [...included, ...state.classifications]};
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
                return init;
            }
            default:
                return state;
        }
    }

    const [draft, dispatch] = useReducer(subsetReducer, init);

    return {draft, dispatch};

};