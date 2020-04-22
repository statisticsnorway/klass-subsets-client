import {useState, useEffect} from 'react';
const klassApiServiceEndpoint = process.env.REACT_APP_KLASS_API;

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
                    message: `Error during fetching: ${e.message}`,
                    path
                });
                setIsLoading(false);
            }
        };

        if (path) {
            setError(null);
            setIsLoading(true);
            //setTimeout(fetchData, 1000);
            fetchData();
        }

    }, [path]);

    return [data, isLoading, error, setPath];
}


export function useCodelist(id = null) {
    const [metadata, setMetadata] = useState({});

    const [info, isLoadingInfo, errorInfo] = useGet(
        !id || metadata.versions?.length > 0 ? null : `classifications/${id}`);
    useEffect(() => {
        if (info) {
            setMetadata(info);
        }
    }, [info]);

    return {metadata};
}
