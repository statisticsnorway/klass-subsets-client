import React, {useEffect} from 'react';
import '../../css/pages.css';
import {useTranslation} from 'react-i18next';
import {Button, Title, FormError} from '@statisticsnorway/ssb-component-library';
import {SubsetPreview} from '../Subset';
import {usePost} from '../../controllers/subsets-service';
import {useHistory} from 'react-router-dom';

export const PublishFormStep = ({subset}) => {
    const {draft, dispatch, errors} = subset;

    const { t } = useTranslation();

    let history = useHistory();

    const [data, setPayload, isLoading, error] = usePost();

    useEffect(() => {
        if (data !== null) {
            dispatch({action: 'reset'});
            history.push(`/subsets/${data.id}`);
        }
    }, [data]);

    useEffect(() => {
        error !== null && alert(`Publishing failed: ${JSON.stringify(error)}`);
    }, [error]);

    useEffect(() => dispatch({action: 'validate'}), [draft, dispatch]);

    return (
        <>
            <Title size={3}>{t('Review and publish')}</Title>
            <SubsetPreview subset={draft}/>

            { Object.values(errors).flat().length > 0 &&
                <FormError errorMessages={Object.values(errors).flat().map(e => t(e))} title={t('Some fields are not right')} />
            }

            <Button disabled={data !== null ||  Object.values(errors).flat().length > 0}
                onClick={() => setPayload(draft)}>{t('Publish')}</Button>
            <br/><br/>
        </>
    );
};
