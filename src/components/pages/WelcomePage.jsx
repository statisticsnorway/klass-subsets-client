import React from 'react';
//import '../../css/pages.css';
import {Title, Paragraph} from '@statisticsnorway/ssb-component-library';
import {useTranslation} from 'react-i18next';

export default function WelcomePage() {
   const {t} = useTranslation();

   return (
       <>
           <Title size={2}>{t('Feedback')}</Title>

           <Paragraph>{t('The application is under development.')}</Paragraph>
           <Paragraph>{t('You can report an issue or suggest an improvement here')} <a
                className='App-link'
                href='https://github.com/statisticsnorway/klass-subsets-web/issues'
                target='_blank'
                rel='noopener noreferrer'
           >{t('Issues')}</a>
           </Paragraph>

           <Title size={2}>{t('Changelog')}</Title>

           <Title size={4}>v0.2.5</Title>
               <Paragraph>{t('Standard javascript date picker')}</Paragraph>
               <Paragraph>{t('Code info and notes on subset page')}</Paragraph>
               <Paragraph>{t('Scroll to top when next or prev clicked')}</Paragraph>
               <Paragraph>{t('Load large lists of codes faster')}</Paragraph>

           <Title size={4}>v0.2.4</Title>
                <Paragraph>{t('Better codes and notes fetching')}</Paragraph>

           <Title size={4}>v0.2.3</Title>
               <Paragraph>{t('Parentheses in search field are allowed')}</Paragraph>
               <Paragraph>{t('HTML tags in code notes are interpreted')}</Paragraph>
               <Paragraph>{t('Search suggestions are shown with a scroll bar')}</Paragraph>
               <Paragraph>{t('Column headers on the code reordering form step')}</Paragraph>
               <Paragraph>{t('Footer implemented')}</Paragraph>
               <Paragraph>{t('Overall styling fixes')}</Paragraph>

           <Title size={4}>v0.2.2</Title>
               <Paragraph>{t('Adopted ClassificationSubsets schema')}</Paragraph>
               <Paragraph>{t('Changelog')}</Paragraph>
               <Paragraph>{t('Search subsets')}</Paragraph>
               <Paragraph>{t('Moved config to the platform')}</Paragraph>
               <Paragraph>{t('Depends on subsets-service v0.2.4 or later')}</Paragraph>

           <Title size={4}>v0.2.1</Title>
               <Paragraph>/be/subsets-service/ {t('and')} React v16.13.0</Paragraph>

           <Title size={4}>v0.2.0</Title>
               <Paragraph>{t('Authorization and subset-service integration')}</Paragraph>
        </>
   );
}