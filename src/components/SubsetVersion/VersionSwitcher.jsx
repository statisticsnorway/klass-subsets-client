import React, { useContext, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { AppContext } from '../../controllers/context';
import { Dropdown } from '../Forms';

export const VersionSwitcher = () => {
    const { subset: { draft: {
        versions,
        administrativeStatus,
        versionId,
        errors
    }, dispatch
    } } = useContext(AppContext);

    const { t } = useTranslation();

    useEffect(() => {
        versions?.length === 0
        && dispatch({
            action: 'version_switch',
            data: { id: 'Create new version' }
        });
    }, []);

    return (
        <Dropdown label={ t('Version') }
                options={ versions
                    ? [
                        {
                            title: `${ t('Create new version') }`,
                            id: 'Create new version',
                        },

                        ...versions.map(v => ({
                            ...v,
                            title: `${ t('Version') }: ${
                                v.validFrom?.substr(0, 10) || '-' } ${
                                t(v.administrativeStatus)
                            }`,
                            id: `${ v.versionId }`
                        }))
                    ]
                    : []
                }
                placeholder={ t('Select a version') }
                disabledText={ t(administrativeStatus) }
                selected={ versionId || '-' }
                onSelect={ option => {
                    dispatch({
                        action: 'version_switch',
                        data: option
                    });
                }}
                errorMessages={ errors?.version }
        />
    );
};
