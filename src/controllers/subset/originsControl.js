export const originsControl = (state = {}) => ({

    addOrigin(id = '') {
        //console.debug('addOrigin', classificationId);

        state._origins = [ id, ...state._origins ];
    },

    removeOrigin(id = '') {
        //console.debug('removeOrigin', classificationId);

        state._origins = state._origins?.filter(o => o !== id);
        state.removeCodesWithClassificationId(id);
    },

    initOrigins() {
        state._origins = [...new Set(state?.currentVersion?.codes?.map(c => c.classificationId))];
    }
});