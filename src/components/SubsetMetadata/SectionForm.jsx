import React, { useContext } from 'react';
import { Dropdown } from 'components/Forms';
import { AppContext, useGet } from 'controllers';

export const SectionForm = () => {
    const { subset:
        { draft: {
            owningSection,
            errors
        }, dispatch
        } } = useContext(AppContext);

    const [ ssbsections ] = useGet('ssbsections.json');

    // TODO: set automatically when logged inn
    return (
        <Dropdown label='Owner'
                  required
                  options={ ssbsections
                      ? ssbsections._embedded?.ssbSections.map(section => ({
                          title: section.name, id: section.name
                      }))
                      : []}
                  placeholder='Select a responsible department...'
                  selected={ owningSection }
                  onSelect={ (option) => dispatch({
                      action: 'owningSection',
                      data: option.title })}
                  errorMessages={ errors?.owningSection }
        />
    );
};
