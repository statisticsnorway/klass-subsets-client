import React from 'react';
import { useTranslation } from 'react-i18next';
import './form.css';
import { toId } from 'utils';
import { Required, ErrorTooltip } from 'components';

export const Dropdown = ({
                             label='Select',
                             required = false,
                             options = [{ title: ' ', id: ' ', disabled: false }],
                             placeholder = 'Select',
                             disabledText = 'Outdated',
                             selected='',
                             onSelect,
                             errorMessages = []
                        }) => {
    const { t } = useTranslation();

    return (
        <div style={{
                 padding: '15px 0',
                 fontFamily: 'Roboto',
                 fontStretch: 'normal',
                 fontWeight: 'normal',
                 display: 'flex',
                 flexDirection: 'column',
                 transition: 'all .25s ease-in-out',
                 minWidth: '150px',
                 position: 'relative'
             }}>
            <label htmlFor={ toId(label) }
                   style={{ fontSize: '16px' }}
            >
                { t(label) }{ required && <Required /> }
            </label>
            <select className='dropdown-interactive-area focused'
                    id={ toId(label) }
                    style={{
                        width: '100%',
                        border: '1px solid black',
                        padding: '10px',
                        fontSize: '16px',
                    }}
                    value={ selected }
                    onChange={ (e) =>
                        onSelect(options.find(o => o.id === e.target.value))
                    }
            >
                <option value='' hidden>{ t(placeholder) }</option>
                { selected.length > 0 && !options.find(s => s.id === selected)
                    && (<option key='outdated'
                                disabled
                                value={ selected }
                                >{ selected } ({ t(disabledText) })
                    </option>)
                }
                { options.map((option) => (
                    <option key={ option.id }
                            value={ option.id }
                            disabled={ option.disabled }>{ option.title }
                    </option>
                ))}
            </select>

            <ErrorTooltip visible={ selected.length > 0 }
                          messages={ errorMessages }
            />
        </div>
    );
};
