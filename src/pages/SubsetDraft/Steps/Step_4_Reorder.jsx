import React, { useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Table as Reorderable } from '../../../components/Lists';
import { BriefContextual } from '../../../components/Subset';
import { AppContext } from '../../../controllers/context';
import { Help, HelpButton } from '../../../components';
import {
    Repeat,
    ChevronUp,
    ChevronDown
} from 'react-feather';

export const Step4Reorder = () => {
    const { subset: { draft, dispatch } } = useContext(AppContext);
    const { t } = useTranslation();
    const [ showHelp, setShowHelp ] = useState(false);

    return (<>
        <h2>{ t('Reorder codes') }
            <HelpButton clickHandler={ (event) => {
                event.stopPropagation();
                setShowHelp(prev => !prev);
            } } />
        </h2>

        <BriefContextual metadata currentVersion />

        <Help visible={ showHelp }>
            { draft.isPublished
                ? <p>{ t('Code rank help intro cannot') }</p>
                : <>
                    <p><strong>{ t('Code rank help intro') }</strong></p>
                    <ul>
                        <li><p>
                            <strong>{ t('Drag and drop') }. </strong>
                            { t('Code rank help drag-and-drop') }
                        </p>
                        </li>
                        <li>
                            <p>
                                <input className='rank' name='example'
                                       style={{textAlign: 'left', width: '35px', padding: '7px 5px'}}
                                       value='25' disabled />
                                <strong>{t('Input field')}. </strong>
                                { t('Code rank help input') }
                                <Repeat color='#62919A'/>
                                { t('Code rank help input reset') }
                            </p>
                        </li>
                        <li>
                            <p>
                                    <span style={{display: 'inline-block', width: '20px'}}>
                                        <ChevronUp size={16} color='#1A9D49'/>
                                        <ChevronDown size={16} color='#1A9D49'/>
                                    </span>
                                <strong>{t('Arrows')}. </strong>
                                {t('Code rank help arrows')}
                            </p>
                        </li>
                        <li>
                            <p>
                                <strong>{t('Keyboard')}. </strong>
                                {t('Code rank help keyboard')}
                            </p>
                        </li>
                    </ul>
                </>
            }
        </Help>

        { draft.codes?.length === 0
            ? <p>{ t('No items to sort') }</p>
            : <Reorderable list={draft.codes}
                           rerank={ (codes, rank) => dispatch({
                               action: 'codes_rerank',
                               data: {codes, rank}})
                           }
                           remove={ codes => dispatch({
                               action: 'codes_exclude',
                               data: codes})
                           }
                           update={ code => dispatch({
                               action: 'codes_cache',
                               data: code})
                           }
                           disabled={ draft.administrativeStatus === 'OPEN' }
            />
        }
     </>);
};

