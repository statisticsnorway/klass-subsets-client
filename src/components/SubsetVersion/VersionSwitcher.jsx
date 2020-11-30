import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { AppContext } from '../../controllers/context';
import { Dropdown } from '../Forms';

export const VersionSwitcher = () => {
    const { subset: { draft: {
        versions,
        isNewVersion,
        administrativeStatus,
        versionValidFrom,
        errors
    }, dispatch
    } } = useContext(AppContext);

    const { t } = useTranslation();

    return (
        <Dropdown label={ t('Version') }
                        options={ versions
                            ? [
                                {
                                    title: `${ t('Create previous version') }`,
                                    id: 'Create previous version',
                                    disabled: isNewVersion()
                                },

                                ...versions.map(v => ({
                                    ...v,
                                    title: `${ t('Version') }: ${
                                        v.validFrom?.substr(0, 10)} ${
                                        t(v.administrativeStatus)
                                    }`,
                                    id: `${ v.version }`
                                })),

                                {
                                    title: `${ t('Create next version') }`,
                                    id: 'Create next version',
                                    disabled: isNewVersion()
                                }
                            ]
                            : []
                        }
                        placeholder={ t('Select a version') }
                        disabledText={ t(administrativeStatus) }
                        selected={ versionValidFrom || '-' }
                        onSelect={ (option) => {
                            dispatch({
                                action: 'version_switch',
                                data: option
                            });
                        }}
                        errorMessages={ errors?.version }
            />
    );
};