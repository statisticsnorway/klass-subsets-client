import React, { useContext } from 'react';
import '../../css/form.css';
import { TextLanguageFieldset } from '../../utils/forms';
import { AppContext } from '../../controllers/context';
import { subsetDraft } from '../../controllers/defaults';
import { Title, Dropdown } from '@statisticsnorway/ssb-component-library';
import { useTranslation } from 'react-i18next';
import { parseDataForDropDowns } from '../../utils/strings';

/*
 *  TODO: select components (2) from the ssb-component-library
 *  TODO: textarea styled as input text in the ssb-component-library
 *  FIXME: buttons Next-Previous have to be aligned properly
 *  FIXME: sanitize input
 */

export const SubsetMetadata = ({ subset }) => {

    subset.draft.name?.length < 1 && subset.dispatch({ action: 'name_add' });
    subset.draft.description?.length < 1 && subset.dispatch({ action: 'description_add' });
    const { ssbsections, classificationfamilies } = useContext(AppContext);
    const { t } = useTranslation();

    return (
        <>
            <Title size={3}>{t('Metadata')}</Title>
            <TextLanguageFieldset
                title={t('Names')}
                items={subset.draft.name}
                add={() => subset.dispatch({ action: 'name_add' })}
                remove={index =>
                    subset.dispatch({ action: 'name_remove', data: index })
                }
                handle={() => subset.dispatch({ action: 'update' })}
                size={{ cols: 65, rows: 1 }}
                prefix={subsetDraft.namePrefix}
            />

            <section className='addMarginBottom20' style={{ margin: '5px 0 5px 0' }}>
                <div style={{ float: 'left', marginRight: '20px', padding: '0' }}>
                    <label
                        style={{
                            display: 'block',
                            fontSize: '16px',
                            fontFamily: 'Roboto'
                        }}
                        htmlFor='from_date'>
                        {t('Valid from')}:{' '}
                    </label>
                    <input
                        type='date'
                        id='from_date'
                        style={{ display: 'block' }}
                        value={ subset.draft.validFrom?.toISOString().substr(0, 10)}
                        onChange={e => { subset.dispatch({
                                action: 'from',
                                data: new Date(e.target.value)
                            });
                        }}
                        className='datepicker'
                    />
                </div>

                <div style={{ float: 'left' }}>
                    <label htmlFor='to_date'
                        style={{
                            display: 'block',
                            fontSize: '16px',
                            fontFamily: 'Roboto'
                        }}>
                        {t('Valid to')}:{' '}
                    </label>
                    <input
                        type='date'
                        id='to_date'
                        style={{ display: 'block' }}
                        value={subset.draft.validUntil?.toISOString().substr(0, 10)}
                        onChange={e => {subset.dispatch({
                                action: 'to',
                                data: new Date(e.target.value)});
                        }}
                        className='datepicker'
                    />
                </div>
                <br style={{clear: 'both'}}/>
            </section>

            <section className='addMarginBottom20'>
                {ssbsections && (
                    <Dropdown
                        className='addMarginBottom20'
                        placeholder={t('Select a responsible department...')}
                        header={t('Owner')}
                        items={ ssbsections
                                ? parseDataForDropDowns(ssbsections._embedded.ssbSections)
                                : [{}] }
                        onSelect={item =>
                            subset.dispatch({
                                action: 'createdBy',
                                data: item.title
                            })
                        }
                    />
                )}
                {/* TODO: set automatically when logged inn */}

                {/* TODO: subject is stored in an array, it could be treated as tags ? */}
                {classificationfamilies && (
                    <Dropdown
                        placeholder={t('Select a classification family...')}
                        header={ t('Subject') }
                        items={ classificationfamilies
                                ? parseDataForDropDowns(classificationfamilies._embedded.classificationFamilies)
                                : [{}]}
                        onSelect={item => subset.dispatch({
                                action: 'subject',
                                data: item.title})}
                    />
                )}
            </section>
            {/* FIXME: limit text size*/}
            <TextLanguageFieldset
                title={t('Description')}
                items={subset.draft.description}
                add={() => subset.dispatch({ action: 'description_add' })}
                remove={index => subset.dispatch({
                        action: 'description_remove',
                        data: index})}
                handle={() => subset.dispatch({ action: 'update' })}
                size={{ cols: 65, rows: 4 }}
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
