import React, {useState, useEffect} from 'react';
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
import {Paragraph, Text, Title} from '@statisticsnorway/ssb-component-library';
import {useGet, URN, useClassification} from '../../controllers/klass-api';
import '../../css/panel.css';
import {useTranslation} from 'react-i18next';
import {replaceRef} from '../../utils/strings';
import Spinner from '../Spinner';
import keys from '../../utils/keys';

export const Classification = ({item = {}, from, to,
                                include, exclude, chosen,
                                includeCodes, excludeCodes, chosenCodes
                                }) => {
    const {t} = useTranslation();

    const {id, path, codesPath} = URN.toURL(item?.urn, from, to);

    // TODO use fallback, loader, error
    const [metadata, isLoadingMetadata,,, setRetryMetadata] = useGet(path);

    // TODO use fallback, loader, error
    const [codes, isLoadingCodes,,, setRetryCodes] = useGet(codesPath);

    const [show, setShow] = useState({none: true});

    return (
        <li style={{padding: '5px', width: '600px'}}
            tabIndex='0'
            onKeyDown={(event) => {
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
            <div style={{display: 'flex'}}>
                <div style={{width: '400px'}}>{item?.name || metadata?.name}</div>

                {item.error &&
                    <button onClick={() => setShow(prev => ({alert: !prev.alert}))}>
                        <Alert color='orange'/>
                    </button>
                }
{/*

                <button onClick={() => {
                    setRetryCodes(true);
                    setRetryMetadata(true);
                }}>
                    <RefreshCw size='20' color={ isLoadingCodes || isLoadingMetadata ? '#C3DCDC' : '#62919A'}/>
                </button>
*/}

                <button onClick={() =>
                    setShow(prev => ({codes: !prev.codes}))}>
                    { isLoadingCodes
                        ? <Spinner/>
                        : <ListIcon color={codes?.codes?.length > 0 ? '#3396D2' : '#C3DCDC'} />
                    }
                </button>

                <button onClick={() =>
                    setShow(prev => ({info: !prev.info}))}>
                    { isLoadingMetadata
                        ? <Spinner/>
                        : <Info color={metadata ? '#2D6975' : '#C3DCDC'}/>
                    }
                </button>

                {include
                    ?
                    <button onClick={() => {
                        if (chosen || codes?.codes?.length > 0) {
                            setShow({none: true});
                            chosen ? exclude() : include();
                        } else {
                            setShow(prev => ({cannot: !prev.cannot}));
                        }
                    }}>
                        {chosen
                            ? <MinusSquare color='#B6E8B8' />
                            : !codes || codes?.codes?.length === 0
                                ? <XSquare color={ codes ? '#9272FC' : '#C3DCDC' }/>
                                : <PlusSquare color='#1A9D49'/>
                        }
                    </button>
                    :
                    <button onClick={() => {
                        setShow({none: true});
                        exclude();
                    }}>
                        <Trash2 color='#ED5935'/>
                    </button>
                }
            </div>

            {/*TODO: where item.error comes from?*/}
            {show.alert &&
            <div style={{backgroundColor: 'AntiqueWhite'}}
                 className='panel'>
                <Text>{item.error}</Text>
            </div>}

            {show.cannot &&
            <div style={{backgroundColor: '#ECE6FE'}}
                 className='panel'>
                <Text>{t('Code list cannot be added to the subset due to lack of codes')}</Text>
            </div>}

            {show.codes
                && <Codes id={id}
                          codes={codes?.codes.map(code => ({
                              ...code,
                              classificationId: id,
                              validFromInRequestedRange: from,
                              validToInRequestedRange: to,
                              urn: code.urn || `urn:klass-api:classifications:${id}:code:${code.code}`
                          }))}
                          chosenCodes={chosenCodes}
                          includeCodes={includeCodes}
                          excludeCodes={excludeCodes}/>
            }

            {show.info
                && <CodelistInfo id={id} info={metadata}/>}
        </li>
    );
};

export const Codes = ({codes = [], id, includeCodes, excludeCodes, chosenCodes}) => {
    const {t} = useTranslation();

    // DOCME
    // FIXME: magic number 35
    const [renderedCodes, setRenderedCodes] = useState(codes.slice(0, Math.min(35, codes.length)));
    useEffect(() => {
        if (renderedCodes?.length < codes.length){
            setTimeout(() => setRenderedCodes(codes),0);
        }
    });
    const {codesWithNotes, isLoadingVersion} = useClassification(id);

    const from = codes?.length > 0 ? codes[0].validFromInRequestedRange : null;
    const to = codes?.length > 0 ? codes[0].validToInRequestedRange : null;

    return (
        <div style={{backgroundColor: 'AliceBlue'}}
             className='panel'>
            <div className='ssb-checkbox-group'>
                <div className='checkbox-group-header'>{t('Codes')}
                    {from || to
                        ? from && to
                            ? `: ${t('from to', { from, to })}.`
                            : from
                                ? `: ${t('from', { from })}.`
                                : `: ${t('to', { to })}.`
                        : `: ${t('at', { date: new Date().toISOString().substr(0, 10)})}. ${t('Period is not set').toLocaleLowerCase()})`
                    }</div>
                {!codes || codes.length === 0
                    ? <Text>{t('No codes found for this validity period')}</Text>
                    : <>
                        <div style={{padding: '5px'}}>
                            <button onClick={() => includeCodes(codes)}
                                >{t('All')}
                            </button>
                            <button onClick={() => excludeCodes(codes)}
                                >{t('None')}
                            </button>
                        </div>

                        {codes.map((code, index) =>
                            <CodeInfo key={code.urn + index}
                                      item={code}
                                      notes={codesWithNotes.find(c => c.code === code.code)?.notes}
                                      chosen={chosenCodes.find(c => c.urn === code.urn)}
                                      toggle={() => chosenCodes.find(c => c.urn === code.urn)
                                          ? excludeCodes([code])
                                          : includeCodes([code])}
                                      isLoadingVersion={isLoadingVersion}
                            />)
                        }
                    </>
                }
            </div>
        </div>
    );
};

export const CodeInfo = ({item, notes = [], chosen, toggle, isLoadingVersion}) => {
    const {t} = useTranslation();

    const [showNotes, setShowNotes] = useState(false);

    return (
        <>
            <div style={{display: 'flex'}}>
                <div className='ssb-checkbox'>
                    <input id={item.urn}
                           type='checkbox' name='include'
                           checked={chosen}
                           value={item.code}
                           onChange={() => toggle()}/>
                    <label className='checkbox-label'
                           htmlFor={item.urn}>
                        <Text><strong>{item.code}</strong> {item.name}</Text>
                    </label>
                </div>
                <button onClick={() => setShowNotes(prevShowNotes => (!prevShowNotes))}>
                    {isLoadingVersion
                        ? <Spinner />
                        : <MessageSquare color={notes.length > 0 ? '#62919A' : '#C3DCDC'}/>}
                </button>
            </div>

            {showNotes && <div>
                {notes.length === 0
                    ? <Text>{t('No notes found.')}</Text>
                    : notes.map((note, i) => (
                        <div key={i} style={{padding: '10px 50px 20px 50px'}}>
                            <Title size={4}>{t('Notes')}</Title>
                            <div style={{fontSize: '14px'}}
                                 className='ssb-paragraph small'
                                // DOCME
                                // FIXME: find another way
                                 dangerouslySetInnerHTML={{__html: replaceRef(note.note)}}
                            />
                            <Text small>
                                ({t('valid')}: {note.validFrom || '...'} - {note.validTo || '...'})
                            </Text>
                        </div>))}
            </div>
            }
        </>
    );
};

export const CodelistInfo = ({id, info}) => {
    const {t} = useTranslation();

    return (
        <div style={{backgroundColor: '#eff4f5'}}
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
                {info.versions
                    .sort((a, b) => (a.validFrom > b.validFrom ? -1 : 0))
                    .map((version, i) => (
                    <tr key={i}>
                        <td>{version.validFrom || '...'}</td>
                        <td>{version.validTo || '...'}</td>
                        <td style={{width: '65%'}}>{version.name}</td>
                    </tr>
                ))}
                </tbody>
            </table>
            <Paragraph><strong>{t('Description')}:</strong> {info.description || '-'}</Paragraph>
        </div>
    );
};
