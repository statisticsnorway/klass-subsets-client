import React, {useEffect, useState} from 'react';
import '../../css/form.css';
import {useTranslation} from 'react-i18next';
import {Paragraph, Title} from '@statisticsnorway/ssb-component-library';
import {Dropdown, TextLanguageFieldset} from './forms';
import {useGet} from '../../controllers/subsets-service';
import Spinner from '../Spinner';
import {HelpCircle} from 'react-feather';

/*
 *  FIXME: sanitize input
 */

export const VersionsFormStep = ({subset}) => {

    const {draft, dispatch, errors} = subset;
    const {t} = useTranslation();
    const [showHelp, setShowHelp] = useState(false);

    useEffect(() => {
        draft.versionRationale?.length === 0
        && dispatch({action: 'version_rationale_add'});

        return () => {
            dispatch({action: 'remove_empty'});
        };
    }, []);

    const [versions, isLoadingVersions, errorVersions] = useGet(`${draft.id}/versions`);

    return (
        <>
            <Title size={3}>{t('Versions')}</Title>
            <p style={{fontSize: 'calc(10px + 0.3vmin)'}}>ID: <strong>{draft?.id || '-'}  </strong>
                {t('Version')}: <strong>{draft.version || '-'}  </strong>
                {t('Updated')}: <strong>{draft.lastUpdatedDate || '-'}  </strong>
                {t('Status')}: <strong>{t(draft.administrativeStatus) || '-'}  </strong>
            </p>

            {isLoadingVersions
                ? <Spinner/>
                : <Dropdown label={t('Version')}
                            options={!errorVersions && versions && !versions.error
                                ? [
                                    ...versions.map(v => ({...v,
                                        title: `${t('Version')} ${v.version}: ${v.versionValidFrom?.substr(0, 10)}`,
                                        id: `${v.version}`
                                    })),

                                    { title: `${t('New version')}`, id: 'New version', disabled: draft.temporary }
                                ]
                                : []
                            }
                            placeholder={t('Select a version')}
                            disabledText={t('Not saved')}
                            selected={`${draft.version}`}
                            onSelect={(option) => {
                                dispatch({
                                    action: 'version_change',
                                    data: {item: option.id, versions}
                                })
                            }}
                            errorMessages={errors?.version}
                />
            }

            <section style={{margin: '5px 0 5px 0'}}>
                <div style={{float: 'left', marginRight: '20px', padding: '0', position: 'relative', top: '-10px'}}>
                    <label style={{display: 'block', fontSize: '16px', fontFamily: 'Roboto'}}
                           htmlFor='version_from_date'>{t('Version valid from')}:
                        <button
                            onClick={(event) => {
                                event.stopPropagation();
                                setShowHelp(prev => !prev);
                            }}>
                            <HelpCircle color='#2D6975'/>
                        </button>
                    </label>
                    <input type='date'
                           id='version_from_date'
                           style={{display: 'block'}}
                           value={draft.versionValidFrom?.substr(0, 10) || ''}
                           onChange={event => dispatch({
                               action: 'version_from',
                               data: {
                                   date: event.target.value === ''
                                       ? null
                                       : new Date(event.target.value).toISOString(),
                                   versions
                               }})
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
                {/* TODO: warning 'this field changes affects validUntil */}
                <div style={{float: 'left'}}>
                    <label style={{display: 'block', fontSize: '16px', fontFamily: 'Roboto'}}
                           htmlFor='version_to_date'>{t('Version valid until')}: </label>
                    <input type='date'
                           id='version_to_date'
                           style={{display: 'block'}}
                           value={draft.versionValidUntil?.substr(0, 10) || ''}
                           onChange={event => dispatch({
                               action: 'version_to', data:
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

                {showHelp &&
                    <div style={{background: '#274247', color: 'white', padding: '0 0 0 10px'}}>
                        <Paragraph negative>
                            <strong>{t('Version valid from')}. </strong>
                            {t('Version valid from help')}
                        </Paragraph>
                    </div>
                }

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