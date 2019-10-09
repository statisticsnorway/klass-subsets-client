import {languages as defaultLanguages} from "../controllers/defaults";
import {clone} from "../utils/arrays";

export function availableLanguages() {
    return clone(defaultLanguages);
}

export function nextDefaultName(names) {
    const languages = availableLanguages();
    const used = names.map(name => name.lang);
    const unused = languages.find(lang => !used.includes(lang.abbr));
    return names.length < 1
        ? {name: "", lang: languages.find(lang => lang.default).abbr}
        : names.length < languages.length ?
            {name: "", lang: unused.abbr}
            : null;
}

export function disableUsed(languages, used) {
    return languages.forEach((lang) => used.includes(lang.abbr)
        ? lang.disabled = true
        : lang.disabled = false);
}