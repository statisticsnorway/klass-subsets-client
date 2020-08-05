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

    useEffect(() => {
        if (versions && !versions.error) {
            const exists = versions.find(v => v.version === draft.version);
            if (exists) {
                const next = versions.filter(v => v.versionValidFrom > exists.versionValidFrom)
                    .sort((a, b) =>
                        a.versionValidFrom < b.versionValidFrom ? -1 :
                            a.versionValidFrom > b.versionValidFrom ? 1 : 0)[0];

                dispatch({
                    action: 'version_to',
                    data: next?.versionValidFrom || draft.versionValidUntil || null
                });
            }
        }
    }, [versions]);

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
                                        title: `${t('Version')} ${v.version}: ${v.versionValidFrom?.substr(0, 10)} ${t(v.administrativeStatus)}`,
                                        id: `${v.version}`
                                    })),

                                    { title: `${t('New version')}`, id: 'New version', disabled: !versions.find(v => v.version === draft.version) }
                                ]
                                : []
                            }
                            placeholder={t('Select a version')}
                            disabledText={t(draft.administrativeStatus)}
                            selected={`${draft.version}`}
                            onSelect={(option) => {
                                dispatch({
                                    action: 'version_switch',
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
                           disabled={versions && !versions.error && versions?.find(v => v.version === draft.version && v.administrativeStatus === 'OPEN')}
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
                        {errors.versionValidFrom.map((error, i) => (
                            <span key={error+i} style={{padding: '0 10px 0 0'}}>{t(error)}.</span>
                        ))}
                    </div>
                    }
                </div>

                <div style={{float: 'left'}}>
                    <label style={{display: 'block', fontSize: '16px', fontFamily: 'Roboto'}}
                           htmlFor='version_to_date'>{t('Version valid until')}: </label>
                    <input type='date'
                           id='version_to_date'
                           style={{display: 'block'}}
                           value={draft.versionValidUntil?.substr(0, 10) || ''}
                           disabled={
                               (!draft.versionValidFrom && !draft.validUntil)
                               || (versions && !versions.error && versions?.find(v => v.version === draft.version && v.administrativeStatus === 'OPEN'))
                               || (versions && !versions.error &&
                                   draft.versionValidUntil === versions?.find(v => v.version === draft.version-1)?.validFrom
                                   && draft.versionValidFrom < versions?.find(v => v.version === draft.version-1)?.validFrom)}
                           onChange={event => dispatch({
                               action: 'version_to',
                               data: event.target.value === ''
                                       ? null
                                       : new Date(event.target.value)?.toISOString()})
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
                    {errors.versionPeriod.map((error, i) => (
                        <span key={error+i} style={{padding: '0 10px 0 0'}}>{t(error)}.</span>
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