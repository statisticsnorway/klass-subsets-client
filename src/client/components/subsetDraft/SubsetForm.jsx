import React, {useContext, useEffect} from 'react';
import '../../css/pages.css';
import {AppContext} from '../../controllers/context';
import {Navigation, Step} from '../../utils/navigation';
import {SubsetReorder} from './SubsetReorder';
import {SubsetCodes} from './SubsetCodes';
import {SubsetMetadata} from './SubsetMetadata';
import {unlinkParent} from '../../utils/list';
import {Button, Title} from '@statisticsnorway/ssb-component-library';
import {Subset} from '../Subset';

export default function SubsetForm() {
    const {subset} = useContext(AppContext);

    return (
        <div className='page'>
            <Navigation>
                <Step label={'Metadata'}><SubsetMetadata subset={subset} /></Step>
                <Step label={'Choose codes'}><SubsetCodes subset={subset} /></Step>
                <Step label={'Reorder codes'}><SubsetReorder subset={subset} /></Step>
                <Step label={'Review and publish'}><SubsetPreview subset={subset} /></Step>
            </Navigation>
        </div>
    );
}

// TODO: better preview (human pleasant)
export const SubsetPreview = ({subset}) => {

    // FIXME: it's workaround for parent circular structure to JSON. use Proxy or array.find() instead in List
    subset && subset.draft && subset.draft.classifications && subset.draft.classifications.forEach(code => unlinkParent(code));


    useEffect(() => subset.dispatch({action: 'remove_empty'}), []);


    return (
        <>
            <Title size={3}>Review and publish</Title>
            <Subset subset={subset.draft}/>
            <Button onClick={() =>
                console.log('Publish subset: ', subset.draft)}>Publish</Button>
            <br/><br/>
        </>
    );
};

