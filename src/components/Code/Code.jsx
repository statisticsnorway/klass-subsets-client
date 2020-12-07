import React from 'react';
import { useTranslation } from 'react-i18next';
import { Accordion, Text } from '@statisticsnorway/ssb-component-library';
import { replaceRef } from '../../utils';
import { useCode } from '../../controllers/klass-api';
import { Spinner } from '../../components';

export const Code = ({ origin }) => {
    const { t } = useTranslation();
    const { codeData, isLoadingVersion } = useCode(origin);

    return (
        <Accordion
            header={ !origin?.name && isLoadingVersion
                ? <Spinner/>
                : `${ origin?.code || codeData?.code || '-'} ${ origin?.name || codeData?.name || '-'}` }
            subHeader={`${origin.rank}`}
        >
            <p><strong>{ t('Short name')} :</strong> {origin?.shortName || codeData?.shortName || '-'}</p>
            <p><strong>{ t('Code') }:</strong> {origin?.code || '-'}</p>
            <p><strong>{ t('Classification') }:</strong> {origin?.classification || codeData?.classification || '-'}</p>
            <p><strong>{ t('URL') }:</strong> {origin?._links?.self?.href || codeData?._links?.self?.href || '-'}</p>
            <p><strong>{ 'validFromInRequestedRange' }:</strong> {origin?.validFromInRequestedRange || codeData?.validFromInRequestedRange || '-'}</p>
            <p><strong>{ 'validToInRequestedRange' }:</strong> {origin?.validToInRequestedRange || codeData?.validToInRequestedRange || '-'}</p>
            <p><strong>{ t('Level') }:</strong> {origin?.level || codeData?.level}</p>
            {(origin?.parentCode || codeData?.parentCode) &&
            <p><strong>{ t('Parent code') }:</strong> {origin?.parentCode || codeData?.parentCode}</p>}
            <div><strong>{ t('Notes') }: </strong>
            {isLoadingVersion
                ? <Spinner/>
                : !codeData?.notes
                    ? '-'
                    : codeData.notes.map((note, i) => (
                        <div key={i} style={{padding: '5px 25px 10px 25px'}}>
                            <div style={{width: '65%'}}
                                 className='ssb-paragraph'
                                // DOCME
                                // FIXME: find another way
                                 dangerouslySetInnerHTML={ {__html: replaceRef(note.note) } } />
                            <Text small>
                                { t('Note is valid for version') } «{note.versionName}» ({note.validFrom || '...'} - {note.validTo || '...'})</Text>
                        </div>))
            }</div>
        </Accordion>
    );
};
