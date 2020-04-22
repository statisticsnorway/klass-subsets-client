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
import {useGet, useCodelist} from '../../controllers/klass-api';
import '../../css/panel.css';
import {useTranslation} from 'react-i18next';
import { replaceRefWithHTMLAndSanitize } from '../../utils/strings';
import {ClassificationInfo} from "./Classification";

export const Codelist = ({item = {}, update, remove, from, to}) => {
    const {t} = useTranslation();

    item.id = item._links.self.href.split('/').pop();
    // TODO use fallback and loader
    const {metadata} = useCodelist(item.id);

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
                } else {setExpander(toggle.cannot());}}}>
                {check.includible() && <PlusSquare color='#1A9D49'/>}
                {item.included && <MinusSquare color='#B6E8B8'/>}
                {!item.included && !check.hasCodes() && <XSquare color='#9272FC' />}
            </button>

            <button onClick={() => setExpander(toggle.codes())}>
                <ListIcon color={check.hasCodes() ? '#3396D2' : '#C3DCDC'}/>
            </button>

            <button onClick={() => setExpander(toggle.info())}>
                <Info color={metadata ? '#62919A': '#C3DCDC'}/>
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
            {expander.showInfo && <ClassificationInfo id={item.id} info={metadata}/>}
        </>
    );
};