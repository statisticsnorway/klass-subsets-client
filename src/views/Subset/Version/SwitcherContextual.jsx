import React, { useContext, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { AppContext } from 'controllers';
import { Switcher } from 'views';
import { useHistory } from 'react-router-dom';
import { useQuery } from 'utils';

export const SwitcherContextual = () => {
    const { subset: { draft: {
        versions,
        versionId,
        errors
    }, dispatch
    } } = useContext(AppContext);

    let history = useHistory();
    let query = useQuery();
    const { t } = useTranslation();

    useEffect(() => dispatch({ action: 'version_init' }), [ dispatch ]);

    return (
        <Switcher versions={ versions
            ? [
                    {
                        title: `${ t('Create new version') }`,
                        versionId: `${ versions?.length + 1 }`,
                    },
                    ...versions
                ]
            : []
        }
                  onSelect={ option => history.push(`?${ query.update('versionId', option.versionId) }`) }
                  selected={ {versionId} || '-' }
                  errorMessages={ errors?.version }
        />
    );
};

