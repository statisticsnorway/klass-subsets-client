import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { DownloadButton, EditButton, GlobeButton } from '../Buttons';
import { languages as defaultLanguages } from '../../defaults';
import { Tag } from '../HtmlTag';

// TESTME: if no text, if no translates..., if translates does not match default languages
export const Title = ({
                          text = '',
                          translates = [],
                          download = null,
                          edit = null,
                          tag = 'h2'
                      }) => {

    const { t } = useTranslation();
    const [ langIndex, setLangIndex ] = useState(0);
    const languages = defaultLanguages.filter(l => l.draft);


    return (
        <Tag html={ tag }>{ text && t(text) }

            { translates?.length > 0 &&
                <><span> {
                    translates?.find(desc =>
                        desc.languageCode === languages[langIndex].languageCode)?.languageText
                        || <span style={{color: 'red'}}>{
                                t('No name in this language')}: {languages[langIndex].full
                            }
                           </span>
                    }
                </span>
                    <GlobeButton
                    title={t('Toggle language')}
                    clickHandler={() => setLangIndex((langIndex + 1) % languages.length)}
                    />
                </>
            }

            { download &&
                <DownloadButton title={ t('Download') }/>
            }

            { edit && <EditButton
                title={ t('Edit metadata') }
                clickHandler={ edit }
            />}
        </Tag>
    );
};
