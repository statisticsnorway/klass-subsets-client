import React, {useEffect} from 'react';
import '../../css/pages.css';
import {useTranslation} from 'react-i18next';
import {Button, Title} from '@statisticsnorway/ssb-component-library';
import {SubsetPreview} from '../Subset';
import {usePost} from '../../controllers/subsets-service';
import {useHistory} from "react-router-dom";

export const SubsetPublish = ({subset}) => {
    const {draft, dispatch} = subset;

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

    return (
        <>
            <Title size={3}>{t('Review and publish')}</Title>
            <SubsetPreview subset={draft}/>
            <Button disabled={data !== null}
                onClick={() => setPayload(draft)}>{t('Publish')}</Button>
            <br/><br/>
        </>
    );
};
