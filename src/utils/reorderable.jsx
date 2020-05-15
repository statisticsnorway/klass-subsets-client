import React, {useState, useEffect} from 'react';
import {useTranslation} from 'react-i18next';
import {Trash2, Repeat, ChevronUp, ChevronDown} from 'react-feather';
import {useCode} from '../controllers/klass-api';
import '../css/form.css';

export const Reorderable = ({list = [], rerank, remove}) => {
    const { t } = useTranslation();

    const [dropTarget, setDropTarget] = useState();
    const [dragTargets, setDragTargets] = useState([]);

    useEffect(() => console.log({dragTargets}), [dragTargets]);

    return (
        <>
            <table style={{ borderCollapse: 'collapse'}}
                   //onDragCapture={() => console.log('draG capture')}
                   //onDragEndCapture={(e) => console.log('drag END capture', e.target)}
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
                                       onDragEnter={(item) => setDropTarget(item)}
                                       onDragEnd={() => rerank(dragTargets, dropTarget.rank)}
                                       toggleDragTarget={(item) => {
                                           setDragTargets(prevTargets => {
                                               return prevTargets.find(t => t.urn === item.urn)
                                                   ? prevTargets.filter(t => t.urn !== item.urn)
                                                   : [...prevTargets, item]
                                           })
                                       }}
                                       isTarget={dragTargets.find(t => t.urn === item.urn)}
                        />
                    ))
                }
                </tbody>
            </table>
        </>
    );
};

export const ReordableItem = ({item = {}, remove, rerank, onDragEnd, onDragEnter, toggleDragTarget, isTarget}) => {

    const [rank, setRank] = useState(item.rank);
    const [background, setBackground] = useState('#ECFEED');
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
        <tr style={{background: isTarget ? 'lightgray' : background}}

/*            onMouseOver={() => setBackground('#ECFEED')}
            onMouseOut={() => setBackground('white')}
            */

            draggable={true}

            onDragEnd={(e) => {
                onDragEnd(item);
            }}

            onDragEnter={() => {
                onDragEnter(item);
            }}

            onClick={() => toggleDragTarget(item)}
        >
            <td>{codeData.code || item.code || '-'}</td>
            <td style={{textAlign: 'right'}}>{codeData.classificationId || item.classificationId}</td>
            <td style={{width: '65%'}}>{codeData.name || item.name || item.urn}</td>
            <td>
                <span style={{display: 'inline-block', width: '40px'}}>

                    <button onClick={() => rerank([item], item.rank-1)}>
                        <ChevronUp size={16} color='#1A9D49'/>
                    </button>

                    <button onClick={() => rerank([item], item.rank+1)}>
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

                <button onClick={() => {
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
export const ReordableItem2 = ({item = {}, remove, rerank, exchangeRank, onDragEnter}) => {

    const [rank, setRank] = useState(item.rank);
    const [background, setBackground] = useState('#ECFEED');
    const [dragStart, setDragStart] = useState(false);
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
        <tr
            style={{background: dragStart ? '#B6E8B8' : background}}

            onMouseOver={() => setBackground('#ECFEED')}
            onMouseOut={() => setBackground('white')}

            draggable={true}

            onDragStart={(e) => {
                setDragStart(true);
                console.log('drag START ---n---', item.code, item.rank)
            }}
            onDragEnd={() => {
                setDragStart(false);
                console.log('drag END ---v---', item.code, item.rank)
            }}
            onDrag={(e) => {
                setBackground('cyan')
                exchangeRank(item);
                console.log('dragging meeeeeee', item.code, item.rank)
            }}

            onDragEnter={() => {
                onDragEnter(item);
                setBackground('pink');
                console.log('ENTER me', item.code, item.rank)
            }}
            onDragLeave={() => {
                setBackground('white');
                console.log('L E A v E me', item.code, item.rank)
            }}
            onDragOver={(e) => {
                e.preventDefault();
                setBackground('orange');
                console.log('over me', item.code, item.rank)
            }}
            onDrop={(e) => {
                e.preventDefault();
                setBackground('blue');
                console.log('dropped on me', item.code, item.rank)
            }}

            onClick={() => setDragStart((prev) => (!prev))}
        >

            <td>{codeData.code || item.code || '-'}</td>
            <td style={{textAlign: 'right'}}>{codeData.classificationId || item.classificationId}</td>
            <td style={{width: '65%'}}>{codeData.name || item.name || item.urn}</td>
            <td>
                <span style={{display: 'inline-block', width: '40px'}}>

                    <button onClick={() => rerank(item, item.rank-1)}>
                        <ChevronUp size={16} color='#1A9D49'/>
                    </button>

                    <button onClick={() => rerank(item, item.rank+1)}>
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
                                   rerank(item, rank);
                               }
                           }}
                           onBlur={() => rerank(item, rank)}
                    />

                    <button onClick={() => rerank(item, rank)}>
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