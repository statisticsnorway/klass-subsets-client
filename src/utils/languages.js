import {languages as defaultLanguages} from "../controllers/defaults";
import {clone} from "../utils/arrays";

export function setSelected(abbr = "") {
    const languages = clone(defaultLanguages);
    languages.find(l => l.abbr === abbr).selected = true;
    return languages;
}