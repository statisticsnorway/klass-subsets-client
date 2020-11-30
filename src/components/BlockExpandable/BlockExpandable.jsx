import React from 'react';
import { useTranslation } from 'react-i18next';
import './block-expandable.css';

export const BlockExpandable = ({ label, text, color }) => {
    const { t } = useTranslation();
console.log({text})
    return (
        <div className='grow' >
            <span className='label'>{ t( label ) }:</span>
            <span className='text'>{ t( text ) }</span>
        </div>
    );
}