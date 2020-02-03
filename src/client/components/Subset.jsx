import React from 'react';
import {flatten} from '../utils/arrays';
import { Accordion, Title } from '@statisticsnorway/ssb-component-library';
import { PlusSquare, Trash2, Info, List as ListIcon, AlertTriangle as Alert } from 'react-feather';

export const Subset = ({subset}) => {
    subset.codes.forEach(i => i.children.forEach(j => j.classification = i.title));

    const codes = flatten(subset.codes
            // FIXME: Flatten in depth?
            // FIXME: fix flatten util instead of sorting!
            // .sort((a,b) => (a.rank - b.rank))
            .sort((a, b) => (b.rank - a.rank))
            .map(code => (code.children.filter(i => i.checked))));

    // FIXME: show title to selected language, not just first in the name array.
    // TODO: show subset in other languages - switch button for language?

    return (
        <>
            <Title size={2}>{
                subset.names.length > 0 && subset.names[0].text
                    ? subset.names[0].text
                    : 'Subset has got no title yet'
            }</Title>
            <p>{subset.descriptions.length > 0 && subset.descriptions[0].text
                    ? subset.descriptions[0].text
                    : 'No description'}</p>
            { codes.map( code => (<Code code={code}/>)) }

            <Accordion header='Raw JSON'>
                <pre>{JSON.stringify(subset, null, 4)}</pre>
            </Accordion>
        </>
    );
};

export const Code = ({code}) => {
    return (
        <Accordion header={code.name} subHeader={code.code || 'Code'}>
            <p><strong>Short name:</strong> {code.shortName || '-'}</p>
            <p><strong>Classification:</strong> {code.classification || '-'}</p>
            <p><strong>Level:</strong> {code.level}</p>
            {code.parentCode && <p><strong>Parent code:</strong>code.parentCode</p>}
            <p><strong>Note:</strong> {code.note || '-'}</p>
        </Accordion>
    );
};

export const Classification = ({item, update, add, remove, checkbox=false}) => {
    return (
        <>
            <div style={{display: 'flex'}}>
                <div style={{width: '400px'}}>{item.title}</div>

                <button onClick={() => {
                    item.showAlert = !item.showAlert;
                    item.showCodes = false;
                    update();
                }}>
                    <Alert color={item.error ? 'orange' : 'transparent'}/>
                </button>

                <button
                    onClick={() => {
                        // TODO tooltip 'cannot be added due to lack of codes for this code list'
                        if (item.children && item.children.length > 0) {
                            item.included = !item.included;
                            item.showAlert = false;
                            item.showCodes = false;
                            add();
                            update();
                        }
                    }}>
                    <PlusSquare color={item.included || !(item.children && item.children.length > 0)
                        ? '#C3DCDC' : '#1A9D49'}/>
                </button>

                <button onClick={() => {
                    item.showCodes = !item.showCodes;
                    item.showAlert = false;
                    update();
                }}>
                    <ListIcon color={item.children && item.children.length > 0
                        ? '#3396D2' : '#C3DCDC'}/>
                </button>

                <button onClick={() => console.log('info', item)}><Info color='#62919A'/></button>

                <button onClick={() => remove()}><Trash2 color='#ED5935'/></button>
            </div>

            {item.showAlert && <div style={{
                fontSize: '11px',
                backgroundColor: 'orange',
                padding: '5px',
                opacity: '0.8',
                width: '600px'
            }}>{item.error}</div>}

            {item.showCodes && <div style={{
                fontSize: '11px',
                backgroundColor: '#3396D2',
                padding: '5px',
                opacity: '0.8',
                width: '600px'
            }}>{
                item.children && item.children.length > 0
                    ? item.children.map((code, i) =>
                        <p key={i}>
                            {checkbox && <input type='checkbox' name='include'
                                        checked={code.checked}
                                        onChange={() => code.checked = !code.checked }/> }
                            {code.code} {code.name}
                        </p>)
                    : <p>No codes found for this validity period</p>
            }</div>}
            </>
    )
};