import React, { useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AppContext } from '../../controllers/context';

export const VersionValidUntilForm = () => {
    const { subset: { draft, dispatch } } = useContext(AppContext);
    const { t } = useTranslation();
    const [ showErrors, setShowErrors ] = useState(false);

    return (
        <>
            <label style={{ display: 'block', fontSize: '16px', fontFamily: 'Roboto' }}
                   htmlFor='version_to_date'>{ t('Version valid until') } </label>
            <input type='date'
                   id='version_to_date'
                   style={{ display: 'block' }}
                   value={ draft.versionValidUntil || '' }
                   disabled={ !draft.isEditableVersionValidUntil() }
                   onChange={ event => dispatch({
                       action: 'version_to',
                       data: event.target.value === ''
                           ? null
                           : new Date(event.target.value)?.toJSON()
                   })}
                   className='datepicker'
                   onBlur={ () => setShowErrors(true) }
                   onFocus={ () => setShowErrors(false) }
            />
            { showErrors && draft.errors?.versionValidUntil?.length > 0 &&
            <div className='ssb-input-error '>
                { draft.errors.versionValidUntil.map((error, i) => (
                    <span key={ error + i } style={{padding: '0 10px 0 0'}}>{ t(error) }.</span>
                ))}
            </div>
            }
        </>
    );
};