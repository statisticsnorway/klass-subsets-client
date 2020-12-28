import React, { useContext, useEffect } from 'react';
import { AppContext } from 'controllers';
import { TextLanguageFieldset } from 'components/Forms';
import { subsetDraft } from 'defaults';

export const VersionRationale = () => {
    const { subset: { draft: {
        versionRationale,
        errors
    }, dispatch } } = useContext(AppContext);

    useEffect(() => {
        dispatch({action: 'version_rationale_init'});
        return () => dispatch({action: 'remove_empty'});
    }, [ dispatch ]);

    return (
        <TextLanguageFieldset title='Version rationale'
                              items={ versionRationale }
                              add={ () => dispatch({
                                  action: 'version_rationale_add'}) }
                              remove={ index => dispatch({
                                  action: 'version_rationale_remove',
                                  data: index}) }
                              handleText={ (index, text) => dispatch({
                                  action: 'version_rationale_text',
                                  data: { index, text }
                              })}
                              handleLang={ (index, lang) => dispatch({
                                  action: 'version_rationale_lang',
                                  data: { index, lang }
                              })}
                              size={{ cols: 65, rows: 4 }}
                              maxLength={ subsetDraft?.maxLengthVersionRationale }
                              errorMessages={ errors?.versionRationale }
        />);
};