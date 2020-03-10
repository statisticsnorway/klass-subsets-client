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
import {useGet} from '../../controllers/klass-api';
import '../../css/panel.css';
import {useTranslation} from 'react-i18next';

/*
 * TODO: Use links delivered by API, do not parse - less coupling
 */
export const Classification = ({item = {}, update, remove, from, to}) => {
    const { t } = useTranslation();

    item.id = item._links.self.href.split('/').pop();

    const check = {
        hasCodes: () => (item.codes && item.codes.length > 0),
        includible: () => (!item.included && item.codes && item.codes.length > 0)
    };

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

    // TODO use fallback and loader
    // FIXME show errors
    const [version, isLoading, error, setVersionPath] = useGet();
    useEffect(() => {
        if (version && item && item.versions) {
            let origin = item.versions.find(v => v._links.self.href = version._links.self.href);
            if (origin) {
                origin.classificationItems = version.classificationItems;
                origin.classificationItems.forEach(ci => {
                    if (ci.notes) {
                        let code = item.codes.find(c => c.code === ci.code);
                        if (code) {
                            code.notes = code.notes || [];
                            code.notes.push({
                                note: ci.notes,
                                versionName: version.name,
                                validFrom: version.validFrom,
                                validTo: version.validTo
                            });
                        }
                    }
                });
            }
        }
    }, [version]);

    // TODO use fallback and loader
    // FIXME show errors
    const [info] = useGet(`/classifications/${item.id}`);
    useEffect(() => {
        if (info && info.versions && info.versions.length > 0) {
            item.versions = info.versions;
            item.versions.forEach(v => {
                v.id = v._links.self.href.split('/').pop();
                setVersionPath(`/versions/${v.id}`);
            });
        }
    }, [info]);

    // TODO use fallback and loader
    // FIXME show errors
    let url = from && to
        ? `/classifications/${item.id}/codes.json?from=${from}&to=${to}`
        : `/classifications/${item.id}/codesAt.json?date=${from || to}`;
    const [codes] = useGet(item.codes ? null : url);
    useEffect(() => {
        if (codes) {item.codes = codes.codes;}
    }, [codes]);

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
                } else {setExpander(toggle.cannot());}}}>
                {check.includible() && <PlusSquare color='#1A9D49'/>}
                {item.included && <MinusSquare color='#B6E8B8'/>}
                {!item.included && !check.hasCodes() && <XSquare color='#9272FC' />}
            </button>

            <button onClick={() => setExpander(toggle.codes())}>
                <ListIcon color={check.hasCodes() ? '#3396D2' : '#C3DCDC'}/>
            </button>

            <button onClick={() => setExpander(toggle.info())}>
                <Info color={info ? '#62919A': '#C3DCDC'}/>
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
                                      }} />
            }

        {/* TODO limit the height and scroll*/}
        {expander.showInfo && <ClassificationInfo id={item.id} info={info}/>}
    </>);
};

export const Codes = ({from, to, codes=[], id, include}) => {
    const { t } = useTranslation();

    return (
        <div style={{backgroundColor: 'AliceBlue'}} className='panel'>
            <div className="ssb-checkbox-group">
                <div className="checkbox-group-header">{t('Codes')}
                    {from && to
                    ? ` ${t('from to', { from, to })}:`
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

                        {codes.map((code, i) =>
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
    const { t } = useTranslation();

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
            }}><MoreHorizontal color={item.notes ? '#62919A': '#C3DCDC' }/>
            </button>
            </div>

            {showNotes && <div>
                {!item.notes
                    ? <Text>{t('Notes are not found.')}</Text>
                    : item.notes.map(note => (
                        <div style={{
                            padding: '10px 50px 20px 50px'
                        }}>
                            <Title size={4}>{t('Notes')}</Title>
                            <Paragraph style={{width: '65%'}}>{note.note}</Paragraph>
                            <Text small><strong>«{note.versionName}»</strong> ({t('valid')}: {note.validFrom || '...'} - {note.validTo || '...'})</Text>
                        </div>))}
                </div>
            }
        </>
    );
};

export const ClassificationInfo = ({id, info}) => {
    const { t } = useTranslation();

    return (
        <div style={{backgroundColor: '#eff4f5'}}
             className='panel'>
            <Title size={4}>{t('Code list info')}</Title>
            <Paragraph><strong>Id:</strong> {id}</Paragraph>
            <table style={{border: 'none'}}>
                <thead>
                <th>{t('From')}</th>
                <th>{t('To')}</th>
                <th>{t('Version')}</th>
                </thead>
                {info.versions.map(version => (
                    <tr>
                        <td>{version.validFrom || '...'}</td>
                        <td>{version.validTo || '...'}</td>
                        <td style={{width: '65%'}}>{version.name}</td>
                    </tr>
                ))}</table>
            <Paragraph><strong>{t('Description')}:</strong> {info.description || '-'}</Paragraph>
        </div>
    );
};