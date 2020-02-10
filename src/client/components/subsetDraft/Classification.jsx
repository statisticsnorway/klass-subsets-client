import React, {useState} from 'react';
import {PlusSquare, MinusSquare, XSquare, Trash2, Info,
    List as ListIcon, AlertTriangle as Alert} from 'react-feather';
import {Text, Paragraph, Title} from '@statisticsnorway/ssb-component-library';
import {useGet} from '../../controllers/klass-api';

export const Classification = ({item, update, add, remove, checkbox = false}) => {

    const id = item._links.self.href.split("/").pop();

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

    const [info] = useGet(`/classifications/${id}`);

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
                    add();
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

            <button onClick={() => {
                setExpander(toggle.closeAll());
                remove();
                }}>
                <Trash2 color='#ED5935'/>
            </button>
        </div>

        {expander.showAlert && <div style={{
            backgroundColor: 'AntiqueWhite',
            padding: '15px',
            width: '600px'
        }}><Text>{item.error}</Text></div>}

        {expander.showCannot && <div style={{
                backgroundColor: '#ece6fe',
                padding: '15px',
                width: '600px'
        }}><Text>Code list cannot be added to the subset due to lack of codes</Text></div>}

        {expander.showCodes && <div style={{
            backgroundColor: 'AliceBlue',
            padding: '15px',
            width: '600px'
        }}>
            <div className="ssb-checkbox-group">
                <div className="checkbox-group-header">Codes</div>
                {!check.hasCodes()
                    ? <Text>No codes found for this validity period</Text>
                    : <>
                        {checkbox && <div style={{padding: '5px'}}>
                            <button onClick={() => {
                                item.codes.forEach(code => code.included = true);
                                update();
                                }}>All
                            </button>
                            <button onClick={() => {
                                item.codes.forEach(code => code.included = !code.included);
                                update();
                                }}>Invert
                             </button>
                        </div>}

                        {item.codes.map((code, i) =>
                        !checkbox
                            ? <Paragraph><strong>{code.code}</strong> {code.name}</Paragraph>
                            : <div className="ssb-checkbox">
                                <input id={`${code.code}-${i}`}
                                       type='checkbox' name='include'
                                       checked={code.included}
                                       value={code.code}
                                       onChange={() => {
                                           code.included = !code.included;
                                           update();
                                       }}/>
                                <label className='checkbox-label'
                                       htmlFor={`${code.code}-${i}`}>
                                    <Text><strong>{code.code}</strong> {code.name}</Text>
                                </label>
                            </div>)}
                    </>
                }
            </div>
        </div>}

            {expander.showInfo && <div style={{
                backgroundColor: '#eff4f5',
                padding: '15px',
                width: '600px'
            }}><Title size={4}>Code list info</Title>
                <Paragraph><strong>Id:</strong> {id}</Paragraph>
                <table style={{border: 'none'}}>
                    <tr>
                        <th>From</th>
                        <th>To</th>
                        <th>Version</th>
                    </tr>
                    {info.versions.map(version => (
                    <tr>
                        <td>{version.validFrom || '...'}</td>
                        <td>{version.validTo || '...'}</td>
                        <td>{version.name}</td>
                    </tr>
                ))}</table>
                <Paragraph><strong>Description:</strong> {info.description || '-'}</Paragraph>
            </div>}
    </>);
};
