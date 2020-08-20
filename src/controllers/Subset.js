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
})