import { acceptablePeriod, languages } from 'defaults';

export
const restrictable = (state = {}) => ({

    isInAcceptablePeriod(date) {
        return date >= acceptablePeriod?.from
            && date < acceptablePeriod?.until;
    },

    isAcceptableLanguageCode(lang) {
        return (-1 !== languages
            .filter(l => l.draft)
            .findIndex(l => l.languageCode === lang));
    }
});