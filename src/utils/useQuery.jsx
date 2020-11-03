// A hooc that builds on useLocation to parse
// the query string for you.
import { useLocation } from 'react-router-dom';

export function useQuery() {
    return new URLSearchParams(useLocation().search);
}
