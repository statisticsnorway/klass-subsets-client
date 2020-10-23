import { useState, useEffect } from 'react';
import { today } from '../utils/strings';

const klassApiServiceEndpoint = process.env.REACT_APP_KLASS_API;

export const URN = {

    // FIXME sanitize input - XSS is a threat!!!
    // For now it accepts letters, digits, % & # _ - . , etc
    // the code will be used to fetch data from the Klass API
    codePattern: /urn:ssb:klass-api:classifications:[0-9]+:code:[-]?[\w]+:encodedName:[\w]+/i,
    classificationPattern: /urn:ssb:klass-api:classifications:[0-9]+/i,

    isCodePattern(urn) {
        if (!urn) return false;

        if (!this.codePattern.test(urn)) {
            console.warn('Unexpected code URN pattern', urn);
        }
        return this.codePattern.test(urn);
    },

    isClassificationPattern(urn) {
        if (!urn) return false;

        if (!this.classificationPattern.test(urn)) {
            console.warn('Unexpected classification URN pattern', urn);
        }
        return this.classificationPattern.test(urn);
    },
    // TESTME
    toURL(urn, from, to) {
        if (this.codePattern.test(urn)) {
            const [,,,service,id,,code,,encodedName] = urn.split(':');

            return {
                code,
                name: decodeURI(encodedName),
                service,
                classificationId: id,
                classificationURN: `urn:ssb:klass-api:classifications:${ id }`,
                path: from && to
                    ? `/${service}/${id}/codes.json?from=${ from }&to=${ to }&selectCodes=${ code }`
                    : from && !to
                        ? `/${service}/${id}/codes.json?from=${ from }&selectCodes=${ code }`
                        : !from && to
                            ? `/${service}/${id}/codes.json?to=${ to }&selectCodes=${ code }`
                            : `/${service}/${id}/codesAt.json?date=${ today() }&selectCodes=${ code }`
                ,
                url: from && to
                ? `${klassApiServiceEndpoint}/${service}/${id}/codes.json?from=${ from }&to=${ to }&selectCodes=${ code }`
                    : from && !to
                        ? `${klassApiServiceEndpoint}/${service}/${id}/codes.json?from=${ from }&selectCodes=${ code }`
                        : !from && to
                            ? `${klassApiServiceEndpoint}/${service}/${id}/codes.json?to=${ to }&selectCodes=${ code }`
                            : `${klassApiServiceEndpoint}/${service}/${id}/codesAt.json?date=${ today() }&selectCodes=${ code }`
            };
        }

        if (this.classificationPattern.test(urn)) {
            const [,,, service, id] = urn.split(':');

            return {
                service,
                id,
                path: `/${service}/${id}`,
                codesPath: from && to
                    ? `/${service}/${id}/codes.json?from=${from}&to=${to}`
                    : from && !to
                        ? `/${service}/${id}/codes.json?from=${ from }`
                        : !from && to
                            ? `/${service}/${id}/codes.json?to=${ to }`
                            : `/${service}/${id}/codesAt.json?date=${ today() }`,
                url: `${klassApiServiceEndpoint}/${ service }/${ id }`,
                codesUrl: from && to
                    ? `${klassApiServiceEndpoint}/${ service }/${ id }/codes.json?from=${ from }&to=${ to }`
                    : from && !to
                        ? `${klassApiServiceEndpoint}/${ service }/${ id }/codes.json?from=${ from }`
                        : !from && to
                            ? `${klassApiServiceEndpoint}/${ service }/${ id }/codes.json?to=${ to }`
                            : `${klassApiServiceEndpoint}/${ service }/${ id }/codesAt.json?date=${ today() }`
            };
        }

        console.warn('Unexpected URN pattern:', urn);

        return {};
    }
};

export const URL = {

    toURN: (url, from, to) => {

        // FIXME sanitize input - XSS is a threat!!!
        // For now it accepts letters, digits, % & # _ - . , etc
        // the code will be used to fetch data from the Klass API
        // verify service end point
        const classificationPattern = /https:\/\/data.ssb.no\/api\/klass\/v1\/classifications\/[0-9]+/i;

        if (classificationPattern.test(url)) {
            const [ protocol,, domain, api, klass, version, service, id ] = url.split('/');

            return {
                service,
                id,
                urn: `urn:ssb:klass-api:classifications:${id}`,
                path: `/${service}/${id}`,
                codesPath: from && to
                    ? `/${service}/${id}/codes.json?from=${from}&to=${to}`
                    : from && !to
                        ? `/${service}/${id}/codes.json?from=${ from }`
                        : !from && to
                            ? `/${service}/${id}/codes.json?to=${ to }`
                            : `/${service}/${id}/codesAt.json?date=${ today() }`
            };
        }
        return {};
    }
};

