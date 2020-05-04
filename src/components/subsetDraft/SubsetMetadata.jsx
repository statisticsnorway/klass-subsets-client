import React, {useContext} from 'react';
import '../../css/form.css';
import {Dropdown, TextLanguageFieldset} from '../../utils/forms';
import {AppContext} from '../../controllers/context';
import {subsetDraft} from '../../controllers/defaults';
import {Title} from '@statisticsnorway/ssb-component-library';
import {useTranslation} from 'react-i18next';

/*
 *  TODO: select components (2) from the ssb-component-library
 *  TODO: textarea styled as input text in the ssb-component-library
 *  FIXME: sanitize input
 */

export const SubsetMetadata = ({subset}) => {

    subset.draft.name && subset.draft.name.length < 1 && subset.dispatch({action: 'name_add'});
    subset.draft.description?.length < 1 && subset.dispatch({action: 'description_add'});
    const {ssbsections, classificationfamilies} = useContext(AppContext);
    const { t } = useTranslation();

    return (
        <>
            <Title size={3}>{t('Metadata')}
                <span style={{fontSize: '14px', color: '#ED5935'}}>
                    {`  ${subset.administrativeStatus || 'Draft'}`}
                </span>
            </Title>
            <TextLanguageFieldset title={t('Names')} items={subset.draft.name}
                                  add={() => subset.dispatch({action: 'name_add'})}
                                  remove={(index) => subset.dispatch({action: 'name_remove', data: index})}
                                  handle={() => subset.dispatch({action: 'update'})}
                                  size={{cols: 65, rows: 1}}
                                  prefix={subsetDraft.namePrefix}
            />

            <section style={{margin: '5px 0 5px 0'}}>
                <div style={{float: 'left', marginRight: '20px', padding: '0'}}>
                    <label style={{display: 'block', fontSize: '16px', fontFamily: 'Roboto'}}
                           htmlFor='from_date'>{t('Valid from')}: </label>
                    <input type='date' id='from_date' style={{display: 'block'}}
                                value={subset.draft.validFrom?.substr(0, 10)}
                                onChange={(e) => {
                                    subset.dispatch({action: 'from', data: new Date(e.target.value)});}}
                                className='datepicker'/>
                </div>

                <div style={{float: 'left'}}>
                    <label style={{display: 'block', fontSize: '16px', fontFamily: 'Roboto'}}
                           htmlFor='to_date'>{t('Valid to')}: </label>
                    <input type='date' id='to_date' style={{display: 'block'}}
                                value={subset.draft.validUntil?.substr(0, 10)}
                           onChange={(e) => {
                               subset.dispatch({action: 'to', data: new Date(e.target.value)});}}
                           className='datepicker'/>
                </div>
                <br style={{clear: 'both'}}/>
            </section>

            {/* TODO: set automatically when logged inn */}
            <Dropdown label={t('Owner')}
                      options={ssbsections ? ssbsections._embedded.ssbSections : []}
                      placeholder={t('Select a responsible department...')}
                      selected={subset.draft.createdBy}
                      onSelect={(item) => subset.dispatch({
                          action: 'createdBy',
                          data: item })}
            />

            {/* TODO: subject is stored in an array, it could be treated as tags ? */}
            <Dropdown label={t('Subject')}
                      options={classificationfamilies?._embedded.classificationFamilies || []}
                      placeholder={t('Select a classification family...')}
                      selected={subset.draft.administrativeDetails
                          .find(d => d.administrativeDetailType === 'ANNOTATION')
                          .values[0] || ''}
                      onSelect={(item) => subset.dispatch({
                          action: 'subject',
                          data: item })}
            />

            {/* FIXME: limit text size*/}
            <TextLanguageFieldset title={t('Description')} items={subset.draft.description}
                                  add={() => subset.dispatch({action: 'description_add'})}
                                  remove={(index) => subset.dispatch({action: 'description_remove', data: index})}
                                  handle={() => subset.dispatch({action: 'update'})}
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
