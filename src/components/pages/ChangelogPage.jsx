import React from 'react';
import '../../css/pages.css';
import {Title, Paragraph} from '@statisticsnorway/ssb-component-library';
import {useTranslation} from 'react-i18next';
import {Edit, HelpCircle, MessageSquare, Repeat, RefreshCw} from 'react-feather';
import Spinner from "../Spinner";

export default function ChangelogPage() {
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

           <Title size={4}>v0.4.3</Title>
           <Paragraph>Fixed empty <code>validUntil</code> and <code>createdDate</code> in order to save and publish subsets.</Paragraph>
           <Paragraph>The right service used for search from with no until date.</Paragraph>
           <Paragraph>Adjusted to receive subset version as an integer, not a string as before.</Paragraph>

           <Title size={4}>v0.4.2</Title>
           <Paragraph>Use major version number only.</Paragraph>
           <Paragraph>Short name fix.</Paragraph>

           <Title size={4}>v0.4.1</Title>
           <Paragraph>Better error message on failed saving or publishing.</Paragraph>
           <Paragraph>Visible ID setting while typing the very first name.</Paragraph>
           <Paragraph>Version valid from date is now dependent on valid from date.</Paragraph>

           <Title size={4}>v0.4.0</Title>
           <Paragraph>A version form step to create, view, and update versions.</Paragraph>
           <Paragraph>Save button.</Paragraph>
           <Paragraph>Fixed a major security issue by updating dependencies.</Paragraph>

           <Title size={4}>v0.3.4</Title>
           <Paragraph>Bugfix: some codes could not show its name.</Paragraph>
           <Paragraph>Reorder: show codes in a scrollbar window.</Paragraph>
           <Paragraph><em>/changelog</em>  instead of <em>/about</em>.</Paragraph>

           <Title size={4}>v0.3.3</Title>
           <Paragraph>Form validation:
               <ul>
                   <li>each form field individually (TEST: try to set same date in <code>valid from</code> and <code>valid to</code> fields. Or try to set <code>valid to</code> earlier than <code>valid from</code>. A warning will be displayed under the field.)</li>
                   <li>whole form before publishing (TEST: let <code>name</code> or <code>Owner</code> fields be empty and go to "Publish" form step -- Publish button should be disabled and Form errors summary is shown.)</li>
               </ul>
           </Paragraph>
           <Paragraph>Limited name length to 250 symbols.</Paragraph>
           <Paragraph>Corrected field name for <code>valid to</code> field to be exclusive.</Paragraph>
           <Paragraph>Navigation between code lists in search results by using <code>UP</code> and <code>DOWN</code> on "Choose classification" form step.</Paragraph>
           <Paragraph>Retry button <RefreshCw size='20' color='#62919A'/> for code lists in search result to repeat Klass API call to retrieve codes and metadata.</Paragraph>
           <Paragraph>Reorder button <Repeat color='#62919A'/> works properly now.</Paragraph>
           <Paragraph>No scrolling to page bottom, when selecting codes with <code>SPACE</code>.</Paragraph>
           <Paragraph><code>ESC</code> in rank input field to reset rank.</Paragraph>
           <Paragraph><code>ESC</code> on table to unselect all selected codes.</Paragraph>
           <Paragraph>Some styles are corrected:
               <ul>
                   <li><Spinner /> when loading data from services.</li>
                   <li>Notes icon <MessageSquare color='#62919A' /></li>
                   <li>Date inputs</li>
                   <li>Highlight rows and list items on mouse over</li>
                   <li>etc.</li>
               </ul>
           </Paragraph>

           <Title size={4}>v0.3.2</Title>
               <Paragraph>Updated reorder codes form step:
                   <ul>
                       <li>better edge case for drag and drop;</li>
                       <li>keyboard controls for moving items (<code>SPACE</code>, <code>ESC</code>, <code>UP</code>, <code>DOWN</code>, <code>CTRL</code>+<code>UP</code>, <code>CTRL</code>+<code>DOWN</code>);</li>
                       <li>better input field control (button and <code>ENTER</code>);</li>
                       <li>highlighting of updated items;</li>
                       <li>fixed item deleting (was broken in v0.3);</li>
                       <li>list item focus (<code>TAB</code>, <code>UP</code>, <code>DOWN</code>);</li>
                       <li>more detailed help note <HelpCircle color='#2D6975'/>;</li>
                       <li>arrow to move an item one step up or down.</li>
                   </ul>
               </Paragraph>
               <Paragraph>Fixed date picker reset button (KF-336).</Paragraph>
               <Paragraph>Fixed classification search result confusion (KF-336).</Paragraph>
               <Paragraph>Fixed code check box confusion (KF-336).</Paragraph>
               <Paragraph>Fixed session storage reset when "Create a subset" is clicked (KF-336).</Paragraph>


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