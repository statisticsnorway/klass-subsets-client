import React, { useContext, useEffect, useState } from 'react';
import '../../css/form.css';
import { Dropdown, TextLanguageFieldset } from './forms';
import { subsetDraft } from '../../controllers/defaults';
import { Title } from '@statisticsnorway/ssb-component-library';
import { useTranslation } from 'react-i18next';
import { useGet } from '../../controllers/klass-api';
import { SubsetBrief } from '../SubsetBrief';
import { AppContext } from '../../controllers/context';
import { useGet as useGetSubset } from '../../controllers/subsets-service';
import { Help } from '../Help';

export const Step1Metadata = () => {
    const { t } = useTranslation();

    return (
        <>
            <Title size={3}>{t('Metadata')}</Title>
            <SubsetBrief editable />
            <SubsetNameForm />
            <SubsetValidityForm />
            <SubsetSectionForm />
            <SubsetSubjectForm />
            <SubsetDescriptionForm />
        </>
    );
};


export const SubsetIdForm = () => {
    const { subset } = useContext(AppContext);
    const { t } = useTranslation();

    const [exist,,, setPathExist] = useGetSubset();

    useEffect(() => {
        subset.draft.isNew()
        && subset.draft.id?.length > 0
        && setPathExist(subset.draft.id);
    }, [ subset.draft.id ]);

    return (
        <div>
            <label htmlFor='shortName'>ID:</label>
            <input type='text'
                   id='shortName'
                   name='shortName'
                   value={subset.draft.id}
                   maxLength={ subsetDraft.maxLengthId }
                   onChange={(event) => {
                       setPathExist(event.target.value);
                       subset.dispatch({
                           action: 'shortName_update',
                           data: event.target.value
                       });
                   }}
                   style={{margin: '0 5px'}}
                   disabled={ !subset.draft.isNew() }
            />
            { exist && !exist.error &&
                <div className='ssb-input-error ' style={{width: '25%', position: 'absolute'}}>
                    <span style={{padding: '0 10px 0 0'}}>{ t('Already used ID') }</span>
                </div>
            }

            { subset.draft?.errors?.id?.length > 0
                && subset.draft?.id?.length > 0 &&
                <div className='ssb-input-error ' style={{width: '25%', position: 'absolute'}}>
                    {subset.draft?.errors?.id.map(error => (
                        <span key={error} style={{padding: '0 10px 0 0'}}>{t(error)}.</span>
                    ))}
                </div>
            }
        </div>
    );
};

export const SubsetNameForm = () => {
    const { t } = useTranslation();
    const { subset } = useContext(AppContext);
    const { draft, dispatch } = subset;

    useEffect(() => {
        draft.name?.length === 0
        && dispatch({action: 'name_add'});

        return () => {
            dispatch({action: 'remove_empty'});
        };
    }, []);

    return (
        <TextLanguageFieldset title={ `${t('Names')} *`}
                              items={draft?.name}
                              add={() => dispatch({
                                  action: 'name_add'
                              })}
                              remove={(index) => dispatch({
                                  action: 'name_remove',
                                  data: index
                              })}
                              handleText={(index, text) => dispatch({
                                  action: 'name_text',
                                  data: {index, text}
                              })}
                              handleLang={(index, lang) => dispatch({
                                  action: 'name_lang',
                                  data: {index, lang}
                              })}
                              size={{ cols: 65, rows: 1 }}
                              prefix={ subsetDraft?.namePrefix }
                              errorMessages={ draft.errors?.name }
                              maxLength={ subsetDraft.maxLengthName }
        />
    );
};

export const SubsetValidityForm = () => {
    const { t } = useTranslation();
    const { subset } = useContext(AppContext);
    const { draft, dispatch } = subset;

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
                               : new Date(event.target.value).toISOString()
                       })}
                       className='datepicker'
                       disabled={ draft.isPublished }
                />

                { draft.errors?.validFrom?.length > 0 && draft?.validFrom &&
                <div className='ssb-input-error '>
                    { draft.errors.validFrom.map(error => (
                        <span key={error} style={{padding: '0 10px 0 0'}}>{ t(error) }.</span>
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
                       onChange={event => dispatch({
                           action: 'to', data:
                               event.target.value === ''
                                   ? null
                                   : new Date(event.target.value).toISOString()
                       })
                       }
                       className='datepicker'/>

                { draft.errors?.validUntil?.length > 0 &&
                <div className='ssb-input-error '>
                    { draft.errors.validUntil.map(error => (
                        <span style={{padding: '0 10px 0 0'}}>{t(error)}.</span>
                    )) }
                </div>
                }
            </div>

            <br style={{clear: 'both'}}/>

            {draft.errors?.period?.length > 0 &&
                <div className='ssb-input-error '>
                    {draft.errors.period.map(error => (
                        <span style={{padding: '0 10px 0 0'}}>{t(error)}.</span>
                    ))}
                </div>
            }
        </section>
    );
};

export const SubsetSectionForm = () => {
    const { t } = useTranslation();
    const { subset } = useContext(AppContext);
    const { draft, dispatch } = subset;
    const [ ssbsections ] = useGet('ssbsections.json');

    // TODO: set automatically when logged inn
    return (
        <Dropdown label={ `${t('Owner')} *` }
                  options={ ssbsections
                      ? ssbsections._embedded?.ssbSections.map(section => ({
                          title: section.name, id: section.name
                      }))
                      : []}
                  placeholder={ t('Select a responsible department...') }
                  disabledText={ t('Outdated') }
                  selected={ draft.createdBy }
                  onSelect={ (option) => dispatch({
                      action: 'createdBy',
                      data: option.title })}
                  errorMessages={ draft.errors?.createdBy }
        />
    );
};

export const SubsetSubjectForm = () => {
    const { t } = useTranslation();
    const { subset } = useContext(AppContext);
    const { draft, dispatch, errors } = subset;
    const [ classificationfamilies ] = useGet('classificationfamilies.json');

    return (
        <Dropdown label={ `${t('Subject')} *` }
                  options={classificationfamilies?._embedded?.classificationFamilies
                      .map(family => ({title: family.name, id: family.name}))
                  || []}
                  placeholder={t('Select a classification family...')}
                  disabledText={t('Outdated')}
                  selected={draft.subject || ''}
                  onSelect={(option) => dispatch({
                      action: 'subject',
                      data: option.title })}
                  errorMessages={errors?.annotation}
        />
    );
};

export const SubsetDescriptionForm = () => {
    const { t } = useTranslation();
    const { subset } = useContext(AppContext);
    const { draft, dispatch } = subset;

    useEffect(() => {
        draft.description?.length === 0
        && dispatch({action: 'description_add'});

        return () => {
            dispatch({action: 'remove_empty'});
        };
    }, []);

    // DOCME: max description length
    return (
        <TextLanguageFieldset title={t('Description')}
                              items={draft.description}
                              add={() => dispatch({
                                  action: 'description_add'})}
                              remove={(index) => dispatch({
                                  action: 'description_remove',
                                  data: index})}
                              handleText={(index, text) => dispatch({
                                  action: 'description_text',
                                  data: {index, text}})}
                              handleLang={(index, lang) => dispatch({
                                  action: 'description_lang',
                                  data: {index, lang}})}
                              size = {{cols: 65, rows: 4}}
                              errorMessages={draft.errors?.description}
                              maxLength={subsetDraft.maxLengthDescription}
        />
    );
};