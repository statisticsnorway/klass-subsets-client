import {useState, useReducer, useEffect} from 'react';
import {nextDefaultName} from '../internationalization/languages';
import {URN} from './klass-api';
import {validate} from './validator';
import {toId} from '../utils/strings'

export const useSubset = (init =  {
        id: '',
        name: [],
        shortName: '',
        administrativeStatus: 'INTERNAL', // cannot be changed by the app, by service only
        validFrom: null,
        validUntil: null,
        createdBy: '',
        administrativeDetails: [
            {
                administrativeDetailType: 'ANNOTATION',
                values: []
            },
            {
                administrativeDetailType: 'ORIGIN',
                values: []
            }
        ],
        description: [],
        version: '1',
        versionRationale: [],
        versionValidFrom: null,
        versionValidUntil: null, // just for local use, not part of Classification scheme
        codes: []
    }
    ) => {

    const [errors, setErrors] = useState({
        name: [],
        validFrom: [],
        validUntil: [],
        period: [],
        createdBy: [],
        annotation: [],
        description: [],
        versionRationale: [],
        versionValidFrom: [],
        versionValidUntil: [],
        versionPeriod: [],
        origin: [],
        codes: []
    });

    function verifyOrigin(origin = [], codes = []) {
        // TESTME
        // TODO: if origin values are not empty, check if all values are valid URNs

        if (codes?.length === 0) {
            return [...origin];
        }

        const updated = new Set(origin);
        codes.forEach(c => updated.add(URN.toURL(c.urn).classificationURN));
        return [...updated];
    }

    function subsetReducer(state, {action, data = {}}) {
        switch (action) {
            case 'edit': {
                return  {
                    ...data,
                    administrativeStatus: !data?.administrativeStatus ? 'DRAFT' : data.administrativeStatus,
                    shortName: data.shortName ? data.shortName : ''
                };
            }
            case 'update': {
                return  {...state};
            }
            case 'validate': {
                setErrors(validate.subset(state));
                return  state;
            }
            case 'name_update': {
                return  {...state,
                        id: (!state.id || (state.administrativeStatus === 'INTERNAL' && state.name.length === 1))
                            ? toId(state.name[0].languageText)
                            : state.id,
                        shortName: (!state.id || (state.administrativeStatus === 'INTERNAL' && state.name.length === 1))
                            ? state.name[0].languageText
                            : state.shortName ? state.shortName : ''
                    };
            }
            case 'name_add': {
                const name = nextDefaultName(state.name);
                return  name === null
                    ? {...state}
                    : {...state,
                        name: [...state.name, name]
                      };
            }
            case 'name_remove': {
                return {
                    ...state,
                    name: state.name?.filter((item, index) => index !== data)
                };
            }
            case 'from': {
                // FIXME: restrictions
                // TODO: warning 'this field changes affects versionValidFrom for v1.0'
                setErrors(prev => ({
                    ...prev,
                    period: validate.period(data, state.validUntil)
                }));
                return {...state,
                    validFrom: data,
                    versionValidFrom: state.version === '1' ? data : state.versionValidFrom
                };
            }
            case 'version_from': {
                const {date, versions} = data;
                // FIXME: restrictions
                // TODO: warning 'this field changes affects validFrom for v1.0'

                if ((!versions || versions.length === 0) && state.version === '1') {
                    console.log('very first version');
                    setErrors(prev => ({
                        ...prev,
                        versionValidFrom: validate.versionValidFrom(state.validFrom, state.validUntil, date),
                        versionPeriod: validate.period(date, state.validUntil),
                    }));
                    return {...state,
                        versionValidFrom: date,
                        validFrom: date
                    }
                }
                // if versionValidFrom is null

                const latest = versions.sort((a, b) =>
                    a.versionValidFrom < b.versionValidFrom ? 1 :
                    a.versionValidFrom > b.versionValidFrom ? -1 : 0)[0];
                // later version
                if ((latest?.validUntil && date === latest?.validUntil)
                    || (!latest?.validUntil && date > latest?.versionValidFrom)) {
                    console.log('later version');
                    setErrors(prev => ({
                        ...prev,
                        versionValidFrom: validate.versionValidFrom(state.validFrom, latest?.validUntil, date),
                        versionPeriod: validate.period(date, state.versionValidUntil),
                        validFrom: validate.validFrom(state.validFrom),
                        period: validate.period(state.validFrom, state.versionValidFrom === latest?.validFrom ? null :  state.versionValidFrom)
                    }));
                    return {...state,
                        versionValidFrom: date,
                        versionValidUntil: state.versionValidFrom === latest?.validFrom ? null :  state.versionValidFrom,
                        validUntil: state.versionValidFrom === latest?.validFrom ? null :  state.versionValidFrom
                    }
                }

                // earlier version
                if (date >= new Date('1800-01-01').toISOString() && date < latest?.validFrom) {
                    console.log('earlier version from ');
                    setErrors(prev => ({
                        ...prev,
                        versionValidFrom: validate.versionValidFrom(date, state.validUntil, date),
                        versionPeriod: validate.period(date, latest?.validFrom),
                        validFrom: validate.validFrom(date),
                        period: validate.period(date, state.validUntil)
                    }));
                    return {
                        ...state,
                        versionValidFrom: date,
                        validFrom: date,
                        versionValidUntil: latest?.validFrom
                    };
                }

                // other
                console.log('covered period or illegal input');
                setErrors( prev => ({
                    ...prev,
                    versionValidFrom: validate.versionValidFrom(state.validFrom, latest?.validUntil || state.versionValidUntil  || latest?.versionValidFrom, date),
                    versionPeriod: validate.period(date, state.versionValidUntil),
                    validFrom: validate.validFrom(state.validFrom),
                    period: validate.period(state.validFrom, state.validUntil)
                }));
                return {
                    ...state,
                    versionValidFrom: date
                };
            }
            case 'version_to': {
                // FIXME: restrictions
                // TODO: warning 'this field changes affects validUntil
                setErrors(prev => ({
                        ...prev,
                        period: validate.period(state.validFrom, data),
                        versionPeriod: validate.period(state.versionValidFrom, data)
                    }
                ));
                return {...state, versionValidUntil: data, validUntil: data};
            }
            case 'version_rationale_add': {
                const vr = nextDefaultName(state.versionRationale);
                return  vr === null
                    ? {...state}
                    : {...state, versionRationale: [...state.versionRationale, vr]};
            }
            case 'version_rationale_remove': {
                return {
                    ...state,
                    versionRationale: state.versionRationale?.filter((item, index) => index !== data)
                };
            }
            case 'version_switch': {
                const {item, versions} = data;
                if (item === 'New version') {
                    const latest = versions.sort((a,b) =>
                        a.versionValidFrom < b.versionValidFrom ? 1 :
                            a.versionValidFrom > b.versionValidFrom ? -1 : 0)[0];
                    return {
                        ...state,
                        version: `${ Math.max(...versions.map(v => v.version)) +1 }`,
                        administrativeStatus: 'INTERNAL',
                        versionRationale: [ nextDefaultName([]) ],
                        versionValidFrom: latest?.versionValidUntil,
                        versionValidUntil: null,
                        validUntil: null
                    };
                } else {
                    const chosenVersion = parseInt(item);
                    const exists = versions.find(v => v.version === chosenVersion);
                    if (exists) {
                        const next = versions.filter(v => v.versionValidFrom > exists.versionValidFrom)
                            .sort((a, b) =>
                                a.versionValidFrom < b.versionValidFrom ? -1 :
                                    a.versionValidFrom > b.versionValidFrom ? 1 : 0)[0];
                        return {
                            ...exists,
                            version: exists.version,
                            versionRationale: exists.versionRationale?.length > 0
                                ? exists.versionRationale
                                : [ nextDefaultName([]) ],
                            versionValidFrom: exists.versionValidFrom,
                            versionValidUntil: next?.versionValidFrom || exists.validUntil,
                            codes: exists.codes
                        };
                    }
                }
                return state;
            }
            case 'to': {
                // FIXME: restrictions
                setErrors(prev => ({
                        ...prev,
                        period: validate.period(state.validFrom, data)
                    }
                ));
                return {...state, validUntil: data};
            }
            case 'createdBy': {
                return  {...state, createdBy: data};
            }
            case 'subject': {
                // FIXME: mutable change
                state.administrativeDetails
                    .find(d => d.administrativeDetailType === 'ANNOTATION')
                    .values[0] = data;
                return  {...state};
            }
            case 'description_add': {
                const description = nextDefaultName(state.description);
                return  description === null
                    ? {...state}
                    : {...state, description: [...state.description, description]};
            }
            case 'description_remove': {
                return {
                    ...state,
                    description: state.description?.filter((item, index) => index !== data)
                };
            }
            case 'remove_empty': {
                return {...state,
                    name: state.name.filter(item => item.languageText?.length > 0),
                    description: state.description.filter(item => item.languageText?.length > 0),
                    versionRationale: state.versionRationale.filter(item => item.languageText?.length > 0)
                };
            }
            case 'codelist_include': {
                const annotation = state.administrativeDetails?.find(d => d.administrativeDetailType === 'ANNOTATION');
                const origin = state.administrativeDetails?.find(d => d.administrativeDetailType === 'ORIGIN');

                origin.values = origin.values.find(v => v === data) ? origin.values : [data, ...origin.values];
                return  {
                    ...state,
                    administrativeDetails: [annotation, origin]
                };
            }
            // DOCME: if a codelist is chosen, but no codes are checked,
            //  the code list remains in the subset until it explicitly excluded.
            case 'codelist_exclude': {
                const origin = state.administrativeDetails.find(d => d.administrativeDetailType === 'ORIGIN').values;
                state.administrativeDetails.find(d => d.administrativeDetailType === 'ORIGIN').values =
                    origin.filter(urn => urn !== data);

                const codes = state.codes.filter(c => !c.urn.startsWith(data));

                return  {...state, codes};
            }
            case 'codes_include': {
                const candidates = data.filter(c => !state.codes.find(s => s.urn === c.urn));
                const administrativeDetails = updateOrigin(state.administrativeDetails, candidates);

                return  {
                    ...state,
                    administrativeDetails,
                    codes: reorder([...candidates, ...state.codes])}
            }
            case 'codes_exclude': {
                const candidates = state.codes.filter(c => !data.find(s => s.urn === c.urn));
                return  {
                    ...state,
                    codes: reorder([...candidates])};
            }
            case 'codes_rerank': {
                data.codes.forEach(code => {
                    const reranked = state.codes?.find(c => c.urn === code.urn);
                    if (reranked && data.rank && data.rank !== '-') {
                        reranked.rank = data.rank;
                    }
                })
                return  {
                    ...state,
                    codes: reorder([...state.codes])};
            }
            case 'codes_cache': {
                const codes = state.codes.map(s => s.urn !== data.urn ? s : {...s, ...data});
                return { ...state, codes}
            }
            case 'reset': {
                sessionStorage.removeItem('draft');
                return init;
            }
            default:
                return state;
        }
    }

    function reorder(list) {
        if (list?.length > 0) {
            list.sort((a, b) => (a.rank - b.rank -1));
        }
        return rerank(list);
    }

    function rerank(list) {
        return list.map((item, i) => ({
            ...item,
            rank: i + 1
        }));
    }

    // TESTME
    function updateOrigin(administrativeDetails, codes) {
        const annotation = administrativeDetails?.find(d => d.administrativeDetailType === 'ANNOTATION');
        const origin = administrativeDetails?.find(d => d.administrativeDetailType === 'ORIGIN');

        origin.values = verifyOrigin(origin.values, codes);

        return [annotation, origin];
    }

    // FIXME: if the draft in session storage is undefined, the whole app crashes with error message:
    // Error: A cross-origin error was thrown. React doesn't have access to the actual error object in development.
    // FIX: try catch
    const [draft, dispatch] = useReducer(subsetReducer, initialize());

    // FIXME: runs on every draft update, should run once the hook is initialized in the context
    // FIXME: discard on non-valid draft and return init
    function initialize() {
        const restored = JSON.parse(sessionStorage.getItem('draft'));
        if (restored) {

            const annotation =
                restored.administrativeDetails?.find(d => d.administrativeDetailType === 'ANNOTATION')
                || init.administrativeDetails?.find(d => d.administrativeDetailType === 'ANNOTATION');

            const origin =
                restored.administrativeDetails?.find(d => d.administrativeDetailType === 'ORIGIN')
                || init.administrativeDetails?.find(d => d.administrativeDetailType === 'ORIGIN');

            origin.values = verifyOrigin(origin.values, restored.codes);

            restored.administrativeDetails = [ annotation, origin ];
        }
        return {...init, ...restored} || init;
    }

    useEffect(() => {
        sessionStorage.setItem('draft', JSON.stringify(draft));
    }, [draft]);

    return {draft, dispatch, errors};
};
