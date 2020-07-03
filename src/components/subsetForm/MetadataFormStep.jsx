import React, {useEffect, useState} from 'react';
import '../../css/form.css';
import {Dropdown, TextLanguageFieldset} from './forms';
import {subsetDraft} from '../../controllers/defaults';
import {Title, Paragraph} from '@statisticsnorway/ssb-component-library';
import {useTranslation} from 'react-i18next';
import {useGet} from '../../controllers/klass-api';
import {HelpCircle} from 'react-feather';

/*
 *  TODO: select components (2) from the ssb-component-library
 *  TODO: textarea styled as input text in the ssb-component-library
 *  FIXME: sanitize input
 */

export const MetadataFormStep = ({subset}) => {

    const {draft, dispatch, errors} = subset;
    const { t } = useTranslation();
    const [ssbsections] = useGet('ssbsections.json');
    const [classificationfamilies] = useGet('classificationfamilies.json');
    const [showHelp, setShowHelp] = useState(false);

    useEffect(() => {
        draft.name?.length === 0
            && dispatch({action: 'name_add'});

        draft.description?.length === 0
            && dispatch({action: 'description_add'});

        return () => {
            dispatch({action: 'remove_empty'});
        };
    }, []);

    return (
        <>
            <Title size={3}>{t('Metadata')}
                <span style={{fontSize: '14px', color: '#ED5935'}}>
                    {`  ${t(draft.administrativeStatus) || ''}`}
                </span>
            </Title>

            <p style={{fontSize: 'calc(10px + 0.3vmin)'}}>ID: <strong>{draft?.id || '-'}  </strong>
                {t('Version')}: <strong>{draft.version || '-'}  </strong>
                {t('Updated')}: <strong>{draft.lastUpdatedDate || '-'}  </strong>
                {t('Status')}: <strong>{t(draft.administrativeStatus) || '-'}  </strong>
            </p>

            <TextLanguageFieldset title={t('Names')}
                                  items={draft.name}
                                  add={() => dispatch({action: 'name_add'})}
                                  remove={(index) => dispatch({action: 'name_remove', data: index})}
                                  handle={() => dispatch({action: 'name_update'})}
                                  size={{cols: 65, rows: 1}}
                                  prefix={subsetDraft.namePrefix}
                                  errorMessages={errors.name}
                                  maxLength={250}
            />

            <section style={{margin: '5px 0 5px 0'}}>
                <div style={{float: 'left', marginRight: '20px', padding: '0'}}>
                    <label style={{display: 'block', fontSize: '16px', fontFamily: 'Roboto'}}
                           htmlFor='from_date'>{t('Valid from')}: </label>
                    <input type='date' id='from_date' style={{display: 'block'}}
                                value={draft.validFrom?.substr(0, 10) || ''}
                                onChange={event => dispatch({action: 'from', data:
                                            event.target.value === ''
                                                ? null
                                                : new Date(event.target.value).toISOString()})
                                }
                                className='datepicker'/>
                    {errors?.validFrom?.length > 0 &&
                    <div className='ssb-input-error '>
                        {errors.validFrom.map(error => (
                            <span style={{padding: '0 10px 0 0'}}>{t(error)}.</span>
                        ))}
                    </div>
                    }
                </div>

                <div style={{float: 'left', position: 'relative', top: '-10px'}}>
                    <label style={{display: 'block', fontSize: '16px', fontFamily: 'Roboto'}}
                           htmlFor='to_date'>{t('Valid to')}:
                        <button
                            onClick={(event) => {
                                event.stopPropagation();
                                setShowHelp(prev => !prev);
                        }}>
                            <HelpCircle color='#2D6975'/>
                        </button>
                    </label>
                    <input type='date' id='to_date'
                           style={{display: 'block', border: 'none'}}
                           disabled
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
                {showHelp &&
                    <div style={{background: '#274247', color: 'white', padding: '0 0 0 10px'}}>
                        <Paragraph negative>
                            <strong>{t('Valid to')}. </strong>
                            {t('Valid to help')}
                        </Paragraph>
                    </div>
                }


                {errors?.period?.length > 0 &&
                    <div className='ssb-input-error '>
                        {errors.period.map(error => (
                            <span style={{padding: '0 10px 0 0'}}>{t(error)}.</span>
                        ))}
                    </div>
                }
            </section>


            {/* TODO: set automatically when logged inn */}
            <Dropdown label={t('Owner')}
                      options={ssbsections ? ssbsections._embedded?.ssbSections : []}
                      placeholder={t('Select a responsible department...')}
                      disabledText={t('Outdated')}
                      selected={draft.createdBy}
                      onSelect={(item) => dispatch({
                          action: 'createdBy',
                          data: item })}
                      errorMessages={errors?.createdBy}
            />

            {/* TODO: subject is stored in an array, it could be treated as tags ? */}
            <Dropdown label={t('Subject')}
                      options={classificationfamilies?._embedded?.classificationFamilies || []}
                      placeholder={t('Select a classification family...')}
                      disabledText={t('Outdated')}
                      selected={draft.administrativeDetails
                          .find(d => d.administrativeDetailType === 'ANNOTATION')
                          .values[0] || ''}
                      onSelect={(item) => dispatch({
                          action: 'subject',
                          data: item })}
                      errorMessages={errors?.annotation}
            />


            {/* FIXME: limit text size*/}
            <TextLanguageFieldset title={t('Description')}
                                  items={draft.description}
                                  add={() => dispatch({action: 'description_add'})}
                                  remove={(index) => dispatch({action: 'description_remove', data: index})}
                                  handle={() => dispatch({action: 'update'})}
                                  size = {{cols: 65, rows: 4}}
                                  errorMessages={errors?.description}
            />

{/* TODO: implement in next version
            <label><input type='checkbox'/>Subscribe for changes</label>
*/}

            {/* TODO: implement in next version if ordered
            /* move to each fieldset (?)
            <Button onClick={() => {subset.dispatch({action: 'reset'});}}>Reset</Button>
*/}
        </>
    );
};
