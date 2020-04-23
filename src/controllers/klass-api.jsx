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
    const [versions, setVersions] = useState([]);
    // TODO: fetch and expose variants
    const [variants, setVariants] = useState([]);
    const [codesWithNotes, setCodesWithNotes] = useState([]);

    const [info, isLoadingInfo, errorInfo] = useGet(
        !id || metadata.versions?.length > 0 ? null : `classifications/${id}`);
    useEffect(() => { info && setMetadata(info) }, [info, setMetadata]);

    useEffect(() => setVersions(metadata.versions), [metadata, setVersions]); // force update: all codes have to be fetch again

    // FIXME handle errors
    const [version, isLoadingVersion, errorVersion, setVersionPath] = useGet();
    // Fetch codes for one of the version without codes (codes are undefined)
    // If codes defined as empty array, the attempt to fetch the codes will not fire
    // FIXME: DoS vulnerable. Solution: setup counter for number of attempts per version in versions
    useEffect(() => {
        if (versions) {
            const missesCodes = versions.find(v => !v.codes);
            console.log('misses codes', missesCodes);
            if (missesCodes) {
                // TODO: Use links delivered by API, do not parse - less coupling
                const vid = missesCodes._links.self.href.split('/').pop();
                setVersionPath(`/versions/${vid}`);
            }
        }
    }, [versions, errorVersion, setVersionPath]);

    useEffect(() => {
        // Assumed a version always has classificationItems returned, even it is an empty array.
        // If a version arrived without classification items, something wrong has happened,
        // the state will not be updated.
        if (version?.classificationItems) {
            setVersions(prevVersions => {
                const exists = prevVersions.find(v => v._links.self.href === version._links.self.href);
                if (exists) {
                    exists.codes = [...version.classificationItems];
                }
                return [...prevVersions];
            }); // force update
        }
    }, [version, setVersions]);

    useEffect(() => console.log({metadata}), [metadata]);
    useEffect(() => console.log({versions}), [versions]);
    useEffect(() => console.log({version}), [version]);

    return {metadata, versions};
}
