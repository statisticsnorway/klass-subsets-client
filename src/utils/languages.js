import { languages as defaultLanguages } from '../defaults';

export function nextDefaultName(items = []) {
    if (items?.length === 0) {
        return {
            languageText: '',
            languageCode: (defaultLanguages?.filter(l => l.draft)?.find(l => l.default)?.languageCode || 'nb' )
        };
    }
    const used = items?.map(item => item.languageCode);
    const unused = defaultLanguages?.filter(l => l.draft)?.find(l => !used?.includes(l.languageCode));
    return unused
        ? {
            languageText: '',
            languageCode: unused?.languageCode
        }
        : null;
}

export function disableUsed(languages, used) {
    return languages?.forEach(l => (l.disabled = used?.includes(l.languageCode)));
}