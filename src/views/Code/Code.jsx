import React from 'react';
import { useTranslation } from 'react-i18next';
import { Accordion } from '@statisticsnorway/ssb-component-library';
import { AlertButton } from 'components';

export const Code = ({ origin: {
    code,
    name,
    rank,
    shortName,
    classificationId,
    validFromInRequestedRange,
    validToInRequestedRange,
    level,
    parentCode,
    notes
}, valid = true
}) => {
    const { t } = useTranslation();

        return (
        <Accordion
            header={ <span>{`${ code || '-'} ${ name || '-'}`}<AlertButton
                title='The codes validity period does not match the version period'
                visible={ !valid } /></span> }
            subHeader={`${ rank }`}
        >
            <p><strong>{ t('Short name')} :</strong> { shortName || '-' }</p>
            <p><strong>{ t('Code') }:</strong> { code || '-' }</p>
            <p><strong>{ t('Classification') }:</strong> { classificationId || '-' } </p>
            <p><strong>{ t('URL') }:</strong> { `${ 
                process.env.REACT_APP_KLASS_API }/classifications/${classificationId}/codesAt?date=${ 
                validFromInRequestedRange }&selectCodes=${ code }`
            }</p>
            <p><strong>{ 'validFromInRequestedRange' }:</strong> { validFromInRequestedRange || '-' }</p>
            <p><strong>{ 'validToInRequestedRange' }:</strong> { validToInRequestedRange || '-' }</p>
            <p><strong>{ t('Level') }:</strong> { level }</p>
            { parentCode &&
                <p><strong>{ t('Parent code') }:</strong> { parentCode }</p>
            }
            <div><strong>{ t('Notes') }: </strong>
            {/* FIXME before production
            { !origin?.notes
                    ? '-'
                    : origin.notes.map((note, i) => (
                        <div key={i} style={{ padding: '5px 25px 10px 25px' }}>
                            <div style={{ width: '65%' }}
                                 className='ssb-paragraph'
                                // DOCME
                                // FIXME: find another way
                                 dangerouslySetInnerHTML={ {__html: replaceRef(note.note) } } />
                            <Text small>
                                { t('Note is valid for version') } «{ note.versionName }» ({ note.validFrom || '...' } - { note.validTo || '...' })</Text>
                        </div>))
            }*/}
            </div>
        </Accordion>
    );
};
