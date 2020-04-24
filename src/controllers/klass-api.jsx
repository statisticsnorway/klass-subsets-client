import {useState, useEffect} from 'react';

const klassApiServiceEndpoint = process.env.REACT_APP_KLASS_API;


export const URN = {

    toURL: (urn, from, to) => {

        const codePattern = /urn:klass-api:classifications:[0-9]+:code:[0-9]+/i;

        if (codePattern.test(urn) && (from || to)) {
            const [,,service,id,,code] = urn.split(':');

            return from && to
                ? `${klassApiServiceEndpoint}/${service}/${id}/codes.json?from=${from}&to=${to}&selectCodes=${code}`
                : `${klassApiServiceEndpoint}/${service}/${id}/codesAt.json?date=${from || to}&selectCodes=${code}`;
        }
        return null;
    }
};

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
            } catch (e) {
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

export function useClassification(id = null) {
    const [metadata, setMetadata] = useState({});
    const [versions, setVersions] = useState([]);
    const [codesWithNotes, setCodesWithNotes] = useState([]);

    const [info] = useGet(
        !id || metadata.versions?.length > 0 ? null : `classifications/${id}`);
    useEffect(() => {
        info && setMetadata(info);
    }, [info, setMetadata]);

    useEffect(() => setVersions(metadata.versions), [metadata, setVersions]); // force update: all codes have to be fetch again

    // FIXME handle errors
    const [version, , errorVersion, setVersionPath] = useGet();
    // Fetch codes for one of the version without codes (codes are undefined)
    // If codes defined as empty array, the attempt to fetch the codes will not fire
    // FIXME: DoS vulnerable. Solution: setup counter for number of attempts per version in versions
    useEffect(() => {
        if (versions) {
            const missesCodes = versions.find(v => !v.codes);
            if (missesCodes) {
                // TODO: Use links delivered by API, do not parse - less coupling
                const vid = missesCodes._links.self.href.split('/').pop();
                setVersionPath(`/versions/${vid}`);
            }
        }
    }, [versions, errorVersion, setVersionPath]);

    useEffect(() => {
        // Assert a version always has classificationItems returned, even it is an empty array.
        // If a version arrived without classification items, its integrity was violated,
        // data will not be processed.
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

    useEffect(() => {
        // Assert a version always has classificationItems returned, even it is an empty array.
        // If a version arrived without classification items, its integrity was violated,
        // data will not be processed.
        if (version?.classificationItems) {
            const extended = extendNotesWithVersionData(version);
            setCodesWithNotes(prevCodesWithNotes => {
                return mergeCodesByName(prevCodesWithNotes, extended);
            });
        }

        function extendNotesWithVersionData(versionData) {
            return versionData?.classificationItems?.map(item => {
                if (item.notes) {
                    return {
                        ...item,
                        notes: [{
                            note: item.notes,
                            versionName: versionData.name,
                            validFrom: versionData.validFrom,
                            validTo: versionData.validTo
                        }]
                    };
                }
                return {...item, notes: []};
            });
        }

        function mergeCodesByName(codes = [], classificationItems = []) {
            const merged = [...codes];

            if (classificationItems) {
                classificationItems.forEach(item => {
                    const exists = merged.find(c => c.code === item.code);
                    if (exists && item.code.notes) {
                        exists.notes = mergeNotesByVersionName(exists.notes || [], item.code.notes);
                    } else {
                        merged.push({...item});
                    }
                });
            }
            return merged;
        }

        function mergeNotesByVersionName(notes = [], newNotes = []) {
            if (newNotes) {
                // Assert new notes is always an array of 1 element or empty
                const exists = notes.find(n => n.versionName === newNotes[0].versionName);
                if (!exists) {
                    return [...notes, newNotes[0]];
                }
            }
            return notes;
        }
    }, [version, setCodesWithNotes]);

    /*
        useEffect(() => console.log({metadata}), [metadata]);
        useEffect(() => console.log({versions}), [versions]);
        useEffect(() => console.log({version}), [version]);
        useEffect(() => console.log({codesWithNotes}), [codesWithNotes]);
    */

    return {metadata, versions, codesWithNotes};
}