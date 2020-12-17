import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import './form.css';
import keys from '../../../utils/keys';
import { Item } from './Item';

export const Table = ({ list = [], rerank, remove, update, disabled }) => {
    const { t } = useTranslation();

    const [ dropTarget, setDropTarget] = useState({});
    const [ dragTargets, setDragTargets] = useState([]);

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
                        { t('Rank') }
                    </th>
                    { !disabled && <th className='for_screen_readers'>{ t('Remove') }</th> }
                </tr>
                { list.sort((a, b) => (a.rank - b.rank -1))
                    .map((item, i) => (
                        <Item key={ item.id }
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

