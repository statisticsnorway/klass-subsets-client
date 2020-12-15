import React from 'react';
import { useTranslation } from 'react-i18next';
import { languages } from '../../defaults';

export const LanguageSwitch = () => {
    const { i18n } = useTranslation();

    return (
        <div id='LanguageSwitch'>
        {   /** FIXME: find a better solution
             * Buttons look like links - confusing.
             * No current state (active language) is shown.
             * TODO: language choice should affect the url ?
             */
           languages
               .filter(l => l.site)
               .map(l => (
                <span
                    key={ l.languageCode }
                    className='global-links'
                >
                    <button onClick={() => i18n.changeLanguage(l.languageCode)}
                            style={{ background: 'none', border: 'none' }}
                        ><span className='ssb-link'>{ l.full }</span>
                    </button>
                </span>
            ))
        }
        </div>
    );
}