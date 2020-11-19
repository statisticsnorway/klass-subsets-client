import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { Dropdown } from '../Forms';
import { AppContext } from '../../controllers/context';
import { useGet } from '../../controllers/klass-api';

export const SubjectForm = () => {
    const { t } = useTranslation();
    const { subset } = useContext(AppContext);
    const { draft, dispatch, errors } = subset;
    const [ classificationfamilies ] = useGet('classificationfamilies.json');

    return (
        <Dropdown label={ `${t('Subject')} *` }
                  options={classificationfamilies?._embedded?.classificationFamilies
                      .map(family => ({title: family.name, id: family.name}))
                  || []}
                  placeholder={t('Select a classification family...')}
                  disabledText={t('Outdated')}
                  selected={draft.subject || ''}
                  onSelect={(option) => dispatch({
                      action: 'subject',
                      data: option.title })}
                  errorMessages={errors?.annotation}
        />
    );
};