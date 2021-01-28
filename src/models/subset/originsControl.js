export const originsControl = (state = {}) => ({

    addOrigin(id = '') {
        //console.debug('addOrigin', classificationId);

        if (state.isEditableOrigins()) {
            state._origins = [id, ...state._origins];
        }
    },

    removeOrigin(id = '') {
        //console.debug('removeOrigin', classificationId);

        if (state.isEditableOrigins()) {
            state._origins = state._origins?.filter(o => o !== id);
            state.removeCodesWithClassificationId(id);
        }
    },

    initOrigins() {
        state._origins = state.currentVersion?.codes
            ? [...new Set(state?.currentVersion?.codes?.map(c => c.classificationId))]
            : [];
    }
});