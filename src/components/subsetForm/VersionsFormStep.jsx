import React from 'react';
import '../../css/form.css';
import {useTranslation} from 'react-i18next';
import {Title, Paragraph} from '@statisticsnorway/ssb-component-library';

/*
 *  TODO: select components (2) from the ssb-component-library
 *  TODO: textarea styled as input text in the ssb-component-library
 *  FIXME: sanitize input
 */

export const VersionsFormStep = ({subset}) => {

    const {draft, dispatch, errors} = subset;
    const {t} = useTranslation();

    return (
        <>
            <Title size={3}>{t('Versions')}</Title>
            <Paragraph>{draft.version}</Paragraph>
        </>
    );
};