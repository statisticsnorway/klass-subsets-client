import React, { useContext, useEffect } from 'react';
import { TextLanguageFieldset } from 'components/Forms';
import { AppContext } from 'controllers';
import { subsetDraft } from 'defaults';

export const DescriptionForm = () => {
    const { subset: { draft: {
        description,
        errors
    }, dispatch
    } } = useContext(AppContext);

    useEffect(() => {
        dispatch({ action: 'description_init' });
        return () => dispatch({ action: 'remove_empty' });
    }, [ dispatch ]);

    return (
        <TextLanguageFieldset title='Description'
                              items={ description }
                              add={() => dispatch({
                                  action: 'description_add'})}
                              remove={ (index) => dispatch({
                                  action: 'description_remove',
                                  data: index })}
                              handleText={ (index, text) => dispatch({
                                  action: 'description_text',
                                  data: { index, text }})}
                              handleLang={ (index, lang) => dispatch({
                                  action: 'description_lang',
                                  data: { index, lang } })}
                              size={{ cols: 65, rows: 4 }}
                              errorMessages={ errors?.description }
                              maxLength={ subsetDraft.maxLengthDescription }
        />
    );
};