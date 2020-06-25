export const validate = {

    name(names) {
        return names?.length > 0 ? [] : ['At least one name is required']
    },

    validFrom(date) {
        return date ? [] : ['A valid from date is required']
    },

    period(from, to) {
        return from > to
            ? ['Period cannot start later than end']
            : from === to
                ? ['Period cannot include and exclude the same day']
                : [];
    },

    versionValidFrom(from, to, versionFrom) {
        return versionFrom < from
            ? ['A version cannot start earlier than subsets validity period']
            : versionFrom > to
                ? ['Versions cannot have gaps on validity periods']
                : []
    },

    createdBy(owner) {
        return owner?.length > 0 ? [] : ['Owner is required']
    },

    codes(codes) {
        return codes?.length > 0 ? [] : ['At least one code is required']
    },

    subset(draft) {
        return {
            name: this.name(draft.name),
            validFrom: this.validFrom(draft.validFrom),
            validUntil: [],
            period: this.period(draft.validFrom, draft.validUntil),
            createdBy: this.createdBy(draft.createdBy),
            annotation: [],
            description: [],
            origin: [],
            administrativeStatus: [],
            codes: this.codes(draft.codes)
        }
    }
}