export const clone = (items) => items.map(item => Array.isArray(item) ? clone(item) : {...item});

export function flatten(arr) {
    console.log("flatten", arr);
    return [].concat(...arr);
}
