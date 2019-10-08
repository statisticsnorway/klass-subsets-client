import { useReducer } from "react";
import { nextDefaultLanguage } from "./languages";

export const useSubset = (init) => {

    function subsetReducer(state, {action, data = {}}) {
        switch (action) {
            case "create": {
                return data;
            }
            case "name_update": {
                return  {...state};
            }
            case "name_add": {
                const name = nextDefaultLanguage(data);
                return  {...state, names: [...state.names, name]};
            }
            case "description": {
                return  {...state, description: data};
            }
            case "ownerId": {
                return  {...state, ownerId: data};
            }
            case "codes": {
                return  {...state, codes: data};
            }
            case "codes_add": {
                return  {...state, codes: [...state.codes, data]};
            }
            case "reset": {
                return init;
            }
            case "empty": {
                return { names: "", description: "", ownerId: "", codes: [] };
            }
            default:
                return state;
        }
    }

    const [draft, dispatch] = useReducer(subsetReducer, init);

    return {draft, dispatch};

};