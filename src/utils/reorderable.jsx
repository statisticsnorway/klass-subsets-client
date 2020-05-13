import React, {useState, useEffect} from 'react';
import {useTranslation} from 'react-i18next';
import {Trash2, Repeat, ChevronUp, ChevronDown} from 'react-feather';
import {useCode} from "../controllers/klass-api";

export const Reorderable = ({list = [], rerank, remove}) => {
    const { t } = useTranslation();

    return (
        <>
            <table>
                <tbody>
                <tr>
                    <th>{t('Code')}</th>
                    <th style={{textAlign: 'right'}}>{t('Classification')}</th>
                    <th>{t('Code name')}</th>
                    <th>{t('Rank')}</th>
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
    const codeData = useCode(item.name ? null : item);

    useEffect(() => console.log({codeData}), [codeData]);

    const keys = {
        ENTER: 13,
        SPACE: 32
    };
    return(
        <tr>
            <td>{codeData.code || item.code || '-'}</td>
            <td style={{textAlign: 'right'}}>{codeData.classificationId || item.classificationId}</td>
            <td style={{width: '65%'}}>{codeData.name || item.name || item.urn}</td>
            <td>
                <span style={{display: 'inline-block', width: '40px'}}>

                    <button onClick={() => rerank(item, item.rank-1)}>
                        <ChevronUp color='#1A9D49'/>
                    </button>

                    <button onClick={() => rerank(item, item.rank+1)}>
                        <ChevronDown color='#1A9D49'/>
                    </button>

                </span>

                <span style={{display: 'inline-block', width: '40px'}}>
                <label htmlFor='rank'
                       className='for_screen_readers'
                >Type a desired rank number</label>
                <input type='number' id='rank' name='rank'
                       style={{textAlign: 'right', width: '35px', marginRight: '5px'}}
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
                    </span>
            </td>
            <td>
                <button onClick={() => remove([item])}>
                    <Trash2 color='#ED5935'/>
                </button>
            </td>
        </tr>
    );
};