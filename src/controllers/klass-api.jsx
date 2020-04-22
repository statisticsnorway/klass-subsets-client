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
    useEffect(() => { info && setMetadata(info) }, [info]);

    useEffect(() => setVersions(metadata.versions), [metadata]); // force update: all codes have to be fetch again

    // FIXME handle errors
    const [version, isLoadingVersion, errorVersion, setVersionPath] = useGet();
    // Fetch codes for one of the version without codes (codes are undefined)
    // If codes defined as empty array, the attempt to fetch the codes will not fire
    // FIXME: DoS vulnerable. Solution: setup counter for number of attempts per version in versions
    useEffect(() => {
        if (versions) {
            const missingCodes = versions.find(v => {
                console.log({v});
                return !v.codes;
            });
            console.log('missing codes', missingCodes);
            if (missingCodes) {
                // TODO: Use links delivered by API, do not parse - less coupling
                const vid = missingCodes._links.self.href.split('/').pop();
                setVersionPath(`/versions/${vid}`);
            }
        }
    }, [versions, errorVersion, setVersionPath]);

    useEffect(() => {
        if (version?.classificationItems) {
            setVersions(prevVersions => {
                let index = prevVersions.findIndex(v => v._links.self.href === version._links.self.href);
                console.log({index});
                if (index >= 0 && index < prevVersions.length) {
                    prevVersions[index].codes = [...version.classificationItems];
                    console.log('right index, versions will be: ', [...prevVersions]);
                    return [...prevVersions];
                } else {
                    console.log('no index');
                    return [...prevVersions];
                }
            }); // force update
        }
    }, [version, setVersions]);

    useEffect(() => console.log({metadata}), [metadata]);
    useEffect(() => console.log({versions}), [versions]);
    useEffect(() => console.log({version}), [version]);

    return {metadata, versions};
}

export function useClassification(id = null) {
    const [metadata, setMetadata] = useState({});
    const [versions, setVersions] = useState([]);
    // TODO: fetch and expose variants
    const [variants, setVariants] = useState([]);
    const [codesWithNotes, setCodesWithNotes] = useState([]);

    // FIXME handle errors
    const [info, isLoadingInfo, errorInfo] = useGet(
        !id || metadata.versions?.length > 0 ? null : `classifications/${id}`);
    useEffect(() => info && setMetadata(info), [info]);
    useEffect(() => setVersions(metadata.versions), [metadata]); // force update: all codes have to be fetch again


    // FIXME handle errors
    const [version, isLoadingVersion, errorVersion, setVersionPath] = useGet();
    // Fetch codes for one of the version without codes (codes are undefined)
    // If codes defined as empty array, the attempt to fetch the codes will not fire
    // FIXME: DoS vulnerable. Solution: setup counter for number of attempts per version in versions
    useEffect(() => {
        if (versions?.length > 0) {
            let missingCodes = versions.find(v => !v.codes);
            if (missingCodes) {
            // TODO: Use links delivered by API, do not parse - less coupling
                id = missingCodes._links.self.href.split('/').pop();
                setVersionPath(`/versions/${id}`);
            }
        }
    }, [versions, errorVersion]);

    useEffect(() => {
        if (version) {
            let index = versions.findIndex(v => v._links.self.href = version._links.self.href);
            if (index >= 0 && index < versions.length) {
                setVersions([...versions, versions[index].codes = [...version.classificationItems] || [] ]); // force update
            }
        }
    }, [version]);

    // TODO: analyse racing conditions:
    // if several versions cause codes update at the same time,
    // some data could be overwritten with outdated state
    useEffect(() => {
        if (version?.classificationItems?.length > 0) {
            const extended = extendNotesWithVersionData(version);
            setCodesWithNotes(mergeCodesByName(codesWithNotes, extended));
        }
    }, [version]);

    function extendNotesWithVersionData(version) {
        const versionData = {
            versionName: version.name,
            validFrom: version.validFrom,
            validTo: version.validTo
        };
        const extendedClassificationItems = [...version.classificationItems];
        extendedClassificationItems.forEach(item => item.note = {
            note: item.notes,
            ...versionData
        });
        return extendedClassificationItems;
    }

    function mergeCodesByName(codes = [], classificationItems = []) {
        const merged = [...codes];

        if (classificationItems) {
            classificationItems.forEach(item => {
                const exists = merged.find(c => c.code === item.code);
                if (exists) {
                    exists.notes = mergeNotesByVersionName(exists.notes, item.note);
                } else {
                    merged.push({...item})
                }
            });
        }

        return merged;
    }

    function mergeNotesByVersionName(notes = [], note = {}) {
        const merged = [...notes];

        if (note) {
            const exists = notes.find(n => n.note.versionName === note?.versionName);
            if (!exists) {
                notes.push({...note});
            }
        }
        return merged;
    }

    return {metadata, versions, variants, codesWithNotes}
}