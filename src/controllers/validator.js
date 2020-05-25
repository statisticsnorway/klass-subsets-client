export const validate = {
    period(from, to) {
        return from > to
            ? ['Period cannot start later than end']
            : from === to
                ? ['Period cannot include and exclude the same day']
                : [];
    }
}