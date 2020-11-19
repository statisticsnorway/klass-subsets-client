import { useContext, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { TextLanguageFieldset } from '../Forms';
import { AppContext } from '../../controllers/context';
import { subsetDraft } from '../../controllers/defaults';

export const DescriptionForm = () => {
    const { t } = useTranslation();
    const { subset } = useContext(AppContext);
    const { draft, dispatch } = subset;

    useEffect(() => {
        draft.description?.length === 0
        && dispatch({action: 'description_add'});

        return () => {
            dispatch({action: 'remove_empty'});
        };
    }, []);

    // DOCME: max description length
    return (
        <TextLanguageFieldset title={t('Description')}
                              items={draft.description}
                              add={() => dispatch({
                                  action: 'description_add'})}
                              remove={(index) => dispatch({
                                  action: 'description_remove',
                                  data: index})}
                              handleText={(index, text) => dispatch({
                                  action: 'description_text',
                                  data: {index, text}})}
                              handleLang={(index, lang) => dispatch({
                                  action: 'description_lang',
                                  data: {index, lang}})}
                              size = {{cols: 65, rows: 4}}
                              errorMessages={draft.errors?.description}
                              maxLength={subsetDraft.maxLengthDescription}
        />
    );
};