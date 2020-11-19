import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { Dropdown } from '../Forms';
import { AppContext } from '../../controllers/context';
import { useGet } from '../../controllers/klass-api';

export const SectionForm = () => {
    const { t } = useTranslation();
    const { subset } = useContext(AppContext);
    const { draft, dispatch } = subset;
    const [ ssbsections ] = useGet('ssbsections.json');

    // TODO: set automatically when logged inn
    return (
        <Dropdown label={ `${t('Owner')} *` }
                  options={ ssbsections
                      ? ssbsections._embedded?.ssbSections.map(section => ({
                          title: section.name, id: section.name
                      }))
                      : []}
                  placeholder={ t('Select a responsible department...') }
                  disabledText={ t('Outdated') }
                  selected={ draft.createdBy }
                  onSelect={ (option) => dispatch({
                      action: 'createdBy',
                      data: option.title })}
                  errorMessages={ draft.errors?.createdBy }
        />
    );
};
