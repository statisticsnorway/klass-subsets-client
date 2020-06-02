import React, {useEffect} from 'react';
import '../../css/form.css';
import {useTranslation} from 'react-i18next';
import {Title, Paragraph} from '@statisticsnorway/ssb-component-library';
import {Dropdown, TextLanguageFieldset} from "./forms";

/*
 *  FIXME: sanitize input
 */

export const VersionsFormStep = ({subset}) => {

    const {draft, dispatch, errors} = subset;
    const {t} = useTranslation();
    useEffect(() => {
        draft.versionRationale?.length === 0
        && dispatch({action: 'version_rationale_add'});

        return () => {
            dispatch({action: 'remove_empty'});
        };
    }, []);
    return (
        <>
            <Title size={3}>{t('Versions')}</Title>
            <Paragraph>{draft.version}</Paragraph>

            {/* TODO: autofill if null by
                - validFrom if version 1.0;
                - validUntil if not null and version > 1.0
                */}
            {/* TODO: disable if not null */}
            <section style={{margin: '5px 0 5px 0'}}>
                <div style={{float: 'left', marginRight: '20px', padding: '0'}}>
                    <label style={{display: 'block', fontSize: '16px', fontFamily: 'Roboto'}}
                           htmlFor='version_from_date'>{t('Valid from')}: </label>
                    <input type='date' id='version_from_date' style={{display: 'block'}}
                           value={draft.versionValidFrom?.substr(0, 10) || ''}
                           onChange={event => dispatch({action: 'version_from', data:
                                   event.target.value === ''
                                       ? null
                                       : new Date(event.target.value).toISOString()})
                           }
                           className='datepicker'/>
                    {errors?.versionValidFrom?.length > 0 &&
                    <div className='ssb-input-error '>
                        {errors.versionValidFrom.map(error => (
                            <span style={{padding: '0 10px 0 0'}}>{t(error)}.</span>
                        ))}
                    </div>
                    }
                </div>

                {/* TODO: autofill by next version's versionValidFrom or validUntil */}
                {/* TODO: disable if not null */}
                {/* TODO: warning 'this field changes affects validUntil */}
                <div style={{float: 'left'}}>
                    <label style={{display: 'block', fontSize: '16px', fontFamily: 'Roboto'}}
                           htmlFor='to_date'>{t('Valid to')}: </label>
                    <input type='date' id='to_date'
                           style={{display: 'block'}}
                           value={draft.validUntil?.substr(0, 10) || ''}
                           onChange={event => dispatch({
                               action: 'to', data:
                                   event.target.value === ''
                                       ? null
                                       : new Date(event.target.value).toISOString()
                           })
                           }
                           className='datepicker'/>
                    {errors?.validUntil?.length > 0 &&
                    <div className='ssb-input-error '>
                        {errors.validUntil.map(error => (
                            <span style={{padding: '0 10px 0 0'}}>{t(error)}.</span>
                        ))}
                    </div>
                    }
                </div>
                <br style={{clear: 'both'}}/>

                {errors?.versionPeriod?.length > 0 &&
                <div className='ssb-input-error '>
                    {errors.versionPeriod.map(error => (
                        <span style={{padding: '0 10px 0 0'}}>{t(error)}.</span>
                    ))}
                </div>
                }
            </section>


            {/* FIXME: limit text size*/}
            <TextLanguageFieldset title={t('Version rationale')}
                                  items={draft.versionRationale}
                                  add={() => dispatch({action: 'version_rationale_add'})}
                                  remove={(index) => dispatch({action: 'version_rationale_remove', data: index})}
                                  handle={() => dispatch({action: 'update'})}
                                  size = {{cols: 65, rows: 4}}
                                  errorMessages={errors?.versionRationale}
            />
        </>
    );
};