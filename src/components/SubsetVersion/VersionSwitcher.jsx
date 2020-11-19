import React, { useContext, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { AppContext } from '../../controllers/context';
import { Dropdown } from '../Forms';
import { Spinner } from '../Spinner';
import { useGet } from '../../controllers/subsets-service';

export const VersionSwitcher = () => {
    const { subset } = useContext(AppContext);
    const { draft, dispatch } = subset;
    const { t } = useTranslation();

    const [ versions, isLoadingVersions ] = useGet(`${draft.id}/versions`);

    useEffect(() => {
        if (versions && !versions.error) {
            dispatch({
                action: 'previous_versions',
                data: versions
            });
        }
    }, [ versions, dispatch ]);


    return (
        <>{ isLoadingVersions
            ? <Spinner />
            : <Dropdown label={ t('Version') }
                        options={ draft.previousVersions
                            ? [
                                {
                                    title: `${ t('Create previous version') }`,
                                    id: 'Create previous version',
                                    disabled: draft.isNewVersion()
                                },

                                ...draft.previousVersions.map(v => ({
                                    ...v,
                                    title: `${ t('Version') }: ${
                                        v.versionValidFrom?.substr(0, 10)} ${
                                        t(v.administrativeStatus)
                                    }`,
                                    id: `${ v.versionValidFrom }`
                                })),

                                {
                                    title: `${ t('Create next version') }`,
                                    id: 'Create next version',
                                    disabled: draft.isNewVersion()
                                }
                            ]
                            : []
                        }
                        placeholder={ t('Select a version') }
                        disabledText={ t(draft.administrativeStatus) }
                        selected={ draft.versionValidFrom || '-' }
                        onSelect={ (option) => {
                            dispatch({
                                action: 'version_switch',
                                data: option.id
                            });
                        }}
                        errorMessages={ draft.errors?.version }
            />
        } </>
    );
};