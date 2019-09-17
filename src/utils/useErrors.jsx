import { useReducer } from 'react'

export const useErrors = (init = []) => {

    function subsetReducer(state, {action, data = {}}) {
        switch (action) {
            case "empty": {
                return { status: "", message: "" };
            }
            default:
                return state;
        }
    }

    const [errors, dispatch] = useReducer(subsetReducer, init);

    return {errors, dispatch};

};