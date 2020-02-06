import React from 'react';
import {flatten} from '../utils/arrays';
import { Accordion, Title, Text } from '@statisticsnorway/ssb-component-library';

export const Subset = ({subset}) => {
    subset.codes.forEach(i => i.children.forEach(j => j.classification = i.title));

    // FIXME: show title to selected language, not just first in the name array.
    // TODO: show subset in other languages - switch button for language?

    return (
        <>
            <Title size={2}>{
                subset.names.length > 0 && subset.names[0].text
                    ? subset.names[0].text
                    : 'Subset has got no title yet'
            }</Title>
            <Text>{subset.descriptions.length > 0 && subset.descriptions[0].text
                    ? subset.descriptions[0].text
                    : 'No description'}</Text>

            <Title size={3}>Codes: </Title>
            {subset.codes.map(classification =>
                (classification.children && classification.children.map(code => (
                    <Code code={code}/>)))
            )}

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
