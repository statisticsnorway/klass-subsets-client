import React, { useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AppContext } from '../../controllers/context';
import { Paragraph, Text, Title } from '@statisticsnorway/ssb-component-library';
import { Spinner } from '../Spinner';
import { replaceRef } from '../../utils/strings';
import {
    Info,
    MessageSquare
} from 'react-feather';

export const CodeInfo = ({item, notes = [], isLoadingVersion}) => {
    const { t } = useTranslation();
    const { subset } = useContext(AppContext);
    const { draft, dispatch } = subset;

    const [ show, setShow ] = useState({ none: true } );

    return (
        <>
            <div style={{ display: 'flex' }}>
                { draft.isPublished
                    ? <div >
                        <Text style={{ margin: '5px' }}><strong>{ item.code }</strong> { item.name }</Text>
                    </div>
                    : <div className='ssb-checkbox'>
                        <input id={ item.urn }
                               className='checkbox'
                               type='checkbox' name='include'
                               checked={ draft.isChosenCode(item.urn) }
                               value={ item.code }
                               onChange={ (e) =>
                                   draft.isChosenCode(item.urn)
                                       ? dispatch({
                                           action: 'codes_exclude',
                                           data: [item]
                                       })
                                       : dispatch({
                                           action: 'codes_include',
                                           data: [item]
                                       })
                               }/>
                        <label className='checkbox-label'
                               style={{background: 'transparent'}}
                               htmlFor={item.urn}>
                            <Text><strong>{item.code}</strong> {item.name}</Text>
                        </label>
                    </div>
                }
                <button onClick={() => setShow(prev => ({ info: !prev.info }))}>
                    <Info color={'#2D6975'}/>
                </button>
                <button onClick={() => setShow(prev => ({ notes: !prev.notes }))}>
                    { isLoadingVersion
                        ? <Spinner />
                        : <MessageSquare color={ notes.length > 0 ? '#62919A' : '#C3DCDC' }/>}
                </button>
            </div>

            { show.info && <div>
                <p><strong>{ t('Short name')} :</strong> { item?.shortName || '-' }</p>
                <p><strong>{ t('Valid') }:</strong> { item.validFromInRequestedRange } - { item.validToInRequestedRange|| '...' }</p>
                <p><strong>{ t('Level') }:</strong> {item?.level}</p>
                { item?.parentCode && <p><strong>{ t('Parent code') }:</strong> { item?.parentCode }</p>}
                <p><strong>{ t('URN')}:</strong> { item.urn || '-' }</p>
                <p><strong>{ t('URL') }:</strong> { item?._links?.self?.href || '-' }</p>
            </div>
            }

            { show.notes && <div>
                { notes.length === 0
                    ? <Paragraph>{ t('No notes found.') }</Paragraph>
                    : notes.map((note, i) => (
                        <div key={i} style={{ padding: '10px 50px 20px 50px' }}>
                            <Title size={4}>{ t('Notes') }</Title>
                            <div style={{ fontSize: '14px' }}
                                 className='ssb-paragraph small'
                                // DOCME
                                // FIXME: find another way
                                 dangerouslySetInnerHTML={{ __html: replaceRef(note.note) }}
                            />
                            <Text small>
                                ({ t('Valid') }: { note.validFrom || '...'} - { note.validTo || '...' })
                            </Text>
                        </div>))
                }
            </div>
            }
        </>
    );
};
