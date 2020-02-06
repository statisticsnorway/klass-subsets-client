import React, {useState} from 'react';
import {
    PlusSquare, Trash2, Info, List as ListIcon,
    AlertTriangle as Alert
} from 'react-feather';
import { Text } from '@statisticsnorway/ssb-component-library';

export const Classification = ({item, update, add, remove, checkbox = false}) => {
    const [expander, setExpander] = useState({
        showAlert: false,
        showCodes: false
    });
    return (
        <>
        <div style={{display: 'flex'}}>
            <div style={{width: '400px'}}>{item.title}</div>

            <button onClick={() => {
                item.error && setExpander({
                    showAlert: !expander.showAlert,
                    showCodes: false
                })
            }}>
                <Alert color={item.error ? 'orange' : 'transparent'}/>
            </button>

            <button
                onClick={() => {
                    // TODO tooltip 'cannot be added due to lack of codes for this code list'
                    if (item.children && item.children.length > 0) {
                        setExpander({
                            showAlert: false,
                            showCodes: false
                        });
                        item.included = !item.included;
                        add();
                        update();
                    }
                }}>
                <PlusSquare color={item.included || !(item.children && item.children.length > 0)
                    ? '#C3DCDC' : '#1A9D49'}/>
            </button>

            <button onClick={() => {
                setExpander({
                    showAlert: false,
                    showCodes: !expander.showCodes
                });
            }}>
                <ListIcon color={item.children && item.children.length > 0
                    ? '#3396D2' : '#C3DCDC'}/>
            </button>

            <button onClick={() => console.log('info', item)}>
                <Info color='#62919A'/>
            </button>

            <button onClick={() => {
                setExpander({
                    showAlert: false,
                    showCodes: false
                });
                item.included = false;
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

        {expander.showCodes && <div style={{
            fontSize: '11px',
            backgroundColor: 'AliceBlue',
            padding: '15px',
            opacity: '0.8',
            width: '600px'
        }}>
            <div className="ssb-checkbox-group">
                <div className="checkbox-group-header">Codes</div>
                {!(item.children && item.children.length > 0)
                    ? <p><Text>No codes found for this validity period</Text></p>
                    : item.children.map((code, i) =>
                        !checkbox
                            ? <p><Text><strong>{code.code}</strong> {code.name}</Text></p>
                            : <div className="ssb-checkbox">
                                <input id={`${code.code}-${i}`}
                                       type='checkbox' name='include'
                                       checked={code.checked}
                                       value={code.code}
                                       onChange={() => {
                                           code.checked = !code.checked;
                                           update();
                                       }}/>
                                <label className='checkbox-label'
                                       htmlFor={`${code.code}-${i}`}>
                                    <Text><strong>{code.code}</strong> {code.name}</Text>
                                </label>
                            </div>
                    )
                }
            </div>
            </div>
        }
        </>
    )
};