import React, { useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AppContext } from '../../controllers/context';
import { Help } from '../Help';

export const VersionValidFromForm = () => {
    const { subset } = useContext(AppContext);
    const { draft, dispatch } = subset;
    const { t } = useTranslation();
    const [ showErrors, setShowErrors ] = useState(false);

    return (
        <>
            <label style={{display: 'block', fontSize: '16px', fontFamily: 'Roboto'}}
                   htmlFor='version_from_date'
            >{ t('Version valid from') }
                <Help>
                    <strong>{ `${t('Version valid from') } *` }. </strong>
                    { t('Version valid from help') }
                </Help>
            </label>

            <input type='date'
                   id='version_from_date'
                   style={{ display: 'block' }}
                   value={ draft.versionValidFrom || '' }
                   disabled={ !draft.isEditableVersionValidFrom() }
                   onChange={ event => dispatch({
                       action: 'version_from',
                       data: event.target.value === ''
                           ? null
                           : new Date(event.target.value).toJSON(),
                   })}
                   className='datepicker'
                   onBlur={ () => setShowErrors(true) }
                   onFocus={ () => setShowErrors(false) }
            />
            { showErrors && draft.errors?.versionValidFrom?.length > 0 && draft?.versionValidFrom &&
            <div className='ssb-input-error '>
                { draft.errors.versionValidFrom.map((error, i) => (
                    <span key={ error + i } style={{ padding: '0 10px 0 0' }}>{ t(error) }.</span>
                ))}
            </div>
            }
        </>
    );
};