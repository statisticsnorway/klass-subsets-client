import React, { useContext } from 'react';
import { AppContext } from 'controllers';
import { VersionValidFromForm, VersionValidUntilForm } from 'components/SubsetVersion';
import { ErrorTooltip } from 'components';

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