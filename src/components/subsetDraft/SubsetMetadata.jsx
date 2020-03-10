import React, {useContext} from 'react';
import '../../css/form.css';
import {Dropdown, TextLanguageFieldset} from '../../utils/forms';
import {AppContext} from '../../controllers/context';
import {languages, subsetDraft} from '../../controllers/defaults';
import {Title} from '@statisticsnorway/ssb-component-library';
import DatePicker from 'react-date-picker';
import {useTranslation} from "react-i18next";

/*
 *  TODO: select components (2) from the ssb-component-library
 *  TODO: textarea styled as input text in the ssb-component-library
 *  FIXME: buttons Next-Previous have to be aligned properly
 *  FIXME: make empty names and descriptions do not disappear at all
 *  TODO: remove fieldsets? or just its boarder: none
 *  FIXME: sanitize input
 */

export const SubsetMetadata = ({subset}) => {

    subset.draft.names && subset.draft.names.length < 1 && subset.dispatch({action: 'name_add'});
    subset.draft.descriptions && subset.draft.descriptions.length < 1 && subset.dispatch({action: 'description_add'});
    const {ssbsections, classificationfamilies} = useContext(AppContext);
    const { t } = useTranslation();

    return (
        <>
            <Title size={3}>{t('Metadata')}</Title>
            <TextLanguageFieldset title={t('Names')} items={subset.draft.names}
                                  add={() => subset.dispatch({action: 'name_add'})}
                                  remove={(index) => subset.dispatch({action: 'name_remove', data: index})}
                                  handle={() => subset.dispatch({action: 'update'})}
                                  size={{cols: 65, rows: 1}}
                                  prefix={subsetDraft.namePrefix}
            />

            <section style={{margin: '5px 0 5px 0'}}>
                <div style={{float: 'left', marginRight: '20px', padding: '0'}}>
                    <label style={{display: 'block', fontSize: '16px', fontFamily: 'Roboto'}}
                           htmlFor="from_date">{t('Valid from')}: </label>
                    <DatePicker id='from_date' style={{display: 'block'}}
                                value={subset.draft.valid.from}
                                onChange={(date) => subset.dispatch({action: 'from', data: date})}
                                clearIcon={null}
                                format='dd.MM.y'
                                locale={languages.find(i => i.default).IETF}
                                className='datepicker'/>
                </div>

                <div style={{float: 'left'}}>
                    <label style={{display: 'block', fontSize: '16px', fontFamily: 'Roboto'}}
                           htmlFor="to_date">{t('Valid to')}: </label>
                    <DatePicker id='to_date' style={{display: 'block'}}
                                value={subset.draft.valid.to}
                                onChange={(date) => subset.dispatch({action: 'to', data: date})}
                                clearIcon={null}
                                format='dd.MM.y'
                                locale={languages.find(i => i.default).IETF}
                                className='datepicker'/>
                </div>
                <br style={{clear: 'both'}}/>
            </section>

            {/* TODO: set automatically when logged inn */}
            <Dropdown label={t('Owner')}
                      options={ssbsections ? ssbsections._embedded.ssbSections : []}
                      placeholder={t('Select a responsible department...')}
                      selected={subset.draft.ownerId}
                      onSelect={(item) => subset.dispatch({
                          action: 'ownerId',
                          data: item })}
            />

            <Dropdown label={t('Subject')}
                      options={classificationfamilies ? classificationfamilies._embedded.classificationFamilies : []}
                      placeholder={t('Select a classification family...')}
                      selected={subset.draft.subject}
                      onSelect={(item) => subset.dispatch({
                          action: 'subject',
                          data: item })}
            />

            {/* FIXME: limit text size*/}
            <TextLanguageFieldset title={t('Description')} items={subset.draft.descriptions}
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