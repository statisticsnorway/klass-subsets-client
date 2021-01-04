export const fetcher2 = (...args) => fetch(...args).then(res => res.json());

export const fetcher = async url => {
    const response = await fetch(url);
    // If the status code is not in the range 200-299,
    // we still try to parse and throw it.
    if (!response.ok) {
        const error = new Error(`Fetch failed with status ${ response.status } ${ response.statusText } ${ response.url }`);
        // Attach extra info to the error object.
        error.info = await response.json();
        error.status = response.status;
        throw error;
    }
    return response.json();
}