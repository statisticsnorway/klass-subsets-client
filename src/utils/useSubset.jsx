import { useReducer } from 'react'

export const useSubset = (init) => {

    function subsetReducer(state, {action, data = {}}) {
        switch (action) {
            case "create": {
                return data;
            }
            case "names": {
                return  {...state, names: data};
            }
            case "description": {
                return  {...state, description: data};
            }
            case "ownerId": {
                return  {...state, ownerId: data};
            }
            case "reset": {
                return init;
            }
            case "empty": {
                return { names: "", description: "", ownerId: "" };
            }
            default:
                return state;
        }
    }

    const [draft, dispatch] = useReducer(subsetReducer, init);

    return {draft, dispatch};

};