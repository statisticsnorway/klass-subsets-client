import { nextDefaultName, sanitize, toId } from '../../utils';
import { languages, subsetDraft } from '../../defaults';

export const nameControl = (state = {}) => ({

    addName(name = nextDefaultName(state?.name)) {

        if (state.isEditableName()
            && state?.name?.length < languages.filter(l => l.draft).length)
        {
            //console.debug('addName', name);

            state.name = [...state.name, name];
        }
    },

    removeNameByIndex(index) {
        if (state.isEditableName()
            && index >= 0 && index < state.name?.length)
        {
            //console.debug('removeNameByIndex', index);

            state.name = state.name?.filter((item, i) => i !== index);
        }
    },

    removeEmptyNames() {
        if (state.isEditableName()) {
            //console.debug('removeEmptyNames');

            state.name = state.name?.filter(item => item.languageText?.length > 0);
        }
    },

    updateNameTextByIndex(index = -1, text = '') {
        if (state.isEditableName()
            && index >= 0 && index < state.name?.length)
        {
            //console.debug('updateNameTextByIndex', index, text);

            state._name[index].languageText = sanitize(text, subsetDraft?.maxLengthName);
            if (!state.shortName && state.name?.length > 0) {
                state.id = toId(state.name[0].languageText);
            }
        }
    },

    updateNameLanguageByIndex(index = -1, lang = '') {
        if (state.isEditableName()
            && index >= 0 && index < state.name?.length
            && state.isAcceptableLanguageCode(lang))
        {
            //console.debug('updateNameLanguageByIndex', index, lang);

            state._name[index].languageCode = lang;
        }
    }
});