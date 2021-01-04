import React, { useContext, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { AppContext } from 'controllers';
import { Switcher } from 'views';

export const SwitcherContextual = () => {
    const { subset: { draft: {
        versions,
        versionId,
        errors
    }, dispatch
    } } = useContext(AppContext);

    const { t } = useTranslation();

    useEffect(() => dispatch({ action: 'version_init' }), [ dispatch ]);

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

