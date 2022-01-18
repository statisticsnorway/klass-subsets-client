import React, { useContext } from 'react';
import { Dropdown } from 'components';
import { AppContext, useKlassGet } from 'controllers';

export const SectionForm = () => {
    const { subset:
        { draft: {
            owningSection,
            errors
        }, dispatch
        } } = useContext(AppContext);

    const [ ssbsections ] = useKlassGet('ssbsections.json');

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
