import React from 'react';
import {useTranslation} from 'react-i18next';
import {Accordion, Text} from '@statisticsnorway/ssb-component-library';
import {replaceRef} from '../utils/strings';
import {useCode, URN} from '../controllers/klass-api';
import Spinner from './Spinner';

export const Code = ({origin}) => {
    const { t } = useTranslation();
    const {codeData, isLoadingVersion} = useCode(origin);

    return (
        <Accordion header={isLoadingVersion ? <Spinner/> : `${codeData?.code || URN.toURL(origin).code || '-'} ${codeData?.name || '-'}`} subHeader={origin.rank}>
            <p><strong>{t('Short name')}:</strong> {codeData?.shortName || '-'}</p>
            <p><strong>{t('Classification')}:</strong> {codeData?.classification || '-'}</p>
            <p><strong>{t('URL')}:</strong> {codeData?._links?.self?.href || '-'}</p>
            <p><strong>{t('URN')}:</strong> {origin.urn || '-'}</p>
            <p><strong>{'validFromInRequestedRange'}:</strong> {codeData?.validFromInRequestedRange || '-'}</p>
            <p><strong>{'validToInRequestedRange'}:</strong> {codeData?.validToInRequestedRange || '-'}</p>
            <p><strong>{t('Level')}:</strong> {codeData?.level}</p>
            {codeData?.parentCode && <p><strong>{t('Parent code')}:</strong> {codeData?.parentCode}</p>}
            <p><strong>{t('Notes')}: </strong></p>
            {!codeData?.notes
                ? '-'
                : codeData.notes.map((note, i) => (
                    <div key={i} style={{padding: '5px 25px 10px 25px'}}>
                        <div style={{width: '65%'}}
                             className='ssb-paragraph'
                            // DOCME
                            // FIXME: find another way
                             dangerouslySetInnerHTML={ {__html: replaceRef(note.note) } } />
                        <Text small><strong>«{note.versionName}»</strong> ({t('valid')}: {note.validFrom || '...'} - {note.validTo || '...'})</Text>
                    </div>))}
        </Accordion>
    );
};