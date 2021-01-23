import React, {useState} from 'react';
import { useTranslation } from 'react-i18next';
import { GlobeButton } from 'components';
import { languages as defaultLanguages } from 'defaults';

export const TitledBlock = ({
                          title = '',
                          texts = [],
                          translatable = false,
                          ...props
                      }) => {
    const { t } = useTranslation();
    const [ langIndex, setLangIndex ] = useState(0);
    const languages = defaultLanguages.filter(l => l.draft);

    return (
        <>
            <h3>{ t( title ) }
                <GlobeButton
                    title={ t('Toggle language')}
                    clickHandler={ () => setLangIndex( (langIndex + 1) % languages.length)}
                    props={ props }
                />
            </h3>
            <p className='lead'>{
                texts?.find(desc => desc.languageCode === languages[langIndex].languageCode)?.languageText
                ||
                <span style={{ color: 'red'}}>{
                    t('No text in this language')} { languages[langIndex].full}</span>
            }</p>
        </>
    );
};