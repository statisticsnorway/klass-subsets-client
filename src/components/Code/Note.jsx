import React from 'react';
import { replaceRef } from '../../utils';
import { useTranslation } from 'react-i18next';

export const Note = ({ item: { note, validFrom, validTo } }) => {
    const { t } = useTranslation();

    return (
        <div style={{ padding: '10px 50px 20px 50px' }}>
            <h4>{ t('Notes') }</h4>
            <p className='small'
                // DOCME
                // FIXME: find another way
                 dangerouslySetInnerHTML={{ __html: replaceRef(note) }}
            />
            <p className='small'>
                ({ t('Valid') }: { validFrom || '...'} - { validTo || '...' })
            </p>
        </div>
    );
};