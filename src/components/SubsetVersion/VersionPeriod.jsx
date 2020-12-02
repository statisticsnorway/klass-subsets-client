import React, { useContext } from 'react';
import { AppContext } from '../../controllers/context';
import { VersionValidFromForm } from './VersionValidFromForm';
import { VersionValidUntilForm } from './VersionValidUntilForm';
import { ErrorTooltip } from '../Error';
import {useTranslation} from "react-i18next";
import {Help} from "../Help";

export const VersionPeriod = () => {
    const { subset: { draft: { errors }} } = useContext(AppContext);
    const { t } = useTranslation();

    return (
        <div className='period' style={{ display: 'flex'}}>

            <VersionValidFromForm />

            <VersionValidUntilForm />

            <br style={{ clear: 'both' }}/>

            <ErrorTooltip messages={ errors?.versionPeriod } />

        </div>
    );
};