import React, { useState, useContext } from 'react';
import {
    AlertTriangle as Alert,
    Info,
    List as ListIcon,
    MinusSquare,
    PlusSquare,
    Trash2,
    XSquare,
    RefreshCw
} from 'react-feather';
import { useGet, URL } from '../../controllers/klass-api';
import './panel.css';
import { useTranslation } from 'react-i18next';
import { Spinner } from '../Spinner';
import keys from '../../utils/keys';
import { AppContext } from '../../controllers/context';
import { Codes } from './Codes';
import { CodelistInfo } from './CodelistInfo';

export const Classification = ({ item = {}, includible = false }) => {
    const { t } = useTranslation();
    const { subset: { draft, dispatch } } = useContext(AppContext);

    const { path, codesPath } = URL.toClassificationURL(
        item?.id,
        draft.versionValidFrom,
        draft.versionValidUntil
    );

    // TODO use fallback, loader, error
    const [ metadata, isLoadingMetadata,,, ] = useGet(path);

    // TODO use fallback, loader, error
    const [ codes, isLoadingCodes,,, ] = useGet(codesPath);

    const [ show, setShow ] = useState({ none: true } );

    return (
        <li style={{ padding: '5px', width: '600px' }}
            tabIndex='0'
            onKeyDown={ (event) => {
                switch (event.which) {
                    case keys.DOWN: {
                        event.preventDefault();
                        event.target.nextElementSibling && event.target.nextElementSibling.focus();
                        break;
                    }
                    case keys.UP: {
                        event.preventDefault();
                        event.target.previousElementSibling && event.target.previousElementSibling.focus();
                        break;
                    }
                    default: break;
                }
            }}>
            <div style={{ display: 'flex' }}>
                <div style={{ width: '400px' }}>{ item?.name || metadata?.name }</div>

                { item.error &&
                    <button onClick={() => setShow(prev => ({alert: !prev.alert}))}>
                        <Alert color='orange'/>
                    </button>
                }

                <button onClick={() =>
                    setShow(prev => ({ codes: !prev.codes }))}>
                    { isLoadingCodes
                        ? <Spinner/>
                        : <ListIcon color={ codes?.codes?.length > 0 ? '#3396D2' : '#C3DCDC' } />
                    }
                </button>

                <button onClick={() =>
                    setShow(prev => ({ info: !prev.info }))}>
                    { isLoadingMetadata
                        ? <Spinner/>
                        : <Info color={metadata ? '#2D6975' : '#C3DCDC'}/>
                    }
                </button>

                { draft.isPublished
                    ? <></>
                    : includible
                        ?
                        <button onClick={() => {
                            if (draft.hasOrigin(item.urn) || codes?.codes?.length > 0) {
                                setShow({ none: true });
                                draft.hasOrigin(item.urn)
                                    ? dispatch({
                                        action: 'codelist_exclude',
                                        data: item.urn
                                    })
                                    : dispatch({
                                        action: 'codelist_include',
                                        data: item.urn
                                    });
                            } else {
                                setShow(prev => ({ cannot: !prev.cannot }));
                            }
                        }}>
                            {!codes || codes?.codes?.length === 0
                                ? <XSquare color='#9272FC'/>
                                : draft.hasOrigin(item.urn)
                                    ? <MinusSquare color='#B6E8B8' />
                                    : <PlusSquare color='#1A9D49'/>}
                        </button>
                        :
                        <button onClick={() => {
                            setShow({ none: true });
                            dispatch({
                                action: 'codelist_exclude',
                                data: item.urn
                            });
                        }}>
                            <Trash2 color='#ED5935'/>
                        </button>
                }
            </div>

            {/*TODO: where item.error comes from?*/}
            { show.alert &&
            <div style={{ backgroundColor: 'AntiqueWhite' }}
                 className='panel'>
                <p>{ item.error }</p>
            </div> }

            { show.cannot &&
            <div style={{ backgroundColor: '#ECE6FE'}}
                 className='panel'>
                <p>{ t('Code list cannot be added to the subset due to lack of codes') }</p>
            </div>}

            { show.codes &&
                <Codes
                    codes={ codes?.codes?.map(code => ({
                    ...code,
                    classificationId: item.id,
                    validFromInRequestedRange: code.validFromInRequestedRange || draft.versionValidFrom,
                    validToInRequestedRange: code.validToInRequestedRange || draft.versionValidUntil,
                    urn: code.urn || `urn:ssb:klass-api:classifications:${item.id}:code:${code.code}:encodedName:${encodeURI(code.name)}`
            }))}/>}

            { show.info
                && <CodelistInfo id={item.id} info={metadata}/> }
        </li>
    );
};

