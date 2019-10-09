import { useReducer } from "react";
import { nextDefaultName } from "./languages";

export const useSubset = (init) => {

    function subsetReducer(state, {action, data = {}}) {
        switch (action) {
            case "create": {
                return data;
            }
            case "update": {
                return  {...state};
            }
            case "name_add": {
                const name = nextDefaultName(state.names);
                return  name === null
                    ? {...state}
                    : {...state, names: [...state.names, name]};
            }
            case "name_remove": {
                return {...state, names: state.names.filter((item, index) => index !== data)};
            }
            case "from": {
                // FIXME: restrictions
                state.valid.from = data;
                return {...state};
            }
            case "to": {
                // FIXME: restrictions
                state.valid.to = data;
                return {...state};
            }
            case "description_add": {
                const description = nextDefaultName(state.descriptions);
                return  description === null
                    ? {...state}
                    : {...state, descriptions: [...state.descriptions, description]};
            }
            case "description_remove": {
                return {...state,
                    descriptions: state.descriptions.filter((item, index) => index !== data)};
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
                return { names: [],
                    descriptions: [],
                    valid: { from: "" },
                    ownerId: "",
                    codes: [] };
            }
            default:
                return state;
        }
    }

    const [draft, dispatch] = useReducer(subsetReducer, init);

    return {draft, dispatch};

};