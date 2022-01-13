import { toCodeId } from 'utils';

export const codesControl = (state = {}) => ({

    prependCodes(codes = []) {
        // console.debug('prependCodes', codes);

        if (state.isEditableCodes()) {
            const addition = codes.map((code, i) => [
                toCodeId(code),
                {...code, rank: -1, timestamp: new Date().getTime()+i }
            ]);

            const merged = new Map([...addition, ...state.codesMap]);
            state.codes = [...merged.values()];
        }
    },

    removeTimestamps() {
        state.codes.forEach(c => delete c.timestamp);
    },

    removeCodes(codes = []) {
        //console.debug('removeCodes', codes);

        if (state.isEditableCodes()) {
            const updated = state.codesMap;
            codes?.forEach(code => updated.delete(toCodeId(code)));
            state.codes = [...updated.values()];
        }
    },

    removeCodesWithClassificationId(id) {

        if (state.isEditableCodes()) {
            state.codes = state.codes.filter(c => c.classificationId !== id);
        }
    },

    reorderCodes() {
        // console.debug('reorderCodes', state.codes);

        if (state.isEditableCodes()) {
            state.codes.sort((a, b) => (a.timestamp - b.timestamp || a.rank - b.rank));
        }
    },

    rerankCodes() {
        // console.debug('rerankCodes', state.codes);

        if (state.isEditableCodes()) {
            state.codes.forEach((item, i) => {
                item.rank = i + 1;
            });
        }
    },

    changeRank(rank, codes) {
        // console.debug('changeRank', rank, codes);

        if (state.isEditableCodes() && rank && rank !== '-') {
            state.codes = state.codes.map(function(c) {
                if (codes.find(i =>  i.id === c.id)) {
                    // adjust rank up or down to "move" the target row
                    const adjustedRank = (c.rank > rank) ? rank - 1 : rank + 1;
                    return { ...c, rank: adjustedRank };
                } else {
                    return c;
                }
            })
        }
    }

});