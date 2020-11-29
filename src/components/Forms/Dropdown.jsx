import React from 'react';
import { useTranslation } from 'react-i18next';
import './form.css';
import { toId } from '../../utils/strings';
import {Required} from "../Required";
import {ErrorTooltip} from "../Error";

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
        <div className='ssb-dropdown' style={{ padding: '15px 0' }}>
            <label htmlFor={ toId(label) } style={{ fontSize: '16px' }}>
                { t(label) }{ required && <Required /> }
            </label>
            <select className='dropdown-interactive-area focused'
                    id={ toId(label) }
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
