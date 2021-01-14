import React from 'react';
import { useTranslation } from 'react-i18next';
import { disableUsed, toId } from 'utils';
import { languages } from 'defaults';
import { LanguageSelect, TextareaPrefixed } from '../Forms';
import { ErrorTooltip, Required, PlusButton, TrashButton  } from 'components';
import './form.css';

export const TextLanguageFieldset = ({ title, items = [],
                                         size = {cols: 40, rows: 1},
                                        required = false,
                                         prefix = [],
                                         handleText = (index, text) => {},
                                         handleLang = (index, lang) => {},
                                         add = () => {},
                                         remove = (index) => {},
                                         errorMessages = [],
                                         maxLength
                                     }) => {
    const { t } = useTranslation();
console.log({prefix})
    return (
        <div className='ssb-text-area'
             style={{ padding: '15px 0 0 0' }}
        >
            <label htmlFor={ toId(title) }
                   style={{ display: 'block' }}
                >{ t(title) }{ required && <Required /> }
            </label>

            { items?.map((item, index) => (
                <div key={ index }
                     style={{ padding: '0 0 15px 0' }}>

                    <TextareaPrefixed cols={ size.cols }
                                     rows={ size.rows }
                                     maxLength={ maxLength }
                                     id={ toId(title) }
                                     value={ item.languageText }
                                     prefix={ prefix.find(p => p.languageCode === item.languageCode)?.languageText }
                                     onChange={(e) => handleText(index, e.target.value)}
                                     />

                    <ErrorTooltip messages={ errorMessages }/>

                    <LanguageSelect languages={ disableUsed( languages, items.map(name => name.languageCode) ) }
                                    selected={ item.languageCode }
                                    onChange={ (e) => handleLang(index, e.target.value) }
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
                </div>
                )
            )}
            { items?.length === 0 &&
                <PlusButton
                    title={ t('Add field for another language') }
                    clickHandler={ add }
                />
            }
        </div>
    );
};