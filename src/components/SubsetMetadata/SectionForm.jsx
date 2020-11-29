import React, { useContext } from 'react';
import { Dropdown } from '../Forms';
import { AppContext } from '../../controllers/context';
import { useGet } from '../../controllers/klass-api';

export const SectionForm = () => {
    const { subset:
        { draft: {
            createdBy,
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
                  selected={ createdBy }
                  onSelect={ (option) => dispatch({
                      action: 'createdBy',
                      data: option.title })}
                  errorMessages={ errors?.createdBy }
        />
    );
};
