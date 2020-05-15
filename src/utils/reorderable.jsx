import React, {useState, useEffect} from 'react';
import {useTranslation} from 'react-i18next';
import {Trash2, Repeat, ChevronUp, ChevronDown} from 'react-feather';
import {useCode} from '../controllers/klass-api';
import '../css/form.css';

export const Reorderable = ({list = [], rerank, remove}) => {
    const { t } = useTranslation();

    const [dropTarget, setDropTarget] = useState();
    const [dragTargets, setDragTargets] = useState([]);

    return (
        <>
            <table style={{ borderCollapse: 'collapse'}}
                   onDragEndCapture={() => setDragTargets([])}
                   onDoubleClickCapture={() => setDragTargets([])}
            >
                <tbody>
                <tr>
                    <th>{t('Code')}</th>
                    <th style={{textAlign: 'right'}}>{t('Classification')}</th>
                    <th>{t('Code name')}</th>
                    <th style={{textAlign: 'center'}} colSpan='2'>{t('Rank')}</th>
                    <th className='for_screen_readers'>{t('Remove')}</th>
                </tr>
                {list.sort((a, b) => (a.rank - b.rank -1))
                    .map((item, i) => (
                        <ReordableItem key={item.urn+i}
                                       item={item}

                                       remove={remove}
                                       rerank={rerank}

                                       onDragEnter={item => setDropTarget(item)}
                                       onDragEnd={() => rerank(dragTargets, dropTarget.rank)}

                                       isDragTarget={dragTargets.find(t => t.urn === item.urn)}
                                       toggleDragTarget={dragTarget =>
                                           setDragTargets(prevTargets => {
                                               return prevTargets.find(t => t.urn === dragTarget.urn)
                                                   ? prevTargets.filter(t => t.urn !== dragTarget.urn)
                                                   : [...prevTargets, dragTarget]
                                           })
                                       }
                                       setDragTarget={dragTarget => setDragTargets(prev => [...prev, dragTarget])}
                        />
                    ))
                }
                </tbody>
            </table>
        </>
    );
};

export const ReordableItem = ({item = {}, remove, rerank, onDragEnd, onDragEnter, toggleDragTarget, isDragTarget, setDragTarget}) => {

    const [rank, setRank] = useState(item.rank);
    const [background, setBackground] = useState('#ECFEED');

    // TODO: cache fetched data in session storage
    const codeData = useCode(item.name ? null : item);

    useEffect(() => {
        function fade() {
            setBackground('white');
        }
        setTimeout(fade, 500)}, []);

    const keys = {
        ENTER: 13,
        SPACE: 32
    };
    return(
        <tr style={{background: isDragTarget ? '#B6E8B8' : background}}

            onMouseOver={() => setBackground('#ECFEED')}
            onMouseOut={() => setBackground('white')}

            draggable={true}

            onDragStart={() => setDragTarget(item)}

            onDragEnd={(e) => {
                onDragEnd(item);
            }}

            onDragEnter={(event) => {
                event.currentTarget.style.backgroundColor = '#ECFEED';
                onDragEnter(item);
            }}

            onDragLeave={(event) =>
                event.currentTarget.style.backgroundColor = 'white'
            }

            onClick={() => toggleDragTarget(item)}
        >
            <td>{codeData.code || item.code || '-'}</td>
            <td style={{textAlign: 'right'}}>{codeData.classificationId || item.classificationId}</td>
            <td style={{width: '65%'}}>{codeData.name || item.name || item.urn}</td>
            <td>
                <span style={{display: 'inline-block', width: '40px'}}>

                    <button onClick={(event) => {
                        event.stopPropagation();
                        rerank([item], item.rank - 1);
                    }}>
                        <ChevronUp size={16} color='#1A9D49'/>
                    </button>

                    <button onClick={(event) => {
                        event.stopPropagation();
                        rerank([item], item.rank + 1);
                    }}>
                        <ChevronDown size={16} color='#1A9D49'/>
                    </button>

                </span>
            </td>
            <td style={{width: '10%'}}>
                <label htmlFor='rank'
                       className='for_screen_readers'
                >Type a desired rank number
                </label>
                <input type='number' className='rank' name='rank'
                       style={{textAlign: 'left', width: '35px', padding: '7px 5px'}}
                       value={rank}
                       onChange={(e) => setRank(e.target.value)}
                       onKeyDown={(e) => {
                           if (e.which === keys.ENTER || e.which === keys.SPACE) {
                               e.preventDefault();
                               if (!rank || rank === '-') {
                                   setRank(item.rank);
                               } else {
                                   rerank([item], rank);
                               }
                           }
                       }}
                       onBlur={() => {
                           if (!rank || rank === '-') {
                               setRank(item.rank);
                           } else {
                               rerank([item], rank);
                           }
                       }}
                />

                <button onClick={(event) => {
                    event.stopPropagation();
                    if (!rank || rank === '-') {
                        setRank(item.rank);
                    } else {
                        rerank([item], rank);
                    }
                }}>
                    <Repeat color={item.rank === rank ? '#F0F8F9' : '#62919A'}/>
                </button>
            </td>
            <td>
                <button onClick={() => remove([item])}>
                    <Trash2 color='#ED5935'/>
                </button>
            </td>
        </tr>
    );
};
