import React, { useState } from 'react';
import './datepicker.css';
import { today, toId } from '../../../utils/strings';
import { useTranslation } from 'react-i18next';
import { Required, ErrorTooltip, Help } from '../../../components';
import { HelpButton } from '../../Buttons';

export const Datepicker = ({
                               label = '',
                               required,
                                usage,
                               errorMessages = [],
                               value = today,
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
                   id={ toId(label)}
                   name={ toId(label)}
                   value={ new Date(value)?.toJSON()?.substr(0, 10)}
                   disabled={ disabled}
                   onChange={ () => {
                   }}
                   className='datepicker'
                   onBlur={() => setShowErrors(true)}
                   onFocus={() => setShowErrors(false)}
            />
            <ErrorTooltip
                messages={errorMessages}
                visible={showErrors && value}
            />
            <Help message={ usage } visible={ showHelp } />
        </div>
    );
};