import React, { useState } from 'react';
import './datepicker.css';
import { today, toId } from '../../../utils';
import { useTranslation } from 'react-i18next';
import { Required, ErrorTooltip, Help, HelpButton } from '../../../components';

export const Datepicker = ({
                               label = '',
                               required,
                                usage,
                               errorMessages = [],
                               value = today(),
                               disabled = false,
                               onChange = () => {},
                            ...props
}) => {
    const { t } = useTranslation();
    const [ showErrors, setShowErrors ] = useState(false);
    const [ showHelp, setShowHelp ] = useState(false);

    return (
        <div className='datepicker' style={props.style}>
            <label htmlFor={ toId(label) }
            >{ t(label) } {
                required && <Required/>
            } { usage &&
                <HelpButton clickHandler={ (event) => {
                    event.stopPropagation();
                    setShowHelp(prev => !prev);
                }
            } /> }
            </label>

            <input type='date'
                   id={ toId(label) }
                   name={ toId(label) }
                   className='datepicker'
                   value={ value }
                   disabled={ disabled}
                   onChange={ (e) => onChange(e) }
                   onBlur={() => setShowErrors(true)}
                   onFocus={() => setShowErrors(false)}
            />
            <ErrorTooltip
                messages={ errorMessages }
                visible={ showErrors && value }
            />
            <Help message={ usage } visible={ showHelp } />
        </div>
    );
};