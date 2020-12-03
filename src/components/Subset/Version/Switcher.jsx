import React from 'react';
import { Dropdown } from '../../Forms';
import { useTranslation } from 'react-i18next';

export const Switcher = ({
                             versions = [],
                             onSelect = () => {},
                             selected = {}
}) => {
    const { t } = useTranslation();

    return (
        <>
            <Dropdown label={ t('Version') }
                      options={[
                                  ...versions.map(v => ({
                                  ...v,
                                  title: `${ t('Version') }: ${
                                      v.validFrom} ${
                                      t(v.administrativeStatus)
                                  }`,
                                  id: `${ v.version }`
                              }))
                          ]
                      }
                      placeholder={ t('Select a version') }
                      selected={ selected.version || '-' }
                      onSelect={ (option) => onSelect(option) }
            />
        </>
    );
};

