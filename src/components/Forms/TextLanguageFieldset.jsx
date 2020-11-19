import React from 'react';
import { useTranslation } from 'react-i18next';
import { availableLanguages, disableUsed } from '../../internationalization/languages';
import keys from '../../utils/keys';
import { LanguageSelect } from './LanguageSelect';
import './form.css';
import { PlusSquare, Trash2 } from 'react-feather';

export const TextLanguageFieldset = ({title, items = [], size = {cols: 40, rows: 1},
                                         prefix = '',
                                         handleText = (index, text) => {},
                                         handleLang = (index, lang) => {},
                                         add = () => {},
                                         remove = (index) => {},
                                         errorMessages = [],
                                         maxLength
                                     }) => {
    const { t } = useTranslation();

    const languages = availableLanguages();
    disableUsed(languages, items.map(name => name.languageCode));

    return (
        <div className='ssb-text-area' style={{width: '55%', padding: '15px 0 0 0'}}>
            <label htmlFor={title} style={{display: 'block'}}
            >{title}</label>

            {items.map((item, index) => (
                <div key={index} style={{padding: '0 0 15px 0'}}>
                    <textarea cols={size.cols} rows={size.rows}
                              maxLength={maxLength}
                              style={{height: `${size.rows * 44}px`}}
                              id={title}
                              value={item.languageText || prefix}
                              onChange={(e) => handleText(index, e.target.value)}
                              onKeyPress={(e) =>
                                  e.which !== 0 && e.target.selectionStart < prefix.length && e.preventDefault()}
                              onKeyDown={(e) =>
                                  ((e.which === keys.BACKSPACE && e.target.selectionStart <= prefix.length)
                                      || (e.which === keys.DELETE && e.target.selectionStart < prefix.length))
                                  && e.preventDefault()}
                              onCut={(e) =>
                                  e.target.selectionStart < prefix.length && e.preventDefault()}
                              onPaste={(e) =>
                                  e.target.selectionStart < prefix.length && e.preventDefault()}
                    />
                    {errorMessages?.length > 0 &&
                    <div className='ssb-input-error '>
                        {errorMessages.map(error => (
                            <span key={error} style={{padding: '0 10px 0 0'}}>{t(error)}.</span>
                        ))}
                    </div>
                    }

                    <LanguageSelect languages={languages}
                                    selected={item.languageCode}
                                    onChange={(e) => handleLang(index, e.target.value)}
                    />

                    <button disabled={!(index === items.length - 1 && index < languages.length - 1)}
                            onClick={add}>
                        <PlusSquare color={(index === items.length - 1 && index < languages.length - 1)
                            ? '#1A9D49' : '#C3DCDC'}/>
                    </button>

                    <button disabled={index === 0}
                            onClick={() => remove(index)}>
                        <Trash2 color={index > 0 ? '#ED5935' : '#C3DCDC'}/>
                    </button>
                </div>))
            }
            { items.length === 0 &&
            <button onClick={add}>
                <PlusSquare color='#1A9D49'/>
            </button>
            }
        </div>
    );
};