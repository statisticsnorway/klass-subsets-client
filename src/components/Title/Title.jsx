import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { GlobeButton } from '../GlobeButton';
import { languages as defaultLanguages } from '../../defaults';

export const Title = ({
                          texts = [],
                          translatable = false,
                          ...props
}) => {
    const { t } = useTranslation();
    const [ langIndex, setLangIndex ] = useState(0);
    const languages = defaultLanguages.filter(l => l.draft);

    return (
        <div className={ props.className }>{ texts?.find(desc =>
            desc.languageCode === languages[langIndex].languageCode)?.languageText
        ||
        <span style={{ color: 'red'}}>{
            t('No name in this language') }: { languages[langIndex].full }</span> }
            { translatable &&
                <GlobeButton
                    title={t('Toggle language')}
                    clickHandler={() => setLangIndex((langIndex + 1) % languages.length)}
                />
            }
        </div>
    );
};