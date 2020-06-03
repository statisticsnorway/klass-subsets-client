import React, {useEffect, useState} from 'react';
import '../../css/form.css';
import {useTranslation} from 'react-i18next';
import {Title} from '@statisticsnorway/ssb-component-library';
import {Dropdown, TextLanguageFieldset} from './forms';

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

    // STOPSHIP: useGet('{subsets-service}/v1/subsets/{draft.id}/versions')
    const [versions] = useState([
        { version: '1.0.0',
            "codes": [
                {
                    "urn": "urn:klass-api:classifications:68:code:1",
                    "rank": 1
                }],
            versionRationale: [
        {
            "languageText": "version rationale 1",
            "languageCode": "nb"
        }
            ],
            versionValidFrom: '2019-01-01'
        },
        { version: '2.0.0',
            "codes": [
                {
                    "urn": "urn:klass-api:classifications:68:code:2",
                    "rank": 1
                }
            ],
            versionRationale: [
                {
                    "languageText": "version rationale 2",
                    "languageCode": "nb"
                }
            ],
            versionValidFrom: '2020-01-01'
        },
        { version: '3.0.0',
            "codes": [
                {
                    "urn": "urn:klass-api:classifications:68:code:2",
                    "rank": 1
                }
            ],
            versionRationale: [
                {
                    "languageText": "version rationale 2",
                    "languageCode": "nb"
                }
            ],
            versionValidFrom: '2021-01-01'
        }
    ])

    return (
        <>
            <Title size={3}>{t('Versions')}</Title>

            <Dropdown label={t('Version')}
                      options={versions
                          .map(v => ({name: v.version}))
                          .concat({name: 'New version'})
                      }
                      placeholder={t('Select a version')}
                      disabledText={t('New version')}
                      selected={draft.version}
                      onSelect={(item) => {
                          dispatch({
                              action: 'version_change',
                              data: {item, versions}
                          })
                      }}
                      errorMessages={errors?.version}
            />
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
                           onChange={event => dispatch({
                               action: 'version_from',
                               data: event.target.value === ''
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
                           value={draft.versionValidUntil?.substr(0, 10) || ''}
                           onChange={event => dispatch({
                               action: 'to', data:
                                   event.target.value === ''
                                       ? null
                                       : new Date(event.target.value).toISOString()
                           })
                           }
                           className='datepicker'/>
                    {errors?.versionValidUntil?.length > 0 &&
                    <div className='ssb-input-error '>
                        {errors.versionValidUntil.map(error => (
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