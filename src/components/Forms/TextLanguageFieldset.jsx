import React from 'react';
import { useTranslation } from 'react-i18next';
import { availableLanguages, disableUsed } from '../../internationalization/languages';
import { LanguageSelect } from './LanguageSelect';
import './form.css';
import { PlusSquare, Trash2 } from 'react-feather';
import { ErrorTooltip } from '../Error';
import { toId } from '../../utils/strings';
import { Required } from '../Required';
import { TextareaPrefixed } from './TextareaPrefixed';
import {PlusButton} from "../Buttons/PlusButton";
import {TrashButton} from "../Buttons";

export const TextLanguageFieldset = ({ title, items = [],
                                         size = {cols: 40, rows: 1},
                                        required = false,
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
        <div className='ssb-text-area'
             style={{ width: '55%', padding: '15px 0 0 0' }}
        >
            <label htmlFor={ toId(title) }
                   style={{display: 'block'}}
                >{ t(title) }{ required && <Required /> }
            </label>

            { items.map((item, index) => (
                <div key={ index }
                     style={{ padding: '0 0 15px 0' }}>

                    <TextareaPrefixed cols={ size.cols }
                                     rows={ size.rows }
                                     maxLength={ maxLength }
                                     id={ toId(title) }
                                     value={ item.languageText }
                                     prefix={ prefix }
                                     onChange={(e) => handleText(index, e.target.value)}
                                     />

                    <ErrorTooltip messages={ errorMessages }/>

                    <LanguageSelect languages={languages}
                                    selected={item.languageCode}
                                    onChange={(e) => handleLang(index, e.target.value)}
                    />

                    <PlusButton
                        title={ t('Add field for another language') }
                        disabled={!(index === items.length - 1 && index < languages.length - 1)}
                        clickHandler={ add }
                    />

                    <TrashButton
                        title={ t('Remove the field') }
                        disabled={ index === 0 }
                        clickHandler={() => remove(index)} />
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