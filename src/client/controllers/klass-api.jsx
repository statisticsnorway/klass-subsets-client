import {useState, useEffect} from 'react';
import {klassApiServiceEndpoint} from '../config.js';

// TODO: error handling using global and private error handlers
export function useGet(url = null) {
    const [path, setPath] = useState(url);
    const [data, setData] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            setError(null);
            setIsLoading(true);

            try {
                const response = await fetch(`${klassApiServiceEndpoint}${path}`);
                const json = await response.json();
                setData(json);
                setIsLoading(false);
            }
            catch (e) {
                setError({
                    timestamp: Date.now(),
                    status: e.status,
                    error: 'Fetch error',
                    message: 'Error during fetching the subset',
                    path
                });
                setIsLoading(false);
            }
        };

        if (path) {
            setError(null);
            setIsLoading(true);
            setTimeout(fetchData, 1000);
        }

    }, [path]);

    return [data, isLoading, error, setPath];
}
