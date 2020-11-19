import React, { useContext, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { TextLanguageFieldset } from '../Forms';
import { AppContext } from '../../controllers/context';
import { subsetDraft } from '../../controllers/defaults';

export const NameForm = () => {
    const { t } = useTranslation();
    const { subset: { draft, dispatch } } = useContext(AppContext);

    useEffect(() => {
        draft.name?.length === 0
        && dispatch({ action: 'name_add' });

        return () => {
            dispatch({ action: 'remove_empty' });
        };
    }, []);

    return (
        <TextLanguageFieldset title={ `${t('Names')} *`}
                              items={ draft?.name }
                              add={() => dispatch({
                                  action: 'name_add'
                              })}
                              remove={(index) => dispatch({
                                  action: 'name_remove',
                                  data: index
                              })}
                              handleText={(index, text) => dispatch({
                                  action: 'name_text',
                                  data: {index, text}
                              })}
                              handleLang={(index, lang) => dispatch({
                                  action: 'name_lang',
                                  data: {index, lang}
                              })}
                              size={{ cols: 65, rows: 1 }}
                              prefix={ subsetDraft?.namePrefix }
                              errorMessages={ draft.errors?.name }
                              maxLength={ subsetDraft?.maxLengthName }
        />
    );
};