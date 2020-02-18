import React from 'react';
import '../../css/pages.css';
import {Title, Text} from '@statisticsnorway/ssb-component-library';
import {useTranslation} from 'react-i18next';

export default function WelcomePage() {

    const { t, i18n } = useTranslation();

    return (
        <div className='page'>
            <Title size={2}>Feedback</Title>
            <h1>{t('Welcome to React')}</h1>

            <Text><p>The application is under development.</p>
            <p>You can report an issue or suggest an improvement here <a
                className='App-link'
                href='https://github.com/statisticsnorway/klass-subsets-web/issues'
                target='_blank'
                rel='noopener noreferrer'
            >Issues</a>
            </p></Text>
            <Title size={2}>Source code</Title>
            <Text><p>You can find the source code on <a
                className='App-link'
                href='https://github.com/statisticsnorway/klass-subsets-web'
                target='_blank'
                rel='noopener noreferrer'
            >GitHub repository</a></p>
            </Text>
        </div>
    );
}