import React from 'react';
import { Dropdown } from 'components';
import { useTranslation } from 'react-i18next';

export const Switcher = ({
                             versions = [],
                             onSelect = () => {},
                             selected = {},
                             errorMessages= [],
                         }) => {
    const { t } = useTranslation();

    return (
        <>
            <Dropdown label={ t('Version') }
                      options={[
                                  ...versions.map(v => ({
                                  ...v,
                                  title: v.title
                                      || `${ t('Version') }: ${
                                      v.validFrom || '-' } ${
                                      t(v.administrativeStatus)
                                  }`,
                                  id: `${ v.id 
                                      || v.versionId }`
                              }))
                          ]
                      }
                      placeholder={ t('Select a version') }
                      selected={ selected.versionId }
                      onSelect={ option => onSelect(option) }
                      errorMessages={ errorMessages }
            />
        </>
    );
};

