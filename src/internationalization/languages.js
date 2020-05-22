import {languages as defaultLanguages} from '../controllers/defaults';
import {clone} from '../utils/arrays';

export function availableLanguages() {
    return clone(defaultLanguages);
}

export function nextDefaultName(items) {
    if (items.length < 1) {
        return {
            languageText: '',
            languageCode: availableLanguages().find(lang => lang.default).languageCode};
    }
    const used = items.map(item => item.languageCode);
    const unused = availableLanguages().find(lang => !used.includes(lang.languageCode));
    return unused ? {languageText: '', languageCode: unused.languageCode} : null;
}

export function disableUsed(languages, used) {
    return languages.forEach((lang) => lang.disabled = used.includes(lang.languageCode));
}