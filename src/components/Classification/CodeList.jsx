import React, { useState} from 'react';
import { Panel } from '../../components';
import { CodelistInfo } from './CodelistInfo';
import { InfoButton, ListButton } from '../Buttons';
import { useTranslation } from 'react-i18next';
import { Codes } from './Codes';

export const CodeList = ({ id, codes, metadata, includible = false, ...props }) => {
    const { t } = useTranslation();
    const [ show, setShow ] = useState({ none: true } );

    console.log({props})

    return (
        <>
            <div style={{ display: 'flex' }}>
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
                    codes?.isLoading
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
                    metadata?.isLoading
                        ? <p>Loading...</p>
                        : <CodelistInfo id={ id } info={ metadata }/>
                }
            </Panel>
        </>
    )
};
