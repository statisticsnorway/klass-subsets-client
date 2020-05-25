import React, {useState, useEffect} from 'react';
import {useTranslation} from 'react-i18next';
import {Trash2, Repeat, ChevronUp, ChevronDown, HelpCircle} from 'react-feather';
import {Paragraph, LeadParagraph} from '@statisticsnorway/ssb-component-library';
import {useCode} from '../../controllers/klass-api';
import '../../css/form.css';
import keys from '../../utils/keys';

export const Reorderable = ({list = [], rerank, remove, update}) => {
    const { t } = useTranslation();

    const [dropTarget, setDropTarget] = useState({});
    const [dragTargets, setDragTargets] = useState([]);
    const [showHelp, setShowHelp] = useState(false);

    return (
        <>
            <table style={{ borderCollapse: 'collapse'}}
                   onDragEndCapture={() => setDragTargets([])}
                   onDoubleClickCapture={() => setDragTargets([])}
                   onKeyDown={(event) => event.which === keys.ESC && setDragTargets([])}
            >
                <tbody>
                <tr>
                    <th>{t('Code')}</th>
                    <th style={{textAlign: 'right'}}>{t('Classification')}</th>
                    <th>{t('Code name')}</th>
                    <th style={{textAlign: 'center'}}
                        colSpan='2'>
                        {t('Rank')}
                        <button onClick={(event) => {
                            event.stopPropagation();
                            setShowHelp(prev => !prev);
                        }}>
                            <HelpCircle color='#2D6975'/>
                        </button>
                    </th>
                    <th className='for_screen_readers'>{t('Remove')}</th>
                </tr>
                {showHelp &&
                <tr>
                    <td colSpan='5'
                        style={{height: '100px', background: '#274247', color: 'white'}}>
                        <LeadParagraph negative>{t('Code rank help intro')}</LeadParagraph>
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
                                           value='25' disabled />
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
                    </td>
                </tr>}
                {list.sort((a, b) => (a.rank - b.rank -1))
                    .map((item, i) => (
                        <ReordableItem key={item.urn + i}
                                       item={item}

                                       remove={remove}
                                       rerank={rerank}
                                       rerankDragTargets={(rank) => rerank(dragTargets, rank)}
                                       update={update}

                                       onDragEnter={target => setDropTarget(target)}
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

export const ReordableItem = ({item = {}, remove, update,
                               rerank, rerankDragTargets,
                               onDragEnd, onDragEnter,
                               toggleDragTarget, isDragTarget,
                               setDragTarget}) =>
{

    const [rank, setRank] = useState(item.rank);
    const [background, setBackground] = useState('#ECFEED');

    // TODO: cache fetched data in session storage
    const codeData = useCode(item.name ? null : item);

    useEffect(() => {
        function fade() {
            setBackground('white');
        }
        setTimeout(fade, 500)}, []);

    useEffect(() => codeData && update(codeData), [codeData]);

    return(
        <tr style={{background: isDragTarget ? '#B6E8B8' : background}}
            onMouseOver={() => setBackground('#ECFEED')}
            onMouseOut={() => setBackground('white')}

            tabIndex='0'

            onKeyDown={(event) => {
                switch (event.which) {
                    case keys.SPACE: {
                        event.preventDefault();
                        toggleDragTarget(item)
                        break;
                    }
                    case keys.DOWN: {
                        event.preventDefault();
                        event.ctrlKey
                            ? rerankDragTargets(item.rank + 1)
                            : event.target.nextElementSibling && event.target.nextElementSibling.focus();
                        break;
                    }
                    case keys.UP: {
                        event.preventDefault();
                        event.ctrlKey
                            ? rerankDragTargets(item.rank - 1)
                            : event.target.previousElementSibling && event.target.previousElementSibling.focus();
                        break;
                    }
                    default: break;
                }

            }}

            draggable={true}

            onDragStart={() => setDragTarget(item)}
            onDragEnd={() =>onDragEnd()}

            onDragEnter={(event) => {
                event.currentTarget.style.backgroundColor = '#ECFEED';
                onDragEnter(item);
            }}

            onDragLeave={(event) =>
                event.currentTarget.style.backgroundColor = 'white'
            }
        >
            <td>{codeData.code || item.code || '-'}</td>
            <td style={{textAlign: 'right'}}>{codeData.classificationId || item.classificationId}</td>
            <td style={{width: '65%'}}
                onClick={() => toggleDragTarget(item)}>
                {codeData.name || item.name || item.urn}
            </td>
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
                       onChange={(event) => setRank(event.target.value)}
                       onKeyDown={(event) => {
                           event.stopPropagation();
                           if (event.which === keys.ENTER || event.which === keys.SPACE) {
                               event.preventDefault();
                               if (!rank || rank === '-') {
                                   setRank(item.rank);
                               } else {
                                   rerank([item], rank);
                               }
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
