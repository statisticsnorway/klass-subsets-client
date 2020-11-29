import React, { useContext } from 'react';
import { Dropdown } from '../Forms';
import { AppContext } from '../../controllers/context';
import { useGet } from '../../controllers/klass-api';

export const SubjectForm = () => {
    const { subset: { draft: {
        subject,
        errors
    }, dispatch
    } } = useContext(AppContext);
    const [ classificationfamilies ] = useGet('classificationfamilies.json');

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
                  selected={ subject || '' }
                  onSelect={ (option) => dispatch({
                      action: 'subject',
                      data: option.title
                  })}
                  errorMessages={ errors?.subject }
        />
    );
};