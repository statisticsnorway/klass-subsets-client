import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Panel, InfoButton} from 'components';
import { CodeCheckbox, } from 'views';

export const CodeInfo = ({ item }) => {
    const { t } = useTranslation();
    const [ show, setShow ] = useState({ none: true } );

    return (
        <>
            <div style={{ display: 'flex' }}>
                <CodeCheckbox item={ item } style={{ width: '95%'}}/>
                <InfoButton clickHandler={ () => setShow(prev => ({ info: !prev.info })) }/>
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
                { item?.parentCode &&
                    <p className='small'><strong>{ t('Parent code') }:</strong> { item?.parentCode }
                    </p>}
                { item?.rank &&
                    <p className='small'><strong>{ t('Rank') }:</strong> { item?.rank }
                    </p>}
            </Panel>
        </>
    );
};
