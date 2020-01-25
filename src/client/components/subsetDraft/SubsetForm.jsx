import React, {useContext} from 'react';
import '../../css/pages.css';
import {AppContext} from '../../controllers/context';
import {Navigation, Step} from '../../utils/navigation';
import {SubsetReorder} from './SubsetReorder';
import {SubsetCodes} from './SubsetCodes';
import {SubsetMetadata} from './SubsetMetadata';
import {unlinkParent} from '../../utils/list';
import { Button } from '@statisticsnorway/ssb-component-library';

export default function SubsetForm() {
    const {subset} = useContext(AppContext);

    return (
        <div className='page'>
            <h2>Create new subset</h2>
            <Navigation>
                <Step label={'Metadata'}><SubsetMetadata subset={subset} /></Step>
                <Step label={'Choose codes'}><SubsetCodes subset={subset} /></Step>
                <Step label={'Reorder codes'}><SubsetReorder subset={subset} /></Step>
                <Step label={'Preview'}><SubsetPreview subset={subset} /></Step>
            </Navigation>
        </div>
    );
}

// TODO: better preview (human pleasant)
export const SubsetPreview = ({subset}) => {

    // FIXME: it's workaround for parent circular structure to JSON. use Proxy or array.find() instead in List
    subset && subset.draft && subset.draft.codes && subset.draft.codes.forEach(code => unlinkParent(code));

    return (
        <>
            <h3>Subset preview</h3>
            <pre>{JSON.stringify(subset.draft, null, 4)}</pre>
            <Button onClick={() =>
                console.log('Publish subset: ', subset.draft)}>Publish</Button>
            <br/><br/>
        </>
    );
};

