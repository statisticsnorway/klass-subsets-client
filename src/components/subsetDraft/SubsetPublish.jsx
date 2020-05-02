import React, {useEffect} from 'react';
//import '../../css/pages.css';
import {useTranslation} from 'react-i18next';
import {Button, Title} from '@statisticsnorway/ssb-component-library';
import {SubsetPreview} from '../Subset';
import {usePost} from '../../controllers/subsets-service';
import {useHistory} from "react-router-dom";

// TODO: better preview (human pleasant)
export const SubsetPublish = ({subset}) => {
    const { t } = useTranslation();

    let history = useHistory();

    useEffect(() => subset.dispatch({action: 'remove_empty'}), []);

    // set classification name and URN to each code
    subset.draft.classifications.forEach(classification => classification.codes
        .forEach(code => {
            code.classification = `${classification.id} - ${classification.name}`;
            code.urn = `urn:klass-api:classifications:${classification.id}:code:${code.code}`
        })
    );
    const payload = preparePayload(subset.draft);

    const [data, setPayload, isLoading, error] = usePost();
    useEffect(() => {
        data !== null && history.push(`/subsets/${data.id}`);
    }, [data]);
    useEffect(() => {
        error !== null && alert(`Publishing failed: ${JSON.stringify(error)}`);
    }, [error]);

    return (
        <>
            <Title size={3}>{t('Review and publish')}</Title>
            <SubsetPreview subset={payload}/>
            <Button disabled={data !== null}
                onClick={() => setPayload(payload)}>{t('Publish')}</Button>
            <br/><br/>
        </>
    );
};

function preparePayload(draft) {
    const codes = [];
    draft.classifications.map(classification =>
        codes.push(...classification.codes
            .filter(c => c.included)
        ));

    return {
        createdBy: draft.createdBy,
        name: draft.name,
        validFrom: draft.validFrom,
        validUntil: draft.validUntil,
        administrativeDetails: draft.administrativeDetails,
        description: draft.description,
        codes
    }
}