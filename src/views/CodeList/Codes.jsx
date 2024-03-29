import React, { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AppContext } from 'controllers';
import { Text } from '@statisticsnorway/ssb-component-library';
import { CodeInfo } from 'views';
import { ListTable } from 'components';
import { toCodeIdWithValidFrom } from 'utils';

export const Codes = ({ codes = [] }) => {
    const { t } = useTranslation();
    const { subset: { draft: {
        versionValidFrom,
        versionValidUntil,
        isEditableCodes,
      codesMap
    }, dispatch } } = useContext(AppContext);

    // DOCME
    // FIXME: magic number 35
    const [ renderedCodes, setRenderedCodes ] = useState(codes.slice(0, Math.min(35, codes.length)));
    useEffect( () => {
        //Set valid<From/To>InRequestedRange on
        // console.log(codesMap, 'codesMap')
        // console.log(codes, 'codes')
        codesMap.forEach( cmc => {
            let code = codes.find(c => {
                return (c['classificationId'] === cmc['classificationId']
                  && c['code'] === cmc['code']
                  && c['name'] === cmc['name'])
            })
            if (code) {
                cmc['validFromInRequestedRange'] = code['validFromInRequestedRange']
                cmc['validToInRequestedRange'] = code['validToInRequestedRange']
            }
        })
        console.log(codesMap, 'codesMap etter')


    })
    useEffect(() => {
        if (renderedCodes?.length < codes.length){
            setTimeout(() => setRenderedCodes(codes),0);
        }
    });

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
                        { isEditableCodes() &&
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

                        <ListTable items={
                                        codes.map(code => ({
                                            id: toCodeIdWithValidFrom(code),
                                            ...code })) }
                                   placeholder={ t('No classifications in the subset draft') }
                                   component={ CodeInfo }
                        />
                    </div>
                }
            </div>
    );
};
