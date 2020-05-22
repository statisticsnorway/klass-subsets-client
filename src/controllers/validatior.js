export const validator = {
    checkPeriod(from, to) {
        return from > to
            ? ['Period cannot start later than end']
            : [];
    }
}