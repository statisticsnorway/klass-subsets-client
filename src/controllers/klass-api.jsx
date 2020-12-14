import { useState, useEffect } from 'react';
import { today } from '../utils';

const klassApiServiceEndpoint = process.env.REACT_APP_KLASS_API;

export const URL = {
    service: 'classifications',

    // TESTME
    toCodeURL(classificationId, code, from, to, encodedName) {

        return {
            code,
            name: decodeURI(encodedName),
            service: this.service,
            classificationId: classificationId,
            classificationURN: `urn:ssb:klass-api:classifications:${ classificationId }`,
            path: from && to
                ? `/${this.service}/${classificationId}/codes.json?from=${ from }&to=${ to }&selectCodes=${ code }`
                : from && !to
                    ? `/${this.service}/${classificationId}/codes.json?from=${ from }&selectCodes=${ code }`
                    : !from && to
                        ? `/${this.service}/${classificationId}/codes.json?to=${ to }&selectCodes=${ code }`
                        : `/${this.service}/${classificationId}/codesAt.json?date=${ today() }&selectCodes=${ code }`
            ,
            url: from && to
            ? `${klassApiServiceEndpoint}/${this.service}/${classificationId}/codes.json?from=${ from }&to=${ to }&selectCodes=${ code }`
                : from && !to
                    ? `${klassApiServiceEndpoint}/${this.service}/${classificationId}/codes.json?from=${ from }&selectCodes=${ code }`
                    : !from && to
                        ? `${klassApiServiceEndpoint}/${this.service}/${classificationId}/codes.json?to=${ to }&selectCodes=${ code }`
                        : `${klassApiServiceEndpoint}/${this.service}/${classificationId}/codesAt.json?date=${ today() }&selectCodes=${ code }`
        };
    },

    toClassificationURL(id, from, to) {
        return {
            service: this.service,
            id,
            path: `/${ this.service }/${id}`,
            codesPath: from && to
                ? `/${ this.service }/${id}/codes.json?from=${ from }&to=${to}`
                : from && !to
                    ? `/${ this.service }/${id}/codes.json?from=${ from }`
                    : !from && to
                        ? `/${ this.service }/${id}/codes.json?to=${ to }`
                        : `/${ this.service }/${id}/codesAt.json?date=${ today() }`,
            url: `${klassApiServiceEndpoint}/${ this.service }/${ id }`,
            codesUrl: from && to
                ? `${klassApiServiceEndpoint}/${ this.service }/${ id }/codes.json?from=${ from }&to=${ to }`
                : from && !to
                    ? `${klassApiServiceEndpoint}/${ this.service }/${ id }/codes.json?from=${ from }`
                    : !from && to
                        ? `${klassApiServiceEndpoint}/${ this.service }/${ id }/codes.json?to=${ to }`
                        : `${klassApiServiceEndpoint}/${ this.service }/${ id }/codesAt.json?date=${ today() }`
        };
    },

    info: (url, from, to) => {

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
    const { path, url } = URL.toCodeURL(
        origin?.classificationId,
        origin?.code,
        origin?.validFromInRequestedRange,
        origin?.validToInRequestedRange);

    const [ codeData, setCodeData ] = useState({
        ...origin,
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
            const matchedName = targetCode.codes.filter(c => c.name === origin.name);
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

    const { metadata, codesWithNotes, isLoadingVersion } = useClassification(origin.classificationId);

    useEffect(() => {
        metadata?.name && setCodeData(prevCodeData => {
            return {
                ...prevCodeData,
                classification: metadata.name
            };
        });
    }, [metadata]);

    useEffect(() => {
        const exists = codesWithNotes.find(c => c.code === origin.code);
        codesWithNotes && setCodeData(prevCodeData => {
            return {
                ...prevCodeData,
                ...exists
            };
        });
    }, [codesWithNotes, setCodeData, origin.code]);

    return {codeData, isLoadingVersion};
}

export function useClassification({
        classificationId = null,
        versionValidFrom = null,
        versionValidUntil =  null
    }) {

    const [ metadata, setMetadata ] = useState({});
    const [ versions, setVersions ] = useState([]);
    const [ codesWithNotes, setCodesWithNotes ] = useState([]);

    const [ info ] = useGet(
        !classificationId || metadata.versions?.length > 0 ? null : `classifications/${classificationId}`);
    useEffect(() => {
        info && setMetadata(info);
    }, [ info, setMetadata ]);

    useEffect(() =>
            setVersions(metadata.versions),
        [ metadata, setVersions ]); // force update: all codes have to be fetch again

    // FIXME handle errors
    const [ version, isLoadingVersion, errorVersion, setVersionPath ] = useGet();
    // Fetch codes for one of the version without codes (codes are undefined)
    // If codes defined as empty array, the attempt to fetch the codes will not fire
    // FIXME: DoS vulnerable. Solution: setup counter for number of attempts per version in versions
    useEffect(() => {
            const missesCodes = versions?.find(v => {

                if (!v.codes &&
                    ((new Date(v.validFrom) >= new Date(versionValidFrom) && new Date(v.validFrom) < (versionValidUntil ? new Date(versionValidUntil) : new Date()))
                        || (new Date(v.validTo) >= new Date(versionValidFrom) && new Date(v.validTo) < (versionValidUntil? new Date(versionValidUntil) : new Date()))
                        )
                    ) {
                    return v;
                }
            });
            if (missesCodes) {
                // TODO: Use links delivered by API, do not parse - less coupling
                const vid = missesCodes._links.self.href.split('/').pop();
                missesCodes.codes = [];
                setVersionPath(`/versions/${vid}`);
            }
    }, [ versions, errorVersion, setVersionPath ]);

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
    }, [ version, setVersions ]);

    useEffect(() => {
        // Assert a version always has classificationItems returned, even it is an empty array.
        // If a version arrived without classification items, its integrity was violated,
        // data will not be processed.
        if (version?.classificationItems) {
            const extended = extendNotesWithVersionData({...version});
            setCodesWithNotes(prevCodesWithNotes => {
                return mergeCodesByName(prevCodesWithNotes, extended);
            });
        }
    }, [ version, setCodesWithNotes ]);

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
                const exists = merged.find(c => c.code === item.code && c.name === item.name);
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

    /*
        useEffect(() => console.debug({metadata}), [metadata]);
        useEffect(() => console.debug({versions}), [versions]);
        useEffect(() => console.debug({version}), [version]);
        useEffect(() => console.debug({codesWithNotes}), [codesWithNotes]);
    */

    return { metadata, versions, codesWithNotes, isLoadingVersion };
}