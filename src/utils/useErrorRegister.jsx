import { useReducer, useEffect } from "react";

export const useErrorRegister = (init) => {

    function subsetReducer(state, {action, data}) {
        switch (action) {
            case "remove": {
                return state.filter((item, index) => index !== data);
            }
            case "empty": {
                return [];
            }
            default:
                return state;
        }
    }

    const [errors, dispatch] = useReducer(subsetReducer, init);

    return {errors, dispatch};

};