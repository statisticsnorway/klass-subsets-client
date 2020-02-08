import {availableLanguages, disableUsed} from './languages';
import React from 'react';

export const TextLanguageFieldset = ({title, items = [], size = {cols: 40, rows: 1},
                                         prefix = '',
                                         handle = (data) => console.log(data),
                                         add = () => console.log('+'),
                                         remove = (index) => console.log('-', index)}) => {

    const languages = availableLanguages();
    disableUsed(languages, items.map(name => name.lang));

    return (
        <fieldset>
            <label htmlFor='name' style={{display: 'block'}}
            >{title}</label>

            {items.map((item, index) => (
                <div className='text-language' key={index}>
                    <textarea cols={size.cols} rows={size.rows}
                              value={item.text || prefix}
                              onChange={(e) => handle(item.text = e.target.value)}
                              onKeyPress={(e) => {
                                  e.which !== 0 && e.target.selectionStart < prefix.length && e.preventDefault();
                              }}
                              onKeyDown={(e) => {
                                  ((e.which === 8 && e.target.selectionStart <= prefix.length)
                                      || (e.which === 46 && e.target.selectionStart < prefix.length))
                                      && e.preventDefault();
                                  }
                              }
                              onCut={(e) => e.target.selectionStart < prefix.length && e.preventDefault()}
                              onPaste={(e) => e.target.selectionStart < prefix.length && e.preventDefault()}
                    />

                    <LanguageSelect languages={languages}
                                    selected={item.lang}
                                    onChange={(e) => handle(item.lang = e.target.value)}/>

                    {index === items.length-1 && index < languages.length-1 &&
                    <button style={{margin: '0 20px 0 20px'}}
                            onClick={() => add()}
                    >+</button>}

                    {index > 0 &&
                    <button style={{margin: '0 20px 0 20px'}}
                            onClick={() => {remove(index);}}
                    >-</button>}

                </div>))
            }
            {items.length === 0 &&
            <button style={{margin: '0 20px 0 20px'}}
                    onClick={() => add()}
            >+</button>}
        </fieldset>
    );
};

export const LanguageSelect = ({languages = availableLanguages(),
                                   selected = false,
                                   onChange = (e) => console.log(e.target.value)}) => {

    return (
        <select name='language'
                value={selected || languages.find(lang => lang.default)}
                onChange={(e) => onChange(e)}>
            {languages.map((lang, i) => (
                <option key={i} value={lang.abbr} disabled={lang.disabled}>{lang.full}</option>
            ))}
        </select>
    );
};

export const Dropdown = ({label='Select', options = [], placeholder= 'Select', selected='', onSelect}) => {
    return (
        <div className='ssb-dropdown'>
            <label>{label}
                <select className='dropdown-interactive-area'
                        id='ssb_sections'
                        style={{
                            width: '570px',
                            border: '2px solid #00824D',
                            padding: '8px 16px',
                            margin: '10px'
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
            </label>
        </div>
    );
};