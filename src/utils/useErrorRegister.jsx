import { useReducer } from "react";

export const useErrorRegister = (init) => {

    function subsetReducer(state, {action, data}) {
        switch (action) {
            case "remove": {
                console.log("data", data);
                console.log("array before 0", state[0]);
                console.log("array before 1", state[1]);
                return state.splice(data,1);
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