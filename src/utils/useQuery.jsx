// A hook that builds on useLocation to parse the query string
import { useLocation } from 'react-router-dom';

export function useQuery() {
    return new Query(useLocation().search);
}

export function Query(search) {
    const query = new URLSearchParams(search);
    Object.assign(query, updatable(query));
    return query;
}

export const updatable = (state = {}) => ({

    update(k, v) {
        const query = new URLSearchParams(state);
        query.set(k, v);
        return query;
    }

});