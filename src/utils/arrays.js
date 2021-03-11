import { sanitize } from './strings';

export const clone = (items) => items.map(item => Array.isArray(item) ? clone(item) : {...item});

// TESTME
export function flatten(arr) {
    return [].concat(...arr);
}

// TESTME
export function orderByValidFromDesc(array) {
    return array?.sort(compareValues('validFrom', 'desc'))
    // return array?.sort((a,b) =>
    //     a.validFrom < b.validFrom ? 1 :
    //         a.validFrom > b.validFrom ? -1 : 0);
}

// TESTME
export function orderByValidFromAsc(array) {
    return array?.sort(compareValues('validFrom'))
    // return array?.sort((a,b) =>
    //     a.validFrom < b.validFrom ? -1 :
    //         a.validFrom > b.validFrom ? 1 : 0);
}

// TESTME
export function sanitizeArray(array, maxlength) {
    return array?.map(o => ({
        ...o,
        languageText: sanitize(o.languageText, maxlength)
    }));
}


function compareValues(key, order = 'asc') {
    return function innerSort(a, b) {
        if (!a.hasOwnProperty(key) || !b.hasOwnProperty(key)) {
            // property doesn't exist on either object
            console.log(key, "key does not exists")
            return 0;
        }

        let comparison = (a[key] > b[key]) ? 1 :((a[key] < b[key]) ? -1 : 0)
        // console.log(order + ': a=' + a[key] + ', b=' + b[key] + ', comparison=' + comparison +
        //   ', return ' + ((order === 'desc') ? (comparison * -1) : comparison ))
        return ( (order === 'desc') ? (comparison * -1) : comparison );
    };
}
