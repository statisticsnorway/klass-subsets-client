import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Spinner, Panel, ListTabable } from 'components';
import { Info, MessageSquare } from 'react-feather';
import { CodeCheckbox, Note } from 'views';

export const CodeInfo = ({ item, notes = [], isLoadingVersion = false }) => {
    const { t } = useTranslation();
    const [ show, setShow ] = useState({ none: true } );

    return (
        <>
            <div style={{ display: 'flex' }}>
                <CodeCheckbox item={ item } style={{ width: '95%'}}/>
                <button onClick={() => setShow(prev => ({ info: !prev.info }))}>
                    <Info color={'#2D6975'}/>
                </button>
                <button onClick={() => setShow(prev => ({ notes: !prev.notes }))}>
                    { isLoadingVersion
                        ? <Spinner />
                        : <MessageSquare color={ notes.length > 0 ? '#62919A' : '#C3DCDC' }/>}
                </button>
            </div>

            <Panel visible={ show.info }>

                <p className='small'>
                    <strong>{ t('Short name') } :</strong> { item?.shortName || '-' }
                </p>
                <p className='small'>
                    <strong>{ t('Valid') }:</strong> { item.validFromInRequestedRange } - { item.validToInRequestedRange|| '...' }
                </p>
                <p className='small'>
                    <strong>{ t('Level') }:</strong> {item?.level}
                </p>
                { item?.parentCode && <p className='small'><strong>{ t('Parent code') }:</strong> { item?.parentCode }</p>}
            </Panel>

            <Panel visible={ show.notes }>
                <ListTabable items={ notes.map((note, id) => ({ id, ...note })) }
                             placeholder={ t('No notes found') }
                             component={ Note }
                />
            </Panel>

        </>
    );
};
