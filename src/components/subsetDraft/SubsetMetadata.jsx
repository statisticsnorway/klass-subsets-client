import React, {useEffect} from 'react';
import '../../css/form.css';
import {Dropdown, TextLanguageFieldset} from '../../utils/forms';
import {subsetDraft} from '../../controllers/defaults';
import {Title} from '@statisticsnorway/ssb-component-library';
import {useTranslation} from 'react-i18next';
import {useGet} from '../../controllers/klass-api';

/*
 *  TODO: select components (2) from the ssb-component-library
 *  TODO: textarea styled as input text in the ssb-component-library
 *  FIXME: sanitize input
 */

export const SubsetMetadata = ({subset}) => {

    const {draft, dispatch} = subset;
    const { t } = useTranslation();
    const [ssbsections] = useGet('ssbsections.json');
    const [classificationfamilies] = useGet('classificationfamilies.json');

    useEffect(() => {

        draft.name?.length === 0
            && dispatch({action: 'name_add'});

        draft.description?.length === 0
            && dispatch({action: 'description_add'});

        return () => {
            dispatch({action: 'remove_empty'});
        }
    }, []);

    return (
        <>
            <Title size={3}>{t('Metadata')}
                <span style={{fontSize: '14px', color: '#ED5935'}}>
                    {`  ${draft.administrativeStatus || 'Draft'}`}
                </span>
            </Title>
            <TextLanguageFieldset title={t('Names')} items={draft.name}
                                  add={() => dispatch({action: 'name_add'})}
                                  remove={(index) => dispatch({action: 'name_remove', data: index})}
                                  handle={() => dispatch({action: 'update'})}
                                  size={{cols: 65, rows: 1}}
                                  prefix={subsetDraft.namePrefix}
            />

            <section style={{margin: '5px 0 5px 0'}}>
                <div style={{float: 'left', marginRight: '20px', padding: '0'}}>
                    <label style={{display: 'block', fontSize: '16px', fontFamily: 'Roboto'}}
                           htmlFor='from_date'>{t('Valid from')}: </label>
                    <input type='date' id='from_date' style={{display: 'block'}}
                                value={draft.validFrom?.substr(0, 10)}
                                onChange={(e) => {
                                    dispatch({action: 'from', data: new Date(e.target.value).toISOString()});}}
                                className='datepicker'/>
                </div>

                <div style={{float: 'left'}}>
                    <label style={{display: 'block', fontSize: '16px', fontFamily: 'Roboto'}}
                           htmlFor='to_date'>{t('Valid to')}: </label>
                    <input type='date' id='to_date' style={{display: 'block'}}
                                value={draft.validUntil?.substr(0, 10)}
                           onChange={(e) => {
                               dispatch({action: 'to', data: new Date(e.target.value).toISOString()});}}
                           className='datepicker'/>
                </div>
                <br style={{clear: 'both'}}/>
            </section>

            {/* TODO: set automatically when logged inn */}
            <Dropdown label={t('Owner')}
                      options={ssbsections ? ssbsections._embedded.ssbSections : []}
                      placeholder={t('Select a responsible department...')}
                      selected={draft.createdBy}
                      onSelect={(item) => dispatch({
                          action: 'createdBy',
                          data: item })}
            />

            {/* TODO: subject is stored in an array, it could be treated as tags ? */}
            <Dropdown label={t('Subject')}
                      options={classificationfamilies?._embedded.classificationFamilies || []}
                      placeholder={t('Select a classification family...')}
                      selected={draft.administrativeDetails
                          .find(d => d.administrativeDetailType === 'ANNOTATION')
                          .values[0] || ''}
                      onSelect={(item) => dispatch({
                          action: 'subject',
                          data: item })}
            />

            {/* FIXME: limit text size*/}
            <TextLanguageFieldset title={t('Description')} items={draft.description}
                                  add={() => dispatch({action: 'description_add'})}
                                  remove={(index) => dispatch({action: 'description_remove', data: index})}
                                  handle={() => dispatch({action: 'update'})}
                                  size = {{cols: 65, rows: 4}}
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
