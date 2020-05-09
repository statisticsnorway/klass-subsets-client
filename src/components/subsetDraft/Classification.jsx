import React, {useState, useEffect} from 'react';
import {
    AlertTriangle as Alert,
    Info,
    List as ListIcon,
    MinusSquare,
    MoreHorizontal,
    PlusSquare,
    Trash2,
    XSquare
} from 'react-feather';
import {Paragraph, Text, Title} from '@statisticsnorway/ssb-component-library';
import {useGet, URN, useCode, useClassification} from '../../controllers/klass-api';
import '../../css/panel.css';
import {useTranslation} from 'react-i18next';
import {replaceRef} from '../../utils/strings';

export const Classification = ({item = {}, from, to,
                                include, exclude, chosen, remove,
                                includeCodes, excludeCodes, chosenCodes
                                }) => {
    const {t} = useTranslation();

    const {id, path, codesPath} = URN.toURL(item?.urn, from, to);

    // TODO use fallback, loader, error
    const [metadata] = useGet(path);

    // TODO use fallback, loader, error
    const [codes] = useGet(codesPath);

    const [show, setShow] = useState({none: true});

    return (
        <>
            <div style={{display: 'flex'}}>
                <div style={{width: '400px'}}>{item.name || metadata.name}</div>

                <button onClick={() => item.error
                    && setShow(prev => {return {alert: !prev.alert};})}>
                    <Alert color={item.error ? 'orange' : 'transparent'}/>
                </button>

                <button onClick={() =>
                    setShow(prev => {return {codes: !prev.codes};})}>
                    <ListIcon color={codes?.codes?.length > 0 ? '#3396D2' : '#C3DCDC'}/>
                </button>

                <button onClick={() =>
                    setShow(prev => {return {info: !prev.info};})}>
                <Info color={metadata ? '#62919A' : '#C3DCDC'}/>
                </button>

                {remove
                    ?
                    <button onClick={() => {
                        setShow({none: true});
                        exclude(item.urn);
                    }}>
                        <Trash2 color='#ED5935'/>
                    </button>
                    :
                    <button onClick={() => {
                        if (chosen || codes?.codes?.length > 0) {
                            setShow({none: true});
                            chosen ? exclude(item.urn) : include(item.urn);
                        } else {
                            setShow(prev => {return {cannot: !prev.cannot};});
                        }
                    }}>
                        {!chosen && codes?.codes?.length > 0 && <PlusSquare color='#1A9D49'/>}
                        {chosen && <MinusSquare color='#B6E8B8'/>}
                        {!chosen && codes?.codes?.length === 0 && <XSquare color='#9272FC'/>}
                    </button>
                }
            </div>

            {/*TODO: where item.error comes from?*/}
            {show.alert &&
            <div style={{backgroundColor: 'AntiqueWhite'}}
                 className='panel'><Text>{item.error}</Text>
            </div>}

            {show.cannot &&
            <div style={{backgroundColor: '#ECE6FE'}}
                 className='panel'>
                <Text>{t('Code list cannot be added to the subset due to lack of codes')}</Text>
            </div>}

            {/* TODO limit the height and scroll */}
            {show.codes
                && <Codes from={from} to={to} id={id}
                          codes={codes?.codes}
                          chosenCodes={chosenCodes}
                          includeCodes={includeCodes}
                          excludeCodes={excludeCodes}/>
            }

            {/* TODO limit the height and scroll */}
            {/* TODO sort versions by date */}
            {show.info
                && <CodelistInfo id={id} info={metadata}/>}
        </>
    );
};

export const Codes = ({from, to, codes = [], id, includeCodes, excludeCodes, chosenCodes}) => {
    const {t} = useTranslation();

/*    // FIXME: magic number 35
    const [renderedCodes, setRenderedCodes] = useState(codes.slice(0, Math.min(35, codes.length)));
    useEffect(() => {
        if (renderedCodes?.length < codes.length){
            setTimeout(() => setRenderedCodes(codes),0);
        }
    });*/

    const {codesWithNotes} = useClassification(id);

    return (
        <div style={{backgroundColor: 'AliceBlue'}} className='panel'>
            <div className='ssb-checkbox-group'>
                <div className='checkbox-group-header'>{t('Codes')}
                    {from && to
                        ? ` ${t('from to', { from, to })}:`
                        : from || to ? ` ${t('at', { date: from || to})}:`
                            : ` (${t('Period is not set').toLocaleLowerCase()})`
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

                        {codes.map(code => ({
                            ...code,
                            classificationId: id,
                            validFromInRequestedRange: from,
                            validToInRequestedRange: to,
                            urn: code.urn || `urn:klass-api:classifications:${id}:code:${code.code}`
                        }))
                            .map((code, i) =>
                                <CodeInfo key={i}
                                          item={code}
                                          notes={codesWithNotes.find(c => c.code === code.code)?.notes}
                                          chosen={chosenCodes.find(c => c.urn === code.urn)}
                                          toggle={() => chosenCodes.find(c => c.urn === code.urn)
                                              ? excludeCodes([code])
                                              : includeCodes([code])}
                            />)
                        }
                    </>
                }
            </div>
        </div>
    );
};

export const CodeInfo = ({item, notes = [], chosen, toggle}) => {
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
                    <MoreHorizontal color={notes.length > 0 ? '#62919A' : '#C3DCDC'}/>
                </button>
            </div>

            {showNotes && <div>
                {notes.length === 0
                    ? <Text>{t('No notes found.')}</Text>
                    : notes.map(note => (
                        <div key={note} style={{padding: '10px 50px 20px 50px'}}>
                            <Title size={4}>{t('Notes')}</Title>
                            <div style={{width: '65%'}}
                                 className='ssb-paragraph'
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
                {info.versions.map((version, i) => (
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
