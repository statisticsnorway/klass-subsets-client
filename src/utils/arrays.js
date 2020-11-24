export const clone = (items) => items.map(item => Array.isArray(item) ? clone(item) : {...item});

export function flatten(arr) {
    return [].concat(...arr);
}

export function orderByValidFromAsc(array) {
    return array.sort((a,b) =>
        a.validFrom < b.validFrom ? 1 :
            a.validFrom > b.validFrom ? -1 : 0);
}