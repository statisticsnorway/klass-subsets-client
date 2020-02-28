import React, {useEffect} from 'react';
import '../../css/pages.css';
import {useTranslation} from "react-i18next";
import {Button, Title} from "@statisticsnorway/ssb-component-library";
import {Subset} from "../Subset";
import {usePost} from '../../controllers/subsets-service';

// TODO: better preview (human pleasant)
export const SubsetPublish = ({subset}) => {
    const { t } = useTranslation();

    useEffect(() => subset.dispatch({action: 'remove_empty'}), []);

    const [data, setPayload, isLoading, error, setPath] = usePost();

    return (
        <>
            <Title size={3}>{t('Review and publish')}</Title>
            <Subset subset={data || subset.draft}/>
            {(data || error) && alert('Published', data, error)}
            <Button disabled={data}
                onClick={() => {
                    console.log('Publish subset: ', subset.draft);
                    setPayload(subset.draft);
            }}>{t('Publish')}</Button>
            {isLoading && 'Loading...'}
            <br/><br/>
        </>
    );
};