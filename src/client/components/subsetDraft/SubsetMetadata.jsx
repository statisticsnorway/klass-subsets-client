import React, {useEffect, useContext} from 'react';
import '../../css/form.css';
import {TextLanguageFieldset} from '../../utils/forms';
import {AppContext} from '../../controllers/context';
import {subsetDraft, languages} from '../../controllers/defaults';
import { Title } from '@statisticsnorway/ssb-component-library';
import DatePicker from 'react-date-picker';

export const SubsetMetadata = ({subset}) => {

    const {ssbsections, classificationfamilies} = useContext(AppContext);

    useEffect(() => {return () => subset.dispatch({action: 'remove_empty'});}, []);

    return (
        <>
            <Title size={3}>Metadata</Title>
            <TextLanguageFieldset title='Names' items={subset.draft.names}
                                  add={() => subset.dispatch({action: 'name_add'})}
                                  remove={(index) => subset.dispatch({action: 'name_remove', data: index})}
                                  handle={() => subset.dispatch({action: 'update'})}
                                  size={{cols: 68, rows: 1}}
                                  prefix={subsetDraft.namePrefix}
            />

            <fieldset>
                <label>Owner
                    <select style={{margin: '10px'}}
                            value={subset.draft.ownerId}
                            onChange={(e) => subset.dispatch({
                                action: 'ownerId',
                                data: e.target.value })}>
                        {ssbsections
                            && subset.draft.ownerId.length > 0
                            && !ssbsections._embedded.ssbSections.find(s => s.name === subset.draft.ownerId)
                            && (<option disabled value={subset.draft.ownerId}>{subset.draft.ownerId} (outdated)</option>)
                        }
                        {ssbsections
                            && ssbsections._embedded.ssbSections
                            .map((section, i) => (<option key={i} value={section.name}>{section.name}</option>))
                        }
                    </select>
                </label>
            </fieldset>

            <fieldset>
                <label style={{display:'block'}}>Valid period</label>
                <label>From:
                    <DatePicker value={subset.draft.valid.from}
                                onChange={(date) => subset.dispatch({action: 'from', data: date})}
                                clearIcon={null}
                                format='dd.MM.y'
                                locale={languages.find(i=> i.default).IETF}
                                className='datepicker'
                    />
                </label>
                <label>To:
                    <DatePicker value={subset.draft.valid.to}
                                onChange={(date) => subset.dispatch({action: 'to', data: date})}
                                clearIcon={null}
                                format='dd.MM.y'
                                locale={languages.find(i=> i.default).IETF}
                                className='datepicker'
                    />
                </label>
            </fieldset>

            <fieldset>
                <label>Subject
                <select style={{margin: '10px'}}
                        value={subset.draft.subject}
                        onChange={(e) => subset.dispatch({
                            action: 'subject',
                            data: e.target.value })}>
                    {classificationfamilies && subset.draft.subject.length > 0
                        && !classificationfamilies._embedded.classificationFamilies
                            .find(s => s.name === subset.draft.subject)
                        && (<option disabled value={subset.draft.subject}>{subset.draft.subject} (outdated)</option>)
                    }
                    {classificationfamilies
                        && classificationfamilies._embedded.classificationFamilies
                        .map((family, i) => (<option key={i} value={family.name}>{family.name}</option>))
                    }
                </select>
                </label>
            </fieldset>

            <TextLanguageFieldset title='Description' items={subset.draft.descriptions}
                                  add={() => subset.dispatch({action: 'description_add'})}
                                  remove={(index) => subset.dispatch({action: 'description_remove', data: index})}
                                  handle={() => subset.dispatch({action: 'update'})}
                                  size = {{cols: 68, rows: 4}}/>


{/* TODO: implement in next version
            <label><input type='checkbox'/>Subscribe for changes</label>
*/}

            {/* TODO: implement in next version if ordered
            /* move to each fieldset (?)
                <Button onClick={() => {subset.dispatch({action: 'empty'});}}>Empty</Button>
            <Button onClick={() => {subset.dispatch({action: 'reset'});}}>Reset</Button>
*/}
        </>
    );
};
