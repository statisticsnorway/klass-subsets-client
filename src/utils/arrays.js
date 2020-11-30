import {sanitize} from "./strings";

export const clone = (items) => items.map(item => Array.isArray(item) ? clone(item) : {...item});

// TESTME
export function flatten(arr) {
    return [].concat(...arr);
}

// TESTME
export function orderByValidFromAsc(array) {
    return array?.sort((a,b) =>
        a.validFrom < b.validFrom ? 1 :
            a.validFrom > b.validFrom ? -1 : 0);
}

// TESTME
export function orderByValidFromDesc(array) {
    return array?.sort((a,b) =>
        a.validFrom < b.validFrom ? -1 :
            a.validFrom > b.validFrom ? 1 : 0);
}

// TESTME
export function sanitizeArray(array, maxlength) {
    return array?.map(o => ({
        ...o,
        languageText: sanitize(o.languageText, maxlength)
    }));
}