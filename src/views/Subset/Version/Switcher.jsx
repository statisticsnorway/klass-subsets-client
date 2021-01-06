import React from 'react';
import { Dropdown } from 'components';
import { useTranslation } from 'react-i18next';
import { orderByValidFromAsc } from 'utils';

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
                      options={ orderByValidFromAsc([
                          ...versions.map(v => ({
                                  ...v,
                                  title: v.title
                                      || `${ t('Version') }: ${
                                      v.validFrom || '-' } ${
                                      t(v.administrativeStatus)
                                  }`,
                                  id: v.versionId
                              }))
                          ])
                      }
                      placeholder={ t('Select a version') }
                      selected={ selected.versionId }
                      onSelect={ option => onSelect(option) }
                      errorMessages={ errorMessages }
            />
        </>
    );
};
