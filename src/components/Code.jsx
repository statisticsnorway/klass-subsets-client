import React from 'react';
import {useTranslation} from "react-i18next";
import {Accordion, Text} from "@statisticsnorway/ssb-component-library";
import {replaceRefWithHTMLAndSanitize} from "../utils/strings";

export const Code = ({code}) => {
    const { t } = useTranslation();



    return (
        <Accordion header={code.name} subHeader={code.code || t('Code')}>
            <p><strong>{t('Short name')}:</strong> {code.shortName || '-'}</p>
            <p><strong>{t('Classification')}:</strong> {code.classification || '-'}</p>
            <p><strong>{t('Level')}:</strong> {code.level}</p>
            {code.parentCode && <p><strong>{t('Parent code')}:</strong> {code.parentCode}</p>}
            <p><strong>{t('Notes')}: </strong></p>
            {!code.notes
                ? <Text>-</Text>
                : code.notes.map(note => (
                    <div style={{padding: '5px 25px 10px 25px'}}>
                        <div style={{width: '65%'}} className='ssb-paragraph' dangerouslySetInnerHTML={ {__html: replaceRefWithHTMLAndSanitize(note.note) } } />
                        <Text small><strong>«{note.versionName}»</strong> ({t('valid')}: {note.validFrom || '...'} - {note.validTo || '...'})</Text>
                    </div>))}
        </Accordion>
    );
};