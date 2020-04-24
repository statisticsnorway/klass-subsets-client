import React, {useEffect, useState} from 'react';
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
import {useGet, useClassification} from '../../controllers/klass-api';
import '../../css/panel.css';
import {useTranslation} from 'react-i18next';
import {replaceRefWithHTMLAndSanitize} from '../../utils/strings';

export const Classification = ({item = {}, update, remove, from, to}) => {
    const {t} = useTranslation();

    item.id = item._links.self.href.split('/').pop();
    // TODO use fallback and loader
    const {metadata, codesWithNotes} = useClassification(item.id);

    // TODO use fallback and loader
    // FIXME show errors
    const url = from && to
        ? `/classifications/${item.id}/codes.json?from=${from}&to=${to}`
        : `/classifications/${item.id}/codesAt.json?date=${from || to}`;
    const [codes] = useGet(item.codes ? null : url);
    useEffect(() => {
        if (codes) {
            item.codes = codes.codes;
        }
    }, [codes]);

    useEffect(() => {
        if (codes && codesWithNotes) {
            item.codes.forEach(code =>
                code.notes = codesWithNotes.find(c => code.name === c.name)?.notes || []
            );
        }
    }, [codes, codesWithNotes]);

    // TODO: outsource to useToggle()
    const toggle = {
        closeAll: () => ({
            showAlert: false,
            showCodes: false,
            showCannot: false,
            showInfo: false
        }),
        alert: () => ({
            showAlert: !expander.showAlert,
            showCodes: false,
            showCannot: false,
            showInfo: false
        }),
        codes: () => ({
            showAlert: false,
            showCodes: !expander.showCodes,
            showCannot: false,
            showInfo: false
        }),
        cannot: () => ({
            showAlert: false,
            showCodes: false,
            showCannot: !expander.showCannot,
            showInfo: false
        }),
        info: () => ({
            showAlert: false,
            showCodes: false,
            showCannot: false,
            showInfo: !expander.showInfo
        })
    };

    const [expander, setExpander] = useState(toggle.closeAll());

    const check = {
        hasCodes: () => (item.codes && item.codes.length > 0),
        includible: () => (!item.included && item.codes && item.codes.length > 0)
    };

    return (
        <>
            <div style={{display: 'flex'}}>
                <div style={{width: '400px'}}>{item.name}</div>

                <button onClick={() => item.error && setExpander(toggle.alert())}>
                    <Alert color={item.error ? 'orange' : 'transparent'}/>
                </button>

                {/*TODO: (test case) remove empty classification from draft.classification*/}
                <button onClick={() => {
                    if (item.included || check.hasCodes()) {
                        setExpander(toggle.closeAll());
                        item.included = !item.included;
                        update();
                    } else {
                        setExpander(toggle.cannot());
                    }
                }}>
                    {check.includible() && <PlusSquare color='#1A9D49'/>}
                    {item.included && <MinusSquare color='#B6E8B8'/>}
                    {!item.included && !check.hasCodes() && <XSquare color='#9272FC'/>}
                </button>

                <button onClick={() => setExpander(toggle.codes())}>
                    <ListIcon color={check.hasCodes() ? '#3396D2' : '#C3DCDC'}/>
                </button>

                <button onClick={() => setExpander(toggle.info())}>
                    <Info color={metadata ? '#62919A' : '#C3DCDC'}/>
                </button>

                {remove &&
                <button onClick={() => {
                    setExpander(toggle.closeAll());
                    remove();
                }}>
                    <Trash2 color='#ED5935'/>
                </button>
                }
            </div>

            {expander.showAlert &&
            <div style={{backgroundColor: 'AntiqueWhite'}}
                 className='panel'><Text>{item.error}</Text>
            </div>}

            {expander.showCannot &&
            <div style={{backgroundColor: '#ece6fe'}}
                 className='panel'>
                <Text>{t('Code list cannot be added to the subset due to lack of codes')}</Text>
            </div>}

            {/* TODO limit the height and scroll*/}
            {expander.showCodes && <Codes from={from} to={to} id={item.id}
                                          codes={item.codes}
                                          include={(o) => {
                                              item.included = o ? true : item.included;
                                              update();
                                          }}/>
            }

            {/* TODO limit the height and scroll*/}
            {expander.showInfo && <CodelistInfo id={item.id} info={metadata}/>}
        </>
    );
};

