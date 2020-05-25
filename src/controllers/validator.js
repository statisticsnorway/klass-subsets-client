export const validate = {
    period(from, to) {
        return from > to
            ? ['Period cannot start later than end']
            : [];
    }
}