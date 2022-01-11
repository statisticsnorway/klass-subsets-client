import React, { useContext } from 'react';
import { Dropdown } from 'components';
import { AppContext } from 'controllers';
import { useKlassGet } from 'controllers/klass-api';

export const ClassificationFamilyForm = () => {
    const { subset: { draft: {
        classificationFamily,
        errors
    }, dispatch
    } } = useContext(AppContext);
    const [ classificationfamilies ] = useKlassGet('classificationfamilies.json');

    return (
        <Dropdown label='Subject'
                  required
                  options={ classificationfamilies?._embedded?.classificationFamilies
                      .map(family => ({
                          title: family.name,
                          id: family.name
                      }))
                    || []
                  }
                  placeholder='Select a classification family...'
                  selected={ classificationFamily || '' }
                  onSelect={ (option) => dispatch({
                      action: 'classificationFamily',
                      data: option.title
                  })}
                  errorMessages={ errors?.classificationFamily }
        />
    );
};