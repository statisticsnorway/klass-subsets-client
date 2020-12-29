import React, { useContext, useEffect } from 'react';
import { TextLanguageFieldset } from 'components';
import { AppContext } from 'controllers';
import { subsetDraft } from 'defaults';

export const NameForm = () => {
    const { subset: { draft, dispatch } } = useContext(AppContext);

    useEffect(() => {
        dispatch({ action: 'name_init' });
        return () => dispatch({ action: 'remove_empty' });
    }, [ dispatch ]);

    return (
        <TextLanguageFieldset title='Names'
                              required
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