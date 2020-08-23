import React, { useEffect, useState } from 'react';
import '../../css/form.css';
import { useTranslation } from 'react-i18next';
import { Paragraph, Title } from '@statisticsnorway/ssb-component-library';
import { Dropdown, TextLanguageFieldset } from './forms';
import { useGet } from '../../controllers/subsets-service';
import Spinner from '../Spinner';
import { HelpCircle } from 'react-feather';
import { SubsetBrief } from "../SubsetBrief";

/*
 *  FIXME: sanitize input
 */

export const Step2Versions = ({subset}) => {

    const { draft, dispatch } = subset;
    const { t } = useTranslation();
    const [ showHelp, setShowHelp ] = useState(false);

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
            dispatch({
                action: 'previous_versions',
                data: versions
            });
        }
    }, [ versions, dispatch ]);

    return (
        <>
            <Title size={3}>{t('Versions')}</Title>
            <SubsetBrief />

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
                            selected={draft.version}
                            onSelect={(option) => {
                                dispatch({
                                    action: 'version_switch',
                                    data: option.id
                                });
                            }}
                            errorMessages={draft.errors?.version}
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
                    {draft.errors?.versionValidFrom?.length > 0 &&
                    <div className='ssb-input-error '>
                        {draft.errors.versionValidFrom.map((error, i) => (
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
                               || (draft.validUntil && versions && !versions.error && versions?.find(v => v.version === draft.version && v.administrativeStatus === 'OPEN'))
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
                    {draft.errors?.versionValidUntil?.length > 0 &&
                    <div className='ssb-input-error '>
                        {draft.errors.versionValidUntil.map(error => (
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

                {draft.errors?.versionPeriod?.length > 0 &&
                <div className='ssb-input-error '>
                    {draft.errors.versionPeriod.map((error, i) => (
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
                                  handleText={(index, text) => dispatch({
                                      action: 'version_rationale_text', data: {index, text}})}
                                  handleLang={(index, lang) => dispatch({
                                      action: 'version_rationale_lang', data: {index, lang}})}
                                  size = {{cols: 65, rows: 4}}
                                  errorMessages={draft.errors?.versionRationale}
            />
        </>
    );
};