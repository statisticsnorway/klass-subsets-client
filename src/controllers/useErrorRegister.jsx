import { useReducer } from 'react';


// FIXME: abandoned function - either use or remove
export const useErrorRegister = (init) => {

    function subsetReducer(state, {action, data}) {
        switch (action) {
            case 'add': {
                return [...state, data];
            }
            case 'remove': {
                return state.filter((item, index) => index !== data);
            }
            case 'empty': {
                return [];
            }
            default:
                return state;
        }
    }

    const [errors, dispatch] = useReducer(subsetReducer, init);

    return {errors, dispatch};

};