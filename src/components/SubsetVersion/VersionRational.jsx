import React, { useContext, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { AppContext } from '../../controllers/context';
import { TextLanguageFieldset } from '../Forms';
import { subsetDraft } from '../../defaults';

export const VersionRationale = () => {
    const { subset } = useContext(AppContext);
    const { draft, dispatch } = subset;
    const { t } = useTranslation();

    useEffect(() => {
        draft.versionRationale?.length === 0
        && dispatch({action: 'version_rationale_add'});

        return () => {
            dispatch({action: 'remove_empty'});
        };
    }, []);

    return (
        <TextLanguageFieldset title={t('Version rationale')}
                              items={draft.versionRationale}
                              add={() => dispatch({action: 'version_rationale_add'})}
                              remove={(index) => dispatch({action: 'version_rationale_remove', data: index})}
                              handleText={(index, text) => dispatch({
                                  action: 'version_rationale_text', data: {index, text}
                              })}
                              handleLang={(index, lang) => dispatch({
                                  action: 'version_rationale_lang', data: {index, lang}
                              })}
                              size={{cols: 65, rows: 4}}
                              maxLength={subsetDraft.maxLengthVersionRationale}
                              errorMessages={draft.errors?.versionRationale}
        />);
};