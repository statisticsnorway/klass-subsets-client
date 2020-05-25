import {availableLanguages, disableUsed} from '../../internationalization/languages';
import React from 'react';
import {PlusSquare, Trash2} from 'react-feather';
import keys from '../../utils/keys';
import {useTranslation} from "react-i18next";

export const TextLanguageFieldset = ({title, items = [], size = {cols: 40, rows: 1},
                                         prefix = '',
                                         handle = (data) => {},
                                         add = () => {},
                                         remove = (index) => {},
                                         errorMessages = [],
                                        maxLength
    }) => {
    const { t } = useTranslation();

    const languages = availableLanguages();
    disableUsed(languages, items.map(name => name.languageCode));

    return (
        <div className='ssb-text-area' style={{width: '55%'}}>
            <label htmlFor={title} style={{display: 'block'}}
            >{title}</label>

            {items.map((item, index) => (
                <div key={index} style={{padding: '0 0 15px 0'}}>
                    <textarea cols={size.cols} rows={size.rows}
                              maxLength={maxLength}
                              style={{height: `${size.rows * 44}px`}}
                              id={title}
                              value={item.languageText || prefix}
                              onChange={(e) => handle(item.languageText = e.target.value)}
                              onKeyPress={(e) => {
                                  e.which !== 0 && e.target.selectionStart < prefix.length && e.preventDefault();
                              }}
                              onKeyDown={(e) => {
                                  ((e.which === keys.BACKSPACE && e.target.selectionStart <= prefix.length)
                                      || (e.which === keys.DELETE && e.target.selectionStart < prefix.length))
                                      && e.preventDefault();
                                  }
                              }
                              onCut={(e) =>
                                  e.target.selectionStart < prefix.length && e.preventDefault()}
                              onPaste={(e) =>
                                  e.target.selectionStart < prefix.length && e.preventDefault()}
                    />
                    {errorMessages?.length > 0 &&
                        <div className='ssb-input-error '>
                            {errorMessages.map(error => (
                                <span style={{padding: '0 10px 0 0'}}>{t(error)}.</span>
                            ))}
                        </div>
                    }

                    <LanguageSelect languages={languages}
                                    selected={item.languageCode}
                                    onChange={(e) => handle(item.languageCode = e.target.value)}
                    />

                    <button disabled={!(index === items.length - 1 && index < languages.length - 1)}
                            onClick={() => add()}>
                        <PlusSquare color={(index === items.length - 1 && index < languages.length - 1)
                            ? '#1A9D49' : '#C3DCDC'}/>
                    </button>

                    <button disabled={index === 0}
                            onClick={() => remove(index)}>
                        <Trash2 color={index > 0 ? '#ED5935' : '#C3DCDC'}/>
                    </button>
                </div>))
            }
            {items.length === 0 &&
            <button onClick={() => add()}>
                <PlusSquare color='#1A9D49'/>
            </button>}
        </div>
    );
};

export const LanguageSelect = ({
                                   languages = availableLanguages(),
                                   selected = false,
                                   onChange = (e) => {}
                               }) => {

    return (
        <select name='language' style={{padding: '2px', margin: '5px', position: 'relative', top: '-6px'}}
                value={selected || languages.find(lang => lang.default)}
                onChange={(e) => onChange(e)}>
            {languages.map((lang, i) => (
                <option key={i}
                        value={lang.languageCode}
                        disabled={lang.disabled}
                        >{lang.full}
                </option>
            ))}
        </select>
    );
};

export const Dropdown = ({
                             label='Select',
                             options = [],
                             placeholder= 'Select',
                             selected='',
                             onSelect,
                             errorMessages = []
                        }) => {
    const { t } = useTranslation();

    return (
        <div className='ssb-dropdown' style={{padding: '15px 0'}}>
            <label htmlFor='ssb_sections' style={{fontSize: '16px'}}>{label}</label>
            <select className='dropdown-interactive-area focused'
                    id='ssb_sections'
                    style={{
                        width: '595px',
                        border: '1px solid black',
                        padding: '10px',
                        fontSize: '16px',
                    }}
                    value={selected}
                    onChange={(e) => onSelect(e.target.value)}
            >
                <option value='' hidden>{placeholder}</option>
                {selected.length > 0 && !options.find(s => s.name === selected)
                && (<option key='outdated' disabled value={selected}>{selected} (outdated)</option>)
                }
                {options.map((section, i) => (
                    <option key={i} value={section.name}>{section.name}</option>
                ))}
            </select>
            {errorMessages?.length > 0 &&
                <div className='ssb-input-error '>
                    {errorMessages.map(error => (
                        <span style={{padding: '0 10px 0 0'}}>{t(error)}.</span>
                    ))}
                </div>
            }
        </div>
    );
};