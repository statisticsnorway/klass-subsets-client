import React from 'react';
import { Accordion, Title, Text } from '@statisticsnorway/ssb-component-library';

export const Subset = ({subset}) => {
    // set classification name to each code
    subset.classifications.forEach(classification => classification.codes
            .forEach(code => code.classification = classification.name));

    // FIXME: show title to selected language, not just first in the name array.
    // TODO: show subset in other languages - switch button for language?


    const allCodes = [];
    subset.classifications.map(classification => allCodes.push(...classification.codes));
    allCodes.forEach(i => (i.title = `${i.code} ${i.name}`));

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
            {allCodes.filter(i => i.included)
                .sort((a,b) => (a.rank - b.rank))
                .map((code, i) => (
                    <Code key={i} code={code}/>))}

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
