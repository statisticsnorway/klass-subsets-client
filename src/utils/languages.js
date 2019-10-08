import {languages as defaultLanguages} from "../controllers/defaults";
import {clone} from "../utils/arrays";

export function setSelected(abbr = "") {
    const languages = clone(defaultLanguages);
    const lang = languages.find(l => l.abbr === abbr);
    lang && (lang.selected = true);
    return languages;
}

export function availableLanguages() {
    return clone(defaultLanguages);
}

export function nextDefaultName(names) {
    const name = names.length < 1
        ? {name: "Uttrekk for...", lang: "nb"}
        : {name: "Subset for...", lang: "en"};
    return name;
}