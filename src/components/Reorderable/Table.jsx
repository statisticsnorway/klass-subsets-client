import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
    Repeat,
    ChevronUp,
    ChevronDown,
    HelpCircle
} from 'react-feather';
import { Paragraph, LeadParagraph } from '@statisticsnorway/ssb-component-library';
import './form.css';
import keys from '../../utils/keys';
import { Item } from "./Item";
import {ProgressBar} from "../Navigation";

export const Table = ({ list = [], rerank, remove, update, disabled }) => {
    const { t } = useTranslation();

    const [ dropTarget, setDropTarget] = useState({});
    const [ dragTargets, setDragTargets] = useState([]);
    const [ showHelp, setShowHelp ] = useState(false);

    return (
        <div style={{ height: '600px', overflow: 'auto' }}>
            <table style={{ borderCollapse: 'collapse'}}
                   onDragEndCapture={() => setDragTargets([])}
                   onDoubleClickCapture={() => setDragTargets([])}
                   onKeyDown={ (event) => event.which === keys.ESC && setDragTargets([]) }
            >
                <tbody>
                <tr>
                    <th>{ t('Code') }</th>
                    <th style={{ textAlign: 'right' }}>{ t('Classification') }</th>
                    <th>{ t('Code name') }</th>
                    <th style={{ textAlign: 'center' }}
                        colSpan='2'>
                        { t('Rank')}
                        <button onClick={(event) => {
                            event.stopPropagation();
                            setShowHelp(prev => !prev);
                        }}>
                            <HelpCircle color='#2D6975'/>
                        </button>
                    </th>
                    { !disabled && <th className='for_screen_readers'>{ t('Remove') }</th> }
                </tr>
                { showHelp &&
                <tr>
                    <td colSpan='5'
                        style={{height: '100px', background: '#274247', color: 'white'}}>
                        { disabled
                            ? <Paragraph negative>{ t('Code rank help intro cannot') }</Paragraph>
                            : <>
                                <LeadParagraph negative>{ t('Code rank help intro') }</LeadParagraph>
                                    <ul>
                                        <li>
                                            <Paragraph negative>
                                                <strong>{t('Drag and drop')}. </strong>
                                                {t('Code rank help drag-and-drop')}
                                            </Paragraph>
                                        </li>
                                        <li>
                                            <Paragraph negative>
                                                <input className='rank' name='example'
                                                       style={{textAlign: 'left', width: '35px', padding: '7px 5px'}}
                                                       value='25' disabled/>
                                                <strong>{t('Input field')}. </strong>
                                                {t('Code rank help input')}
                                                <Repeat color='#62919A'/>
                                                {t('Code rank help input reset')}
                                            </Paragraph>
                                        </li>
                                        <li>
                                            <Paragraph negative>
                                                <span style={{display: 'inline-block', width: '20px'}}>
                                                    <ChevronUp size={16} color='#1A9D49'/>
                                                    <ChevronDown size={16} color='#1A9D49'/>
                                                </span>
                                                <strong>{t('Arrows')}. </strong>
                                                {t('Code rank help arrows')}
                                            </Paragraph>
                                        </li>
                                        <li>
                                            <Paragraph negative>
                                                <strong>{t('Keyboard')}. </strong>
                                                {t('Code rank help keyboard')}
                                            </Paragraph>
                                        </li>
                                    </ul>
                                </>
                        }
                    </td>
                </tr>
                }
                { list.sort((a, b) => (a.rank - b.rank -1))
                    .map((item, i) => (
                        <Item key={ item.urn + i }
                                       item={ item }

                                       remove={ remove }
                                       rerank={ rerank }
                                       rerankDragTargets={ (rank) => rerank(dragTargets, rank) }
                                       update={ update }

                                       onDragEnter={ target => setDropTarget(target) }
                                       onDragEnd={ () => rerank(dragTargets, dropTarget.rank) }

                                       isDragTarget={ dragTargets.find(t => t.urn === item.urn) }
                                       toggleDragTarget={ dragTarget =>
                                           setDragTargets(prevTargets => {
                                               return prevTargets.find(t => t.urn === dragTarget.urn)
                                                   ? prevTargets.filter(t => t.urn !== dragTarget.urn)
                                                   : [...prevTargets, dragTarget];
                                           })
                                       }
                                       setDragTarget={ dragTarget => setDragTargets(prev => [...prev, dragTarget]) }

                                       disabled={ disabled }
                        />
                    ))
                }
                </tbody>
            </table>
        </div>
    );
};

