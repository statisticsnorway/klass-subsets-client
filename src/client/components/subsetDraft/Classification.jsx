
import React, {useState} from 'react';
import { PlusSquare, Trash2, Info, List as ListIcon, AlertTriangle as Alert } from 'react-feather';

export const Classification = ({item, update, add, remove, checkbox=false}) => {
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
                padding: '5px',
                opacity: '0.8',
                width: '600px'
            }}>{item.error}</div>}

            {expander.showCodes && <div style={{
                fontSize: '11px',
                backgroundColor: 'AliceBlue',
                padding: '5px',
                opacity: '0.8',
                width: '600px'
            }}>{
                item.children && item.children.length > 0
                    ? item.children.map((code, i) =>
                        <p key={i}>
                            {checkbox && <input type='checkbox' name='include'
                                                checked={code.checked}
                                                onChange={() => {
                                                    code.checked = !code.checked;
                                                    update();
                                                } }/> }
                            <strong>{code.code}</strong> {code.name}
                        </p>)
                    : <p>No codes found for this validity period</p>
            }</div>}
        </>
    )
};