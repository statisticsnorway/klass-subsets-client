import React, { useEffect, useContext } from 'react';
import './container.css';
import { Navigation, Step, Warning } from 'components';
import {
    Step1Metadata,
    Step2Versions,
    Step3ChooseCodes,
    Step4Reorder,
    Step5Review } from './Steps';
import { useQuery } from 'utils';
import { AppContext, useSubset } from 'controllers';

export const SubsetForm = () => {
    let query = useQuery();
    const [ subsetData, error ] = useSubset(query.get('subsetId') || null);
    const { subset: { dispatch } } = useContext(AppContext);

    useEffect(() => {
        subsetData && dispatch({
            action: 'edit',
            data: subsetData
        });
    }, [ subsetData, dispatch ])

    useEffect(() => {
        query.get('versionId') && dispatch({
            action: 'version_switch',
            data: { versionId: query.get('versionId') }
        });
    }, [ subsetData, dispatch, query ])

    useEffect(() => {
        subsetData && query.get('versionId') && dispatch({
            action: 'version_to_sync',
            data: subsetData?.versions?.find(v => v.versionId === query.get('versionId'))
        });
    }, [ subsetData, dispatch, query ])

    return (
        <div className='container'>
            <div className='content'>
                { error &&
                    <Warning visible={ error }
                             title='Fetch failed'>
                        { error.message }
                        { error.info }
                    </Warning>
                }
                <Navigation>
                    <Step label='Metadata' component={ Step1Metadata } />
                    <Step label='Versions' component={ Step2Versions } />
                    <Step label='Choose codes' component={ Step3ChooseCodes }/>
                    <Step label='Reorder codes' component={ Step4Reorder } />
                    <Step label='Review and publish' component={ Step5Review } />
                </Navigation>
            </div>
        </div>
    );
}


