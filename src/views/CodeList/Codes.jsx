import React, { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AppContext, useClassification } from 'controllers';
import { Text } from '@statisticsnorway/ssb-component-library';
import { CodeInfo, CodeList } from 'views';
import { ListTabable } from 'components';

export const Codes = ({ codes = [] }) => {
    const { t } = useTranslation();
    const { subset: { draft: {
        versionValidFrom,
        versionValidUntil,
        isPublished,
        codesMap
    }, dispatch } } = useContext(AppContext);

    // DOCME
    // FIXME: magic number 35
    const [ renderedCodes, setRenderedCodes ] = useState(codes.slice(0, Math.min(35, codes.length)));
    useEffect(() => {
        if (renderedCodes?.length < codes.length){
            setTimeout(() => setRenderedCodes(codes),0);
        }
    });

/*    const { codesWithNotes, isLoadingVersion } = useClassification(codes?.length > 0 && {
        classificationId: codes[0].classificationId,
        versionValidFrom: draft.versionValidFrom,
        versionValidUntil: draft.versionValidUntil
    });*/

    return (
            <div>
                <h3>{ t('Codes') }
                    { versionValidFrom || versionValidUntil
                        ? `: ${ t('from')} ${ versionValidFrom || '...' } ${ t('to') } ${ versionValidUntil || '...' }`
                        : `. ${ t('Period is not set') }`
                    }
                </h3>
                { !codes || codes.length === 0
                    ? <Text>{ t('No codes found for this validity period') }</Text>
                    : <div>
                        { !isPublished &&
                            <div style={{ padding: '5px' }}>
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

                        <ListTabable items={
                                        codes.map(code => ({
                                            id: `${code.classificationId}:${code.code}:${code.name}:${code.validFromInRequestedRange}`,
                                            ...code })) }
                                     placeholder={ t('No classifications in the subset draft') }
                                     component={ CodeInfo }
                        />
{/*                        { codes.map(code =>
                            <CodeInfo key={ code.code + code.name + code.validFromInRequestedRange }
                                      item={ code }
                                    notes={ codesWithNotes.find(c => c.code === code.code)?.notes }
                                      isLoadingVersion={ isLoadingVersion }
                            />)
                        }*/}
                    </div>
                }
            </div>
    );
};
