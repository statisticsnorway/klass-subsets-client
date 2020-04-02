import React, {useEffect} from 'react';
import '../../css/pages.css';
import {useTranslation} from 'react-i18next';
import {Button, Title} from '@statisticsnorway/ssb-component-library';
import {SubsetPreview} from '../Subset';
import {usePost} from '../../controllers/subsets-service';

// TODO: better preview (human pleasant)
export const SubsetPublish = ({subset}) => {
    const { t } = useTranslation();

    useEffect(() => subset.dispatch({action: 'remove_empty'}), []);

    // set classification name to each code
    subset.draft.classifications.forEach(classification => classification.codes
        .forEach(code => code.classification = classification.name));

    const payload = preparePayload(subset.draft);

    const [data, setPayload, isLoading, error] = usePost();
    useEffect(() => {
        data !== null && alert(`Publishing succeeded: ${JSON.stringify(data)}`);
    }, [data]);
    useEffect(() => {
        error !== null && alert(`Publishing failed: ${JSON.stringify(error)}`);
    }, [error]);

    return (
        <>
            <Title size={3}>{t('Review and publish')}</Title>
            <SubsetPreview subset={data || payload}/>
            <Button disabled={data !== null}
                onClick={() => setPayload(payload)}>{t('Publish')}</Button>
            <br/><br/>
        </>
    );
};

function preparePayload(draft) {
    const codes = [];
    draft.classifications.map(classification =>
        codes.push(...classification.codes.filter(c => c.included)));

    return {
        createdBy: draft.createdBy,
        name: draft.name,
        validFrom: draft.validFrom,
        validUntil: draft.validUntil,
        administrativeDetails: draft.administrativeDetails,
        description: draft.description,
        codes: codes
    }
}