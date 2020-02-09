import {availableLanguages, disableUsed} from './languages';
import React from 'react';
import {TextArea} from '@statisticsnorway/ssb-component-library';

export const TextLanguageFieldset = ({title, items = [], size = {cols: 40, rows: 1},
                                         prefix = '',
                                         handle = (data) => console.log(data),
                                         add = () => console.log('+'),
                                         remove = (index) => console.log('-', index)}) => {

    const languages = availableLanguages();
    disableUsed(languages, items.map(name => name.lang));

    return (
        <div className='ssb-text-area' style={{width: '55%'}}>
            <label htmlFor={title} style={{display: 'block'}}
            >{title}</label>

            {items.map((item, index) => (
                <div className='text-language' key={index}>
                    <textarea cols={size.cols} rows={size.rows}
                              id={title}
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
                              onCut={(e) =>
                                  e.target.selectionStart < prefix.length && e.preventDefault()}
                              onPaste={(e) =>
                                  e.target.selectionStart < prefix.length && e.preventDefault()}
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
        </div>
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
        <div className='ssb-dropdown' style={{padding: '15px 0'}}>
            <label htmlFor='ssb_sections' style={{fontSize: '16px'}}>{label}</label>
            <select className='dropdown-interactive-area focused'
                    id='ssb_sections'
                    style={{
                        width: '600px',
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
        </div>
    );
};