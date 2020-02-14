import React, {useEffect, useState} from 'react';
import {AlertTriangle as Alert, Info, List as ListIcon, MinusSquare, PlusSquare, Trash2, XSquare} from 'react-feather';
import {Paragraph, Text, Title} from '@statisticsnorway/ssb-component-library';
import {useGet} from '../../controllers/klass-api';
import '../../css/form.css';

export const Classification = ({item = {}, update, remove, from, to}) => {

    item.id = item._links.self.href.split("/").pop();

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
        if (version && item) {
            let origin = item.versions.find(v => v._links.self.href = version._links.self.href);
            console.log({origin});
            if (origin) {
                origin.classificationItems = version.classificationItems;
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
                let id = v._links.self.href.split("/").pop();
                setVersionPath(`/versions/${id}`);
            });
        }
    }, [info]);

    // TODO use fallback and loader
    // FIXME show errors
    let url = from && to
        ? `/classifications/${item.id}/codes.json?from=${from},to=${to}`
        : `/classifications/${item.id}/codesAt.json?date=${from || to}`;
    const [codes] = useGet(item.codes ? null : url);
    useEffect(() => {
        if (codes) item.codes = codes.codes;
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

            <button onClick={() => {setExpander(toggle.closeAll());
                remove();}}>
                <Trash2 color='#ED5935'/>
            </button>
        </div>

        {expander.showAlert &&
            <div style={{backgroundColor: 'AntiqueWhite'}}
                 className='panel'><Text>{item.error}</Text>
            </div>}

        {expander.showCannot &&
            <div style={{backgroundColor: '#ece6fe'}}
                 className='panel'><Text>Code list cannot be added to the subset due to lack of codes</Text>
            </div>}

        {/* TODO limit the height and scroll*/}
        {expander.showCodes &&
            <div style={{backgroundColor: 'AliceBlue'}} className='panel'>
                <div className="ssb-checkbox-group">
                    <div className="checkbox-group-header">Codes {
                        from && to
                        ? `from ${from} to ${to}:`
                        : from || to ? `at ${from || to}:`
                        : '(no period set)'
                    }</div>
                    {!check.hasCodes()
                        ? <Text>No codes found for this validity period</Text>
                        : <>
                            <div style={{padding: '5px'}}>
                                <button onClick={() => {
                                    item.codes.forEach(code => code.included = true);
                                    update();
                                    }}>All
                                </button>
                                <button onClick={() => {
                                    item.codes.forEach(code => code.included = false);
                                    update();
                                    }}>None
                                </button>
                                <button onClick={() => {
                                    item.codes.forEach(code => code.included = !code.included);
                                    update();
                                    }}>Invert
                                 </button>
                            </div>

                            {item.codes.map((code, i) =>
                                <CodeInfo key={i} id={item.id} code={code} onChange={() => {
                                    code.included = !code.included;
                                    item.included = code.included ? true : item.included;
                                    update();
                                }} />)
                            }
                        </>
                    }
            </div>
        </div>}

        {/* TODO limit the height and scroll*/}
        {expander.showInfo && <ClassificationInfo id={item.id} info={info}/>}
    </>);
};

export const CodeInfo = ({id, code, onChange}) => {

    return (
        <div className="ssb-checkbox">
            <input id={`${code.code}-${id}`}
                   type='checkbox' name='include'
                   checked={code.included}
                   value={code.code}
                   onChange={onChange}/>
            <label className='checkbox-label'
                   htmlFor={`${code.code}-${id}`}>
                <Text><strong>{code.code}</strong> {code.name}</Text>
            </label>
        </div>
    );
};

export const ClassificationInfo = ({id, info}) => {

    return (
        <div style={{backgroundColor: '#eff4f5'}}
             className='panel'>
            <Title size={4}>Code list info</Title>
            <Paragraph><strong>Id:</strong> {id}</Paragraph>
            <table style={{border: 'none'}}>
                <thead>
                <th>From</th>
                <th>To</th>
                <th>Version</th>
                </thead>
                {info.versions.map(version => (
                    <tr>
                        <td>{version.validFrom || '...'}</td>
                        <td>{version.validTo || '...'}</td>
                        <td style={{width: '65%'}}>{version.name}</td>
                    </tr>
                ))}</table>
            <Paragraph><strong>Description:</strong> {info.description || '-'}</Paragraph>
        </div>
    );
};