// TODO: error handling using global and private error handlers
export function useGet(url = null) {
    const [ path, setPath ] = useState(url);
    const [ data, setData ] = useState(null);
    const [ isLoading, setIsLoading ] = useState(false);
    const [ error, setError ] = useState(null);

    useEffect(() => {
        let _mounted = true;

        const fetchData = async () => {
            setData(null);
            setError(null);
            setIsLoading(true);

            try {
                const response = await fetch(`${klassApiServiceEndpoint}${path}`);
                const json = await response.json();
                if (response.status >= 200 && response.status <= 299 && _mounted) {
                    setData(json);
                    setIsLoading(false);
                } else {
                    throw Error(
                        `${json.error} ${json.message}`
                        || `${response.status} ${response.statusText}`
                    );
                }
            } catch (e) {
                _mounted && setError({
                    timestamp: Date.now(),
                    status: e.status,
                    error: 'Fetch error',
                    message: `Error during fetching: ${e.message}`,
                    path
                });
                _mounted && setIsLoading(false);
            }
        };

        if (_mounted && path) {
            console.debug({path, _mounted});
            setError(null);
            setIsLoading(true);
            //setTimeout(fetchData, 1000);
            fetchData();
        }

        return () => {
            _mounted = false;
        };
        
    }, [ path ]);

    return [ data, isLoading, error, setPath ];
}

export function useCode(origin) {
    const { code, name, classificationId, path, url } = URN.toURL(
        origin?.urn,
        origin?.validFromInRequestedRange,
        origin?.validToInRequestedRange);

    const [ codeData, setCodeData ] = useState({
        ...origin,
        code,
        name,
        classificationId,
        _links: {
            self: {
                href: url
            }
        }
    });

    // FIXME handle errors
    const [ targetCode ] = useGet(origin?.name ? null : path);
    useEffect(() => {
        if (targetCode?.codes?.length > 0) {



            // TODO: do better
            const matchedName = targetCode.codes.filter(c => c.name === name);
            console.log({matchedName});
            if (matchedName.length > 1) {
                matchedName.forEach(c => {
                    matchedName[0].validFromInRequestedRange += c.validFromInRequestedRange;
                    matchedName[0].validToInRequestedRange += c.validToInRequestedRange;
                })
            }



            setCodeData(prevCodeData => {
                return {...prevCodeData, ...matchedName[0]};
            });
        }
    }, [ targetCode ]);

    const { metadata, codesWithNotes, isLoadingVersion } = useClassification(classificationId);

    useEffect(() => {
        metadata?.name && setCodeData(prevCodeData => {
            return {
                ...prevCodeData,
                classification: metadata.name
            };
        });
    }, [metadata]);

    useEffect(() => {
        const exists = codesWithNotes.find(c => c.code === code);
        codesWithNotes && setCodeData(prevCodeData => {
            return {
                ...prevCodeData,
                ...exists
            };
        });
    }, [codesWithNotes, setCodeData, code]);

    return {codeData, isLoadingVersion};
}

export function useClassification(id = null) {
    const [ metadata, setMetadata ] = useState({});
    const [ versions, setVersions ] = useState([]);
    const [ codesWithNotes, setCodesWithNotes ] = useState([]);

    const [ info ] = useGet(
        !id || metadata.versions?.length > 0 ? null : `classifications/${id}`);
    useEffect(() => {
        info && setMetadata(info);
    }, [info, setMetadata]);

    useEffect(() =>
            setVersions(metadata.versions),
        [ metadata, setVersions ]); // force update: all codes have to be fetch again

    // FIXME handle errors
    const [ version, isLoadingVersion, errorVersion, setVersionPath ] = useGet();
    // Fetch codes for one of the version without codes (codes are undefined)
    // If codes defined as empty array, the attempt to fetch the codes will not fire
    // FIXME: DoS vulnerable. Solution: setup counter for number of attempts per version in versions
    useEffect(() => {
            const missesCodes = versions?.find(v => !v.codes);
            if (missesCodes) {
                // TODO: Use links delivered by API, do not parse - less coupling
                const vid = missesCodes._links.self.href.split('/').pop();
                setVersionPath(`/versions/${vid}`);
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
    }, [ version, setCodesWithNotes ]);

    /*
        useEffect(() => console.debug({metadata}), [metadata]);
        useEffect(() => console.debug({versions}), [versions]);
        useEffect(() => console.debug({version}), [version]);
        useEffect(() => console.debug({codesWithNotes}), [codesWithNotes]);
    */

    return { metadata, versions, codesWithNotes, isLoadingVersion };
}