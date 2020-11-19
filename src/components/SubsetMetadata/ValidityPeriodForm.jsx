import React, { useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AppContext } from '../../controllers/context';
import { Help } from '../Help';

export const ValidityPeriodForm = () => {
    const { t } = useTranslation();
    const { subset } = useContext(AppContext);
    const { draft, dispatch } = subset;
    const [ showFromErrors, setShowFromErrors ] = useState(false);
    const [ showUntilErrors, setShowUntilErrors ] = useState(false);

    return (
        <section style={{ margin: '5px 0 5px 0' }}>
            <div style={{ float: 'left', marginRight: '20px', padding: '0' }}>

                <label style={{ display: 'block', fontSize: '16px', fontFamily: 'Roboto' }}
                       htmlFor='from_date'>{ `${t('Valid from')} *`} </label>
                <input type='date'
                       id='from_date'
                       style={{ display: 'block' }}
                       value={ draft.validFrom?.substr(0, 10) || '' }
                       onChange={ event => dispatch({
                           action: 'from',
                           data: event.target.value === ''
                               ? null
                               : new Date(event.target.value).toJSON()
                       })}
                       className='datepicker'
                       disabled={ !draft.isNew() }
                       onBlur={ () => setShowFromErrors(true) }
                       onFocus={ () => setShowFromErrors(false) }
                />

                { showFromErrors && draft.errors?.validFrom?.length > 0 && draft?.validFrom &&
                <div className='ssb-input-error '>
                    { draft.errors.validFrom.map(error => (
                        <span key={error} style={{ padding: '0 10px 0 0' }}>{ t(error) }.</span>
                    ))}
                </div>
                }
            </div>

            <div style={{float: 'left', position: 'relative', top: '-10px'}}>
                <label style={{display: 'block', fontSize: '16px', fontFamily: 'Roboto'}}
                       htmlFor='to_date'>
                    { t('Valid to') }
                    <Help>
                        <strong>{t('Valid to')}. </strong>
                        {t('Valid to help')}
                    </Help>
                </label>
                <input type='date' id='to_date'
                       style={{display: 'block', border: 'none'}}
                       disabled
                       value={draft.validUntil?.substr(0, 10) || ''}
                       onChange={ event => dispatch({
                           action: 'to', data:
                               event.target.value === ''
                                   ? null
                                   : new Date(event.target.value).toJSON()
                       })}
                       className='datepicker'
                       onBlur={ () => setShowUntilErrors(true) }
                       onFocus={ () => setShowUntilErrors(false) }
                />

                { showUntilErrors && draft.errors?.validUntil?.length > 0 &&
                <div className='ssb-input-error '>
                    { draft.errors.validUntil.map(error => (
                        <span style={{padding: '0 10px 0 0'}}>{t(error)}.</span>
                    )) }
                </div>
                }
            </div>

            <br style={{clear: 'both'}}/>

            { (showFromErrors || showUntilErrors) && draft.errors?.period?.length > 0 &&
            <div className='ssb-input-error '>
                {draft.errors.period.map(error => (
                    <span style={{padding: '0 10px 0 0'}}>{t(error)}.</span>
                ))}
            </div>
            }
        </section>
    );
};
