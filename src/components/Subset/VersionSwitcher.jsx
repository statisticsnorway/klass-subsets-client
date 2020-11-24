import React from 'react';
import {Dropdown} from "../Forms";

export const VersionSwitcher = ({ data = {}}) => {

    return (
        <>
{/*            <Dropdown label={ t('Version') }
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
            <Version />*/}
        </>
    );
};

