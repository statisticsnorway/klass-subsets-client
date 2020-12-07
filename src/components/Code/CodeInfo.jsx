import React, { useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Spinner } from '../Spinner';
import { replaceRef } from '../../utils';
import {
    Info,
    MessageSquare
} from 'react-feather';
import {CodeCheckbox} from "./CodeCheckbox";

export const CodeInfo = ({ item, notes = [], isLoadingVersion = false }) => {
    const { t } = useTranslation();

    const [ show, setShow ] = useState({ none: true } );

    return (
        <>
            <div style={{ display: 'flex' }}>

                <CodeCheckbox item={ item } />

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
                <p className='small'><strong>{ t('Short name')} :</strong> { item?.shortName || '-' }</p>
                <p className='small'><strong>{ t('Valid') }:</strong> { item.validFromInRequestedRange } - { item.validToInRequestedRange|| '...' }</p>
                <p className='small'><strong>{ t('Level') }:</strong> {item?.level}</p>
                { item?.parentCode && <p className='small'><strong>{ t('Parent code') }:</strong> { item?.parentCode }</p>}
            </div>
            }

            { show.notes && <div>
                { notes.length === 0
                    ? <p>{ t('No notes found.') }</p>
                    : notes.map((note, i) => (
                        <div key={i} style={{ padding: '10px 50px 20px 50px' }}>
                            <h4>{ t('Notes') }</h4>
                            <div style={{ fontSize: '14px' }}
                                 className='ssb-paragraph small'
                                // DOCME
                                // FIXME: find another way
                                 dangerouslySetInnerHTML={{ __html: replaceRef(note.note) }}
                            />
                            <p className='small'>
                                ({ t('Valid') }: { note.validFrom || '...'} - { note.validTo || '...' })
                            </p>
                        </div>))
                }
            </div>
            }
        </>
    );
};
