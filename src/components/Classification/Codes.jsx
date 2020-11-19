import React, { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AppContext } from '../../controllers/context';
import { useClassification } from '../../controllers/klass-api';
import { Text } from '@statisticsnorway/ssb-component-library';
import { CodeInfo } from '../Code';

export const Codes = ({ codes = [] }) => {
    const { t } = useTranslation();
    const { subset } = useContext(AppContext);
    const { draft, dispatch } = subset;

    // DOCME
    // FIXME: magic number 35
    const [ renderedCodes, setRenderedCodes ] = useState(codes.slice(0, Math.min(35, codes.length)));
    useEffect(() => {
        if (renderedCodes?.length < codes.length){
            setTimeout(() => setRenderedCodes(codes),0);
        }
    });

    const { codesWithNotes, isLoadingVersion } = useClassification(codes?.length > 0 && {
        classificationId: codes[0].classificationId,
        versionValidFrom: draft.versionValidFrom,
        versionValidUntil: draft.versionValidUntil
    });

    return (
        <div style={{ backgroundColor: 'AliceBlue' }}
             className='panel'>
            <div className='ssb-checkbox-group'>
                <div className='checkbox-group-header'>{ t('Codes') }
                    { draft.versionValidFrom || draft.versionValidUntil
                        ? `: ${ t('from')} ${ draft.versionValidFrom || '...' } ${ t('to') } ${ draft.versionValidUntil || '...' }`
                        : `. ${ t('Period is not set') }`
                    }</div>
                { !codes || codes.length === 0
                    ? <Text>{ t('No codes found for this validity period') }</Text>
                    : <>{ !draft.isPublished &&
                    <div style={{padding: '5px'}}>
                        <button onClick={() => dispatch({
                            action: 'codes_include',
                            data: codes
                        })}
                        >{ t('All') }
                        </button>
                        <button onClick={ () => dispatch({
                            action: 'codes_exclude',
                            data: codes
                        })}
                        >{ t('None') }
                        </button>
                    </div>
                    }

                        { codes.map(code =>
                            <CodeInfo key={ code.urn + code.name + code.validFromInRequestedRange }
                                      item={ code }
                                      notes={ codesWithNotes.find(c => c.code === code.code)?.notes }
                                      isLoadingVersion={ isLoadingVersion }
                            />)
                        }
                    </>
                }
            </div>
        </div>
    );
};
