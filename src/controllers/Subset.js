/* experiment 1
function Subset (id, name) {
    let init = {
        id: '',
        name: 'Stephanie',
    }

    return Object.assign(
        init,
        eater(init)
    )
}

const eater = (state) => ({
    eat(amount) {
        console.log(`${state.name} is eating.`)
        state.energy += amount
    }
})*/

export function Subset (data) {
    const init  = {
        id: '',
        name: [],
        shortName: '',
        administrativeStatus: 'INTERNAL',
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

    const subset = {...init, ...data};

    return Object.assign(
        subset,
        editable(subset)
    );
}

const editable = (state) => ({
    isEditableId() {
        console.log(state.administrativeStatus === 'INTERNAL'
            && state.version === '1');
        return state.administrativeStatus === 'INTERNAL'
            && state.version === '1';
    }
})