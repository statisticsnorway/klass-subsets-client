import React, {useEffect} from 'react';
import '../../css/pages.css';
import {useTranslation} from 'react-i18next';
import {Button, Title} from '@statisticsnorway/ssb-component-library';
import {Subset} from '../Subset';
import {usePost} from '../../controllers/subsets-service';

// TODO: better preview (human pleasant)
export const SubsetPublish = ({subset}) => {
    const { t } = useTranslation();

    useEffect(() => subset.dispatch({action: 'remove_empty'}), []);

    const [data, setPayload, isLoading, error] = usePost();
    useEffect(() => {
        console.log('GET subset: ', data);
        data !== null && alert(`Publishing succeeded: ${JSON.stringify(data)}`);
    }, [data]);
    useEffect(() => {
        console.log('Failed publishing: ', error);
        error !== null && alert(`Publishing failed: ${JSON.stringify(error)}`);
    }, [error]);

    return (
        <>
            <Title size={3}>{t('Review and publish')}</Title>
            <Subset subset={data || subset.draft}/>
            <Button disabled={data !== null}
                onClick={() => {
                    console.log('POST subset: ', subset.draft);
                    setPayload(subset.draft);
            }}>{t('Publish')}</Button>
            {isLoading && 'Loading...'}
            <br/><br/>
        </>
    );
};