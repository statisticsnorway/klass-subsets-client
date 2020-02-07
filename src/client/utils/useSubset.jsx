import { useReducer } from 'react';
import { nextDefaultName } from './languages';

export const useSubset = (init) => {

    function subsetReducer(state, {action, data = {}}) {
        switch (action) {
            case 'update': {
                return  {...state};
            }
            case 'name_add': {
                const name = nextDefaultName(state.names);
                return  name === null
                    ? {...state}
                    : {...state, names: [...state.names, name]};
            }
            case 'name_remove': {
                return {...state, names: state.names.filter((item, index) => index !== data)};
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
                const description = nextDefaultName(state.descriptions);
                return  description === null
                    ? {...state}
                    : {...state, descriptions: [...state.descriptions, description]};
            }
            case 'description_remove': {
                return {...state,
                    descriptions: state.descriptions.filter((item, index) => index !== data)};
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
                // FIXME: two levels only, should be recursive in depth
                 const included = data.filter(item => !state.classifications.includes(item) && (item.included
                    || item.codes.find(code => code.included)));
                return  {...state, classifications: [...included, ...state.classifications]};
            }
            case 'remove_empty': {
                return {...state,
                    names: state.names.filter(item => item.text && item.text.length > 0),
                    descriptions: state.descriptions.filter(item => item.text && item.text.length > 0)
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