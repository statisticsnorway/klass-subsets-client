import React from 'react';
import {useTranslation} from 'react-i18next';
import {Accordion, Text} from '@statisticsnorway/ssb-component-library';
import {replaceRefWithHTMLAndSanitize} from '../utils/strings';
import {useCode} from '../controllers/klass-api';

export const Code = ({origin}) => {
    const { t } = useTranslation();
    const code = useCode(origin);

    return (
        <Accordion header={`${code.code || '-'} ${code.name || '-'}`} subHeader={`${code.rank}`}>
            <p><strong>{t('Short name')}:</strong> {code.shortName || '-'}</p>
            <p><strong>{t('Classification')}:</strong> {code.classification || '-'}</p>
            <p><strong>{t('URL')}:</strong> {code._links?.self?.href || '-'}</p>
            <p><strong>{t('URN')}:</strong> {code.urn || '-'}</p>
            <p><strong>{t('Level')}:</strong> {code.level}</p>
            <p><strong>{'validFromInRequestedRange'}:</strong> {code.validFromInRequestedRange || '-'}</p>
            <p><strong>{'validToInRequestedRange'}:</strong> {code.validToInRequestedRange || '-'}</p>
            {code.parentCode && <p><strong>{t('Parent code')}:</strong> {code.parentCode}</p>}
            <p><strong>{t('Notes')}: </strong></p>
            {!code.notes
                ? <Text>-</Text>
                : code.notes.map((note, i) => (
                    <div key={i} style={{padding: '5px 25px 10px 25px'}}>
                        <div className='ssb-paragraph' dangerouslySetInnerHTML={ {__html: replaceRefWithHTMLAndSanitize(note.note) } } />
                        <Text small><strong>«{note.versionName}»</strong> ({t('valid')}: {note.validFrom || '...'} - {note.validTo || '...'})</Text>
                    </div>))}
        </Accordion>
    );
};