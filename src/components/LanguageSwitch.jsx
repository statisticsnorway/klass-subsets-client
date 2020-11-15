import React from 'react';
import { useTranslation } from 'react-i18next';
import { languages } from '../controllers/defaults';

export const LanguageSwitch = () => {
    const { i18n } = useTranslation();

    return (
        <>
        {   /** FIXME: find a better solution
             * Buttons look like links - confusing.
             * No current state (active language) is shown.
             * TODO: language choice should affect the url ?
             */
           languages.map(l => (
                <div key={ l.languageCode } className='global-links'>
                    <button onClick={() => i18n.changeLanguage(l.languageCode)}
                            style={{ background: 'none', border: 'none' }}
                        ><span className='ssb-link'>{ l.full }</span>
                    </button>
                </div>
            ))
        }
        </>
    );
}