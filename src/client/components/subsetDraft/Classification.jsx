import React, {useState} from 'react';
import {
    PlusSquare, MinusSquare, XSquare, Trash2, Info,
    List as ListIcon,
    AlertTriangle as Alert
} from 'react-feather';
import { Text } from '@statisticsnorway/ssb-component-library';

export const Classification = ({item, update, add, remove, checkbox = false}) => {
    const toggle = {
        closeAll: () => ({
            showAlert: false,
            showCodes: false,
            showCannot: false
        }),
        alert: () => ({
            showAlert: !expander.showAlert,
            showCodes: false,
            showCannot: false
        }),
        codes: () => ({
            showAlert: false,
            showCodes: !expander.showCodes,
            showCannot: false
        }),
        cannot: () => ({
            showAlert: false,
            showCodes: false,
            showCannot: !expander.showCannot
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

            <button onClick={() => console.log('info', item)}>
                <Info color='#62919A'/>
            </button>

            <button onClick={() => {
                setExpander(toggle.closeAll());
                remove();
                }}>
                <Trash2 color='#ED5935'/>
            </button>
        </div>

        {expander.showAlert && <div style={{
            fontSize: '11px',
            backgroundColor: 'AntiqueWhite',
            padding: '15px',
            opacity: '0.8',
            width: '600px'
        }}><Text>{item.error}</Text></div>}

        {expander.showCannot && <div style={{
                fontSize: '11px',
                backgroundColor: '#ece6fe',
                padding: '15px',
                opacity: '0.8',
                width: '600px'
        }}><Text>Code list cannot be added to the subset due to lack of codes</Text></div>}

        {expander.showCodes && <div style={{
            fontSize: '11px',
            backgroundColor: 'AliceBlue',
            padding: '15px',
            opacity: '0.8',
            width: '600px'
        }}>
            <div className="ssb-checkbox-group">
                <div className="checkbox-group-header">Codes</div>
                {!check.hasCodes()
                    ? <Text>No codes found for this validity period</Text>
                    : item.codes.map((code, i) =>
                        !checkbox
                            ? <p><Text><strong>{code.code}</strong> {code.name}</Text></p>
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
                            </div>)
                }
            </div>
        </div>}

    </>);
};