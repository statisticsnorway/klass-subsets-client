import React, { useContext } from 'react';
import { AppContext } from '../../controllers/context';
import { VersionValidFromForm, VersionValidUntilForm } from '../SubsetVersion';
import { ErrorTooltip } from '../Error';

export const VersionPeriod = () => {
    const { subset: { draft: { errors }} } = useContext(AppContext);

    return (
        <div className='period' style={{ display: 'flex'}}>

            <VersionValidFromForm />

            <VersionValidUntilForm />

            <br style={{ clear: 'both' }}/>

            <ErrorTooltip messages={ errors?.versionPeriod } />

        </div>
    );
};