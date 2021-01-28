import React, { useState, useEffect } from 'react';
import keys from 'utils/keys';
import {
    Trash2,
    Repeat,
    ChevronUp,
    ChevronDown
} from 'react-feather';

export const Item = ({item = {}, remove,
                                  rerank, rerankDragTargets,
                                  onDragEnd, onDragEnter,
                                  toggleDragTarget, isDragTarget,
                                  setDragTarget, disabled}) =>
{

    const [ rank, setRank ] = useState(item?.rank);
    const [ background, setBackground ] = useState('#ECFEED');

    // TODO: cache fetched data in session storage

    useEffect(() => {
            function fade() { setBackground('white'); }
            setTimeout(fade, 500);
        }, []
    );

    return (
        <tr style={{ background: isDragTarget ? '#B6E8B8' : background }}
            onMouseOver={() => setBackground('#ECFEED')}
            onMouseOut={() => setBackground('white')}

            tabIndex='0'

            onKeyDown={(event) => {
                switch (event.which) {
                    case keys.SPACE: {
                        event.preventDefault();
                        toggleDragTarget(item);
                        break;
                    }
                    case keys.DOWN: {
                        event.preventDefault();
                        event.target.nextElementSibling && event.target.nextElementSibling.focus();
                        event.ctrlKey && rerankDragTargets(item?.rank + 1);
                        break;
                    }
                    case keys.UP: {
                        event.preventDefault();
                        event.target.previousElementSibling && event.target.previousElementSibling.focus();
                        event.ctrlKey && rerankDragTargets(item?.rank - 1);
                        break;
                    }
                    default: break;
                }

            }}

            draggable={!disabled}

            onDragStart={() => setDragTarget(item)}
            onDragEnd={() => onDragEnd()}

            onDragEnter={(event) => {
                event.currentTarget.style.backgroundColor = '#ECFEED';
                onDragEnter(item);
            }}

            onDragLeave={(event) =>
                event.currentTarget.style.backgroundColor = 'white'
            }
        >
            <td>{ item?.code || '-' }</td>
            <td style={{ textAlign: 'right' }}>{ item?.classificationId }</td>
            <td style={{ width: '65%'}} onClick={() => toggleDragTarget(item)}>{ item?.name }</td>
            { !disabled &&
            <td>
                         <span style={{display: 'inline-block', width: '40px'}}>

                            <button onClick={ (event) => {
                                event.stopPropagation();
                                rerank([item], item?.rank - 1);
                            }}>
                                <ChevronUp size={16} color='#1A9D49'/>
                            </button>

                            <button onClick={(event) => {
                                event.stopPropagation();
                                rerank([item], item?.rank + 1);
                            }}>
                                <ChevronDown size={16} color='#1A9D49'/>
                            </button>

                        </span>
            </td>
            }
            { disabled
                ? <td style={{ textAlign: 'right' }}>{rank}</td>
                : <td style={{ width: '10%' }}>
                    <label htmlFor='rank'
                           className='for_screen_readers'
                    >Type a desired rank number
                    </label>
                    <input type='number' className='rank' id='rank' name='rank'
                           style={{ textAlign: 'left', width: '35px', padding: '7px 5px' }}
                           value={ rank }
                           onChange={(event) => setRank(event.target.value)}
                           onKeyDown={(event) => {
                               event.stopPropagation();
                               if (event.which === keys.ENTER || event.which === keys.SPACE) {
                                   event.preventDefault();
                                   if (!rank || rank === '-') {
                                       setRank(item?.rank);
                                   } else {
                                       rerank([item], rank);
                                   }
                               }
                               if (event.which === keys.ESC && rank !== item?.rank) {
                                   event.preventDefault();
                                   setRank(item?.rank);
                               }
                           }}
                    />

                    <button onClick={(event) => {
                        event.stopPropagation();
                        if (rank !== item?.rank) {
                            if (!rank || rank === '-') {
                                setRank(item?.rank);
                            } else {
                                rerank([item], rank);
                            }
                        }
                    }
                    }>
                        <Repeat color={ (!rank || rank === '-' || item?.rank === rank) ? '#F0F8F9' : '#62919A' }/>
                    </button>
                </td>
            }
            { !disabled &&
            <td>
                <button onClick={() => remove([item])}>
                    <Trash2 color='#ED5935'/>
                </button>
            </td>
            }
        </tr>
    );
};