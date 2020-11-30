import { languages as defaultLanguages } from '../defaults';
import { clone } from '../utils/arrays';

export function availableLanguages() {
    return clone(defaultLanguages?.filter(l => l.draft));
}

export function nextDefaultName(items) {
    if (items.length < 1) {
        return {
            languageText: '',
            languageCode: availableLanguages().languages?.find(l => l.default).languageCode};
    }
    const used = items.map(item => item.languageCode);
    const unused = availableLanguages().find(l => !used.includes(l.languageCode));
    return unused ? {languageText: '', languageCode: unused.languageCode} : null;
}

export function disableUsed(languages, used) {
    return languages.forEach(l => (l.disabled = used.includes(l.languageCode)));
}