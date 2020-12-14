import React, { useContext, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { AppContext } from '../../controllers/context';
import { Switcher } from '../Subset';

export const VersionSwitcher = () => {
    const { subset: { draft: {
        versions,
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
    }, [versions?.length, dispatch]);

    return (
        <Switcher versions={ versions
            ? [
                    {
                        title: `${ t('Create new version') }`,
                        id: 'Create new version',
                    },
                    ...versions
                ]
            : []
        }
                  onSelect={ option => {
                      dispatch({
                          action: 'version_switch',
                          data: option
                      });
                  }}
                  selected={ {versionId} || '-' }
                  errorMessages={ errors?.version }
        />
    );
};

