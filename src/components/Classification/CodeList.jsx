import React, {useContext, useState} from 'react';
import { URL, useGet } from '../../controllers/klass-api';
import { Panel } from './Panel';
import { CodelistInfo } from './CodelistInfo';
import { InfoButton, ListButton } from '../Buttons';
import { useTranslation } from 'react-i18next';
import { AppContext } from '../../controllers/context';
import { Codes } from './Codes';

export const CodeList = ({ item: { id } }) => {
    const { t } = useTranslation();
    const { subset: { draft: {
        versionValidFrom,
        versionValidUntil
    }, dispatch }
    } = useContext(AppContext);

    const { path, codesPath } = URL.toClassificationURL(
        id,
        versionValidFrom,
        versionValidUntil
    );
    const [ metadata, isLoadingMetadata,,, ] = useGet(path);
    const [ codes, isLoadingCodes,,, ] = useGet(codesPath);
    const [ show, setShow ] = useState({ none: true } );

    return (
        <>
            <div style={{ display: 'flex', padding: '15px' }}>
                <p>{ metadata?.name }</p>

                <ListButton
                    title={ t('Codes') }
                    active={ codes?.codes?.length > 0 }
                    clickHandler={ () => setShow(prev => ({  codes: !prev.codes })) }
                />

                <InfoButton
                    title={ t('Code list info') }
                    active={ metadata }
                    clickHandler={ () => setShow(prev => ({ info: !prev.info })) }
                />

            </div>

            <Panel visible={ show.codes }>
                {
                    isLoadingCodes
                        ? <p>Loading...</p>
                        : <Codes codes={ codes?.codes?.map(code => ({
                                ...code,
                                classificationId: id,
                            }))}
                        />
                }
            </Panel>

            <Panel visible={ show.info }>
                {
                    isLoadingMetadata
                        ? <p>Loading...</p>
                        : <CodelistInfo id={ id } info={ metadata }/>
                }
            </Panel>
        </>
    )
};