export const Codes = ({from, to, codes = [], id, include}) => {
    const {t} = useTranslation();

    const codesToLoad = 35; // This is how many codes we load on first render. The rest can wait.

    // React state objects and setters
    const [renderedCodes, setRenderedCodes] = useState(codes.slice(0, Math.min(codesToLoad, codes.length)));

    // Loads all codes, if they are not already loaded
    const loadRest = () => {
        if (renderedCodes.length < codes.length){
            setTimeout(() => {
                setRenderedCodes(codes);
            },0);
        }
    };

    // useEffect is called after the component is mounted and updated
    useEffect(() => {
        loadRest(); // After component is mounted with initial small batch of codes, load the rest of the codes
    });


    return (
        <div style={{backgroundColor: 'AliceBlue'}} className='panel'>
            <div className="ssb-checkbox-group">
                <div className="checkbox-group-header">{t('Codes')}
                    {from && to
                        ? ` ${t('from to', { from: from, to: to })}:`
                        : from || to ? ` ${t('at', { date: from || to})}:`
                            : ` (${t('Period is not set').toLocaleLowerCase()})`
                    }</div>
                {!codes || codes.length < 1
                    ? <Text>{t('No codes found for this validity period')}</Text>
                    : <>
                        <div style={{padding: '5px'}}>
                            <button onClick={() => {
                                codes.forEach(code => code.included = true);
                                include(true);
                            }}>{t('All')}
                            </button>
                            <button onClick={() => {
                                codes.forEach(code => code.included = false);
                                include(false);
                            }}>{t('None')}
                            </button>
                            <button onClick={() => {
                                codes.forEach(code => code.included = !code.included);
                                include(!!codes.find(c => c.included));
                            }}>{t('Invert')}
                            </button>
                        </div>

                        {renderedCodes.map((code, i) =>
                            <CodeInfo key={i} id={id} item={code}
                                      onChange={() => {
                                          code.included = !code.included;
                                          include(code.included);
                                      }}
                            />)
                        }
                    </>
                }
            </div>
        </div>
    );
};

export const CodeInfo = ({id, item, onChange}) => {
    const {t} = useTranslation();

    const [showNotes, setShowNotes] = useState(false);

    return (
        <>
            <div style={{display: 'flex'}}>
                <div className="ssb-checkbox">
                    <input id={`${item.code}-${id}`}
                           type='checkbox' name='include'
                           checked={item.included}
                           value={item.code}
                           onChange={onChange}/>
                    <label className='checkbox-label'
                           htmlFor={`${item.code}-${id}`}>
                        <Text><strong>{item.code}</strong> {item.name}</Text>
                    </label>
                </div>
                <button onClick={() => {
                    setShowNotes(!showNotes);
                }}><MoreHorizontal color={item.notes ? '#62919A' : '#C3DCDC'}/>
                </button>
            </div>

            {showNotes && <div>
                {!item.notes || item.notes.length === 0
                    ? <Text>{t('No notes found.')}</Text>
                    : item.notes.map(note => (
                        <div key={note} style={{
                            padding: '10px 50px 20px 50px'
                        }}>
                            <Title size={4}>{t('Notes')}</Title>
                            <div style={{width: '65%'}}
                                 className='ssb-paragraph'
                                 dangerouslySetInnerHTML={
                                     {__html: replaceRefWithHTMLAndSanitize(note.note)}
                                 }
                            />
                            <Text
                                small><strong>«{note.versionName}»</strong> ({t('valid')}: {note.validFrom || '...'} - {note.validTo || '...'})</Text>
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