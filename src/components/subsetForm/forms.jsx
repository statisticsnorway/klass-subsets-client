import {availableLanguages, disableUsed} from '../../internationalization/languages';
import React, {useContext, useEffect} from 'react';
import {PlusSquare, Trash2} from 'react-feather';
import keys from '../../utils/keys';
import {useTranslation} from 'react-i18next';
import {AppContext} from '../../controllers/context';
import {useGet as useGetSubset} from '../../controllers/subsets-service';

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
                                <span style={{padding: '0 10px 0 0'}}>{t(error)}.</span>
                            ))}
                        </div>
                    }

                    <LanguageSelect languages={languages}
                                    selected={item.languageCode}
                                    onChange={(e) => handleLang(index, e.target.value)}
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
                             options = [{ title: ' ', id: ' ', disabled: false}],
                             placeholder = 'Select',
                             disabledText = 'Outdated',
                             selected='',
                             onSelect,
                             errorMessages = []
                        }) => {
    const { t } = useTranslation();

    return (
        <div className='ssb-dropdown' style={{padding: '15px 0'}}>
            <label htmlFor={label} style={{fontSize: '16px'}}>
                {label}
            </label>
            <select className='dropdown-interactive-area focused'
                    id={label}
                    style={{
                        width: '595px',
                        border: '1px solid black',
                        padding: '10px',
                        fontSize: '16px',
                    }}
                    value={selected}
                    onChange={(e) => onSelect(options.find(o => o.id === e.target.value))}
            >
                <option value='' hidden>{placeholder}</option>
                {selected.length > 0 && !options.find(s => s.id === selected)
                    && (<option key='outdated'
                                disabled
                                value={selected}
                                >{selected} ({disabledText})
                    </option>)
                }
                {options.map((option) => (
                    <option key={option.id} value={option.id} disabled={option.disabled}>{option.title}</option>
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

export const SubsetIdForm = () => {
    const { subset } = useContext(AppContext);
    const { t } = useTranslation();

    const [exist,,, setPathExist] = useGetSubset();

    useEffect(() => {
        subset.draft.version === '1'
        && subset.draft.administrativeStatus === 'INTERNAL'
        && subset.draft.id?.length > 0
        && setPathExist(subset.draft.id);
    }, [subset.draft.id]);

    return (
        <>
            <label htmlFor='shortName'>ID:</label>
            <input type='text'
                   id='shortName'
                   name='shortName'
                   value={subset.draft.id}
                // DOCME
                   maxLength='128'
                   onChange={(event) => {
                       setPathExist(event.target.value);
                       subset.dispatch({
                           action: 'shortName_update',
                           data: event.target.value
                       });
                   }}
                   style={{margin: '0 5px'}}
                   disabled={subset.draft.administrativeStatus !== 'INTERNAL'
                   || subset.draft.version !== '1'}
            />
            { subset.draft.id?.length > 0 && exist && !exist.error &&
            <div className='ssb-input-error ' style={{width: '25%', position: 'absolute'}}>
                <span style={{padding: '0 10px 0 0'}}>{t('Already used ID')}</span>
            </div>
            }
        </>
    );
};