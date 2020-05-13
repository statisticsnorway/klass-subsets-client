import React from 'react';
import '../../css/pages.css';
import {Title, Paragraph} from '@statisticsnorway/ssb-component-library';
import {useTranslation} from 'react-i18next';
import {Edit} from 'react-feather';

export default function WelcomePage() {
   const {t} = useTranslation();

   return (
       <div className='page'>
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

           <Title size={4}>v0.3.1</Title>
                <Paragraph>Corrected copyright year and footer styling.</Paragraph>

           <Title size={4}>v0.3.0</Title>
               <Paragraph>Draft editing feature. To test: choose a subset, click on <Edit
                   style={{color: '#ED5935', margin: '0 10px'}}/> icon in the title.</Paragraph>
               <Paragraph>Internal app structure adjusted to Classification Subset's GSIM schema.</Paragraph>
               <Paragraph>Simplified code list search results rendering. Prepared to let subsets be a part of search results.</Paragraph>
               <Paragraph>Data typed in input fields and code changes are backed up in session storage.</Paragraph>
               <Paragraph>Classification ID column with content on "Reorder codes" form step.</Paragraph>
               <Paragraph>Code list versions are sorted on "Choose codes" form step in code list info's panel.</Paragraph>
               <Paragraph>Scroll bar when too many codes in a code list.</Paragraph>
               <Paragraph>Removed "reverse" button from code's check list.</Paragraph>
               <Paragraph>Rearranged code list control buttons on "Choose codes" form step.</Paragraph>
               <Paragraph>Subset status label on "Metadata" form step.</Paragraph>
               <Paragraph>Bug fixes.</Paragraph>

           <Title size={4}>v0.2.5</Title>
               <Paragraph>Standard javascript date picker.</Paragraph>
               <Paragraph>Code info and notes on subset page.</Paragraph>
               <Paragraph>Scroll to top when "next" or "previous" button is clicked.</Paragraph>
               <Paragraph>Load large lists of codes faster.</Paragraph>

           <Title size={4}>v0.2.4</Title>
                <Paragraph>Better codes and notes fetching</Paragraph>

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
        </div>
   );
}