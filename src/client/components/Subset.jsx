import React, {useContext} from 'react';
import {flatten} from '../utils/arrays';
import { Accordion, Title } from '@statisticsnorway/ssb-component-library';

export const Subset = ({subset}) => {
    subset.codes.forEach(i => i.children.forEach(j => j.classification = i.title));

    const codes = flatten(subset.codes
            // FIXME: Flatten in depth?
            // FIXME: fix flatten util instead of sorting!
            // .sort((a,b) => (a.rank - b.rank))
            .sort((a,b) => (b.rank - a.rank))
            .map(code => (code.children.filter(i => i.checked))));
    return (
        <>
            <Title size={2}>{subset.names[0].text}</Title>
            <p>{subset.descriptions[0].text}</p>
            { codes.map( code => (
                <Code code={code}/>
            ))}
            <pre>{JSON.stringify(subset, null, 4)}</pre>
        </>
    );
};

/*"code": "1",
    "parentCode": null,
    "level": "1",
    "name": "Bilførere",
    "shortName": "",
    "presentationName": "",
    "title": "1 - Bilførere",
    "children": [],
    "checked": true,
    "rank": 26*/
export const Code = ({code}) => {
    return (
        <Accordion header={code.name} subHeader={code.code || 'Code'}>
            <p><strong>Short name:</strong> {code.shortName}</p>
            <p><strong>Classification:</strong> {code.classification}</p>
            <p><strong>Parent code:</strong> {code.parentCode}</p>
            <p><strong>Level:</strong> {code.level}</p>
        </Accordion>
    );
};