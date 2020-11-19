import React from 'react';
import { useTranslation } from 'react-i18next';
import './form.css';

export const Dropdown = ({
                             label='Select',
                             options = [{ title: ' ', id: ' ', disabled: false }],
                             placeholder = 'Select',
                             disabledText = 'Outdated',
                             selected='',
                             onSelect,
                             errorMessages = []
                        }) => {
    const { t } = useTranslation();

    return (
        <div className='ssb-dropdown' style={{ padding: '15px 0' }}>
            <label htmlFor={ label } style={{ fontSize: '16px' }}>
                { label }
            </label>
            <select className='dropdown-interactive-area focused'
                    id={ label }
                    style={{
                        width: '595px',
                        border: '1px solid black',
                        padding: '10px',
                        fontSize: '16px',
                    }}
                    value={ selected }
                    onChange={ (e) =>
                        onSelect(options.find(o => o.id === e.target.value))
                    }
            >
                <option value='' hidden>{ placeholder }</option>
                { selected.length > 0 && !options.find(s => s.id === selected)
                    && (<option key='outdated'
                                disabled
                                value={ selected }
                                >{ selected } ({ disabledText })
                    </option>)
                }
                { options.map((option) => (
                    <option key={ option.id }
                            value={ option.id }
                            disabled={ option.disabled }>{ option.title }
                    </option>
                ))}
            </select>
            { errorMessages?.length > 0 && selected.length > 0 &&
                <div className='ssb-input-error '>
                    { errorMessages.map(error => (
                        <span key={ error } style={{ padding: '0 10px 0 0' }}>{ t(error) }.</span>
                    ))}
                </div>
            }
        </div>
    );
};
