import React, {useContext, useEffect, useState} from 'react';
import '../../css/form.css';
import {Dropdown, TextLanguageFieldset} from './forms';
import {subsetDraft} from '../../controllers/defaults';
import {Title, Paragraph} from '@statisticsnorway/ssb-component-library';
import {useTranslation} from 'react-i18next';
import {useGet} from '../../controllers/klass-api';
import {HelpCircle} from 'react-feather';
import {SubsetBrief} from '../SubsetBrief';
import {AppContext} from "../../controllers/context";

/*
 *  TODO: select components (2) from the ssb-component-library
 *  FIXME: sanitize input
 */

export const Step_1_Metadata = () => {
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

export const SubsetNameForm = () => {
    const { t } = useTranslation();
    const { subset } = useContext(AppContext);
    const { draft, dispatch, errors } = subset;

    useEffect(() => {
        draft.name?.length === 0
        && dispatch({action: 'name_add'});

        return () => {
            dispatch({action: 'remove_empty'});
        };
    }, []);

    return (
        <TextLanguageFieldset title={t('Names')}
                                items={draft?.name}
                                add={() => dispatch({action: 'name_add'})}
                                remove={(index) => dispatch({
                                    action: 'name_remove', data: index})}
                                handleText={(index, text) => dispatch({
                                    action: 'name_text', data: {index, text}})}
                                handleLang={(index, lang) => dispatch({
                                    action: 'name_lang', data: {index, lang}})}
                                size={{cols: 65, rows: 1}}
                                prefix={subsetDraft?.namePrefix}
                                errorMessages={errors?.name}
                                maxLength={250}
        />
    );
};

export const SubsetValidityForm = () => {
    const { t } = useTranslation();
    const { subset } = useContext(AppContext);
    const { draft, dispatch, errors } = subset;
    const [showHelp, setShowHelp] = useState(false);
console.log({errors});
    return (
      <section style={{margin: '5px 0 5px 0'}}>
          <div style={{float: 'left', marginRight: '20px', padding: '0'}}>
              <label style={{display: 'block', fontSize: '16px', fontFamily: 'Roboto'}}
                     htmlFor='from_date'>{t('Valid from')}: </label>
              <input type='date'
                     id='from_date'
                     style={{display: 'block'}}
                     value={draft.validFrom?.substr(0, 10) || ''}
                     onChange={event => dispatch({
                         action: 'from',
                         data: event.target.value === ''
                             ? null
                             : new Date(event.target.value).toISOString()})}
                     className='datepicker'
                     disabled={draft.administrativeStatus === 'OPEN'}
              />
              {errors?.validFrom?.length > 0 &&
                  <div className='ssb-input-error '>
                      {errors.validFrom.map(error => (
                          <span key={error} style={{padding: '0 10px 0 0'}}>{t(error)}.</span>
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
  );
};

export const SubsetSectionForm = () => {
    const { t } = useTranslation();
    const { subset } = useContext(AppContext);
    const { draft, dispatch, errors } = subset;
    const [ssbsections] = useGet('ssbsections.json');

    // TODO: set automatically when logged inn
    return (
        <Dropdown label={t('Owner')}
                  options={ssbsections
                      ? ssbsections._embedded?.ssbSections.map(section => ({
                          title: section.name, id: section.name
                      }))
                      : []}
                  placeholder={t('Select a responsible department...')}
                  disabledText={t('Outdated')}
                  selected={draft.createdBy}
                  onSelect={(option) => dispatch({
                      action: 'createdBy',
                      data: option.title })}
                  errorMessages={errors?.createdBy}
        />
    );
};

export const SubsetSubjectForm = () => {
    const { t } = useTranslation();
    const { subset } = useContext(AppContext);
    const { draft, dispatch, errors } = subset;
    const [classificationfamilies] = useGet('classificationfamilies.json');

    return (
        <Dropdown label={t('Subject')}
                  options={classificationfamilies?._embedded?.classificationFamilies
                      .map(family => ({title: family.name, id: family.name}))
                  || []}
                  placeholder={t('Select a classification family...')}
                  disabledText={t('Outdated')}
                  selected={draft.administrativeDetails
                      .find(d => d.administrativeDetailType === 'ANNOTATION')
                      .values[0] || ''}
                  onSelect={(option) => dispatch({
                      action: 'subject',
                      data: option.title })}
                  errorMessages={errors?.annotation}
        />
    );
};

export const SubsetDescriptionForm = () => {
    const {t} = useTranslation();
    const {subset} = useContext(AppContext);
    const {draft, dispatch, errors} = subset;

    useEffect(() => {
        draft.description?.length === 0
        && dispatch({action: 'description_add'});

        return () => {
            dispatch({action: 'remove_empty'});
        };
    }, []);

    // FIXME: limit text size
    return (
        <TextLanguageFieldset title={t('Description')}
                              items={draft.description}
                              add={() => dispatch({action: 'description_add'})}
                              remove={(index) => dispatch({
                                  action: 'description_remove', data: index})}
                              handleText={(index, text) => dispatch({
                                  action: 'description_text', data: {index, text}})}
                              handleLang={(index, lang) => dispatch({
                                  action: 'description_lang', data: {index, lang}})}
                              size = {{cols: 65, rows: 4}}
                              errorMessages={errors?.description}
        />
    );
};