import React, {useContext, useState} from 'react';
import { Panel, InfoButton, ListButton, MinusButton, PlusButton, XButton, AlertButton } from 'components';
import { CodeListInfo, Codes } from 'views';
import { useTranslation } from 'react-i18next';
import { AppContext } from 'controllers';

export const CodeList = ({ id, codes, metadata, errors }) => {
    const { t } = useTranslation();
    const [ show, setShow ] = useState({ none: true } );
    const { subset: { draft: {
        origins
    }, dispatch } } = useContext(AppContext);

    return (
        <>
            <div style={{ display: 'flex' }}>
                <p style={{ width: '85%'}}>{ metadata?.name || 'Name'}</p>

                <AlertButton
                    title={ t('Error')}
                    visible={ errors?.metadataError?.message?.length > 0
                        || errors?.codesError?.message?.length > 0}
                    clickHandler={ () => setShow(prev => ({  alert: !prev.alert }))}
                />

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

                <XButton
                    title={ t('Cannot be added') }
                    visible={ !codes || codes?.codes?.length === 0 }
                    clickHandler={ () => setShow(prev => ({ cannot: !prev.cannot })) }
                />

                <MinusButton
                    title={ t('Remove code list from version') }
                    visible={ codes && codes?.codes?.length > 0 && origins.has(id) }
                    clickHandler={ () => {
                        setShow({ none: true });
                        dispatch({
                            action: 'codelist_exclude',
                            data: id
                        });
                    }}
                />

                <PlusButton
                    title={ t('Add code lit to version') }
                    visible={ codes && codes?.codes?.length > 0 && !origins.has(id) }
                    clickHandler={ () => {
                        setShow({ none: true });
                        dispatch({
                            action: 'codelist_include',
                            data: id
                        });
                    } }
                />

            </div>

            <Panel visible={ show.alert }>
                <p>{ errors.metadataError?.message }</p>
                <p>{ errors.codesError?.message }</p>
            </Panel>

            <Panel visible={ show.cannot }>
                <p>{ t('Code list cannot be added to the subset due to lack of codes') }</p>
            </Panel>

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
                        : <CodeListInfo id={ id } info={ metadata }/>
                }
            </Panel>
        </>
    )
};
