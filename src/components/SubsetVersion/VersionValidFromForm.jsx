import React, { useContext } from 'react';
import { AppContext } from '../../controllers/context';
import {Datepicker} from "../Forms";

export const VersionValidFromForm = () => {
    const { subset: { draft: {
        versionValidFrom,
        isEditableVersionValidFrom,
        errors
    }, dispatch
    } } = useContext(AppContext);

    return (
        <Datepicker label='Version valid until'
                    required
                    usage='Version valid from help'
                    style={{ float: 'left'}}
                    value={ versionValidFrom || '' }
                    disabled={ !isEditableVersionValidFrom() }
                    onChange={ event => dispatch({
                        action: 'version_from',
                        data: event.target.value === ''
                            ? null
                            : new Date(event.target.value)?.toJSON()
                    })}
                    errorMessages={ errors?.versionValidFrom }
        />
    );
};