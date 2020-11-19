import React from 'react';
import { availableLanguages } from '../../internationalization/languages';
import './form.css';

export const LanguageSelect = ({
                                   languages = availableLanguages(),
                                   selected = false,
                                   onChange = (e) => {}
                               }) => {

    return (
        <select name='language' style={{ padding: '2px', margin: '5px', position: 'relative', top: '-6px' }}
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
    );
};