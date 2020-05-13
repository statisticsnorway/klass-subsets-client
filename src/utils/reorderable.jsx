import React, {useState, useEffect} from 'react';
import {useTranslation} from 'react-i18next';
import {Trash2, Repeat, ChevronUp, ChevronDown} from 'react-feather';
import {useCode} from '../controllers/klass-api';
import '../css/form.css';

export const Reorderable = ({list = [], rerank, remove}) => {
    const { t } = useTranslation();

    return (
        <>
            <table  style={{ borderCollapse: 'collapse'}}>
                <tbody>
                <tr>
                    <th>{t('Code')}</th>
                    <th style={{textAlign: 'right'}}>{t('Classification')}</th>
                    <th>{t('Code name')}</th>
                    <th style={{textAlign: 'center'}} colSpan='2'>{t('Rank')}</th>
                    <th>{t('Remove')}</th>
                    <th></th>
                </tr>
                {list.sort((a, b) => (a.rank - b.rank -1))
                    .map((item, i) => (
                        <ReordableItem key={item.urn+i}
                                       item={item}
                                       remove={remove}
                                       rerank={rerank}
                        />
                    ))
                }
                </tbody>
            </table>
        </>
    );
};

export const ReordableItem = ({item = {}, remove, rerank}) => {

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
            onDragOver={() => {}}
            onDragStart={() => setDragStart(true)}
            onDragEnd={() => setDragStart(false)}
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
            <td>
                    <label htmlFor='rank'
                           className='for_screen_readers'
                    >Type a desired rank number</label>
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