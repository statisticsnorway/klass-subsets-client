import React from 'react';
import './form.css';
import { languages as defaultLanguages } from 'defaults';

export const LanguageSelect = ({
                                   languages = defaultLanguages,
                                   selected = false,
                                   onChange = (e) => {},
                                   label = 'language'
                               }) => {

    return (
        <>
        <label htmlFor='language'
               className='for_screen_readers'
        >{ label }</label>
        <select name='language'
                id='language'
                style={{ padding: '2px', margin: '5px', position: 'relative', top: '-6px' }}
                value={ selected || languages.find(lang => lang.default) }
                onChange={ (e) => onChange(e)}>
            {languages.map( (lang, i) => (
                <option key={ i }
                        value={ lang.languageCode }
                        disabled={ lang.disabled }
                >{ lang.full }
                </option>
            ))}
        </select>
        </>
    );
};