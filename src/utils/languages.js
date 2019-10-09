import {languages as defaultLanguages} from "../controllers/defaults";
import {clone} from "../utils/arrays";

export function availableLanguages() {
    return clone(defaultLanguages);
}

export function nextDefaultName(names) {
    const languages = availableLanguages();
    const used = names.map(name => name.lang);
    console.log("used includes nb?", used.includes("nb"));
    const unused = languages.find(lang => !used.includes(lang.abbr));
    console.log("used", used);
    console.log("unused", unused);
    return names.length < 1
        ? {name: "Uttrekk for...", lang: languages.find(lang => lang.default).abbr}
        : names.length < languages.length ?
            {name: "Subset for...", lang: unused.abbr}
            : null;
}