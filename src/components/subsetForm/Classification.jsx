import React, { useState, useEffect, useContext } from 'react';
import {
    AlertTriangle as Alert,
    Info,
    List as ListIcon,
    MinusSquare,
    MessageSquare,
    PlusSquare,
    Trash2,
    XSquare,
    RefreshCw
} from 'react-feather';
import {Accordion, Paragraph, Text, Title} from '@statisticsnorway/ssb-component-library';
import { useGet, URN, useClassification } from '../../controllers/klass-api';
import './panel.css';
import { useTranslation } from 'react-i18next';
import { replaceRef } from '../../utils/strings';
import { Spinner } from '../Spinner';
import keys from '../../utils/keys';
import { AppContext } from '../../controllers/context';

export const Classification = ({ item = {}, includible }) => {
    const { t } = useTranslation();
    const { subset } = useContext(AppContext);
    const { draft, dispatch } = subset;

    const { id, path, codesPath } = URN.toURL(
        item?.urn,
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
                <Text>{item.error}</Text>
            </div> }

            { show.cannot &&
            <div style={{backgroundColor: '#ECE6FE'}}
                 className='panel'>
                <Text>{t('Code list cannot be added to the subset due to lack of codes')}</Text>
            </div>}

            { show.codes &&
                <Codes
                    codes={ codes?.codes?.map(code => ({
                    ...code,
                    classificationId: id,
                    validFromInRequestedRange: code.validFromInRequestedRange || draft.versionValidFrom,
                    validToInRequestedRange: code.validToInRequestedRange || draft.versionValidUntil,
                    urn: code.urn || `urn:ssb:klass-api:classifications:${id}:code:${code.code}:encodedName:${encodeURI(code.name)}`
            }))}/>}

            { show.info
                && <CodelistInfo id={id} info={metadata}/> }
        </li>
    );
};

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

export const CodeInfo = ({item, notes = [], isLoadingVersion}) => {
    const { t } = useTranslation();
    const { subset } = useContext(AppContext);
    const { draft, dispatch } = subset;

    const [ show, setShow ] = useState({ none: true } );

    return (
        <>
            <div style={{ display: 'flex' }}>
                { draft.isPublished
                    ? <div >
                        <Text style={{ margin: '5px' }}><strong>{ item.code }</strong> { item.name }</Text>
                      </div>
                    : <div className='ssb-checkbox'>
                        <input id={ item.urn }
                               className='checkbox'
                               type='checkbox' name='include'
                               checked={ draft.isChosenCode(item.urn) }
                               value={ item.code }
                               onChange={ (e) =>
                                   draft.isChosenCode(item.urn)
                                       ? dispatch({
                                           action: 'codes_exclude',
                                           data: [item]
                                       })
                                       : dispatch({
                                           action: 'codes_include',
                                           data: [item]
                                       })
                               }/>
                        <label className='checkbox-label'
                               style={{background: 'transparent'}}
                               htmlFor={item.urn}>
                            <Text><strong>{item.code}</strong> {item.name}</Text>
                        </label>
                    </div>
                }
                <button onClick={() => setShow(prev => ({ info: !prev.info }))}>
                    <Info color={'#2D6975'}/>
                </button>
                <button onClick={() => setShow(prev => ({ notes: !prev.notes }))}>
                    { isLoadingVersion
                        ? <Spinner />
                        : <MessageSquare color={ notes.length > 0 ? '#62919A' : '#C3DCDC' }/>}
                </button>
            </div>

            { show.info && <div>
                <p><strong>{ t('Short name')} :</strong> { item?.shortName || '-' }</p>
                <p><strong>{ t('Valid') }:</strong> { item.validFromInRequestedRange } - { item.validToInRequestedRange|| '...' }</p>
                <p><strong>{ t('Level') }:</strong> {item?.level}</p>
                { item?.parentCode && <p><strong>{ t('Parent code') }:</strong> { item?.parentCode }</p>}
                <p><strong>{ t('URN')}:</strong> { item.urn || '-' }</p>
                <p><strong>{ t('URL') }:</strong> { item?._links?.self?.href || '-' }</p>
             </div>
            }

            { show.notes && <div>
                { notes.length === 0
                    ? <Paragraph>{ t('No notes found.') }</Paragraph>
                    : notes.map((note, i) => (
                        <div key={i} style={{ padding: '10px 50px 20px 50px' }}>
                            <Title size={4}>{ t('Notes') }</Title>
                            <div style={{ fontSize: '14px' }}
                                 className='ssb-paragraph small'
                                // DOCME
                                // FIXME: find another way
                                 dangerouslySetInnerHTML={{ __html: replaceRef(note.note) }}
                            />
                            <Text small>
                                ({ t('Valid') }: { note.validFrom || '...'} - { note.validTo || '...' })
                            </Text>
                        </div>))
                }
            </div>
            }
        </>
    );
};

export const CodelistInfo = ({id, info}) => {
    const { t } = useTranslation();

    return (
        <div style={{ backgroundColor: '#eff4f5' }}
             className='panel'>
            <Title size={4}>{t('Code list info')}</Title>
            <Paragraph><strong>Id:</strong> {id}</Paragraph>
            <table>
                <tbody>
                <tr>
                    <th>{t('From')}</th>
                    <th>{t('To')}</th>
                    <th>{t('Version')}</th>
                </tr>
                { info.versions
                    .sort((a, b) => (a.validFrom > b.validFrom ? -1 : 0))
                    .map((version, i) => (
                    <tr key={i}>
                        <td>{ version.validFrom || '...' }</td>
                        <td>{ version.validTo || '...' }</td>
                        <td style={{ width: '65%' }}>{version.name}</td>
                    </tr>
                ))}
                </tbody>
            </table>
            <Paragraph><strong>{ t('Description') }:</strong> { info.description || '-' }</Paragraph>
        </div>
    );
};
