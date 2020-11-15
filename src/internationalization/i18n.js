import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import english from './en.json';
import bokmaal from './nb.json';
import nynorsk from './nn.json';

// the translations
// (tip move them in a JSON file and import them)
export const resources = {
    en: {
        translation: english
    },
    nb: {
        translation: bokmaal
    },
    nn: {
        translation: nynorsk
    }
};

i18n
    .use(initReactI18next) // passes i18n down to react-i18next
    .init({
        resources,
        lng: 'nb',
        fallbackLng: 'en',

        keySeparator: false, // we do not use keys in form messages.welcome

        interpolation: {
            escapeValue: false // react already safes from xss
        }
    });

export default i18n;