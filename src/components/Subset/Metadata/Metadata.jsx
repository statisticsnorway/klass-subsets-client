import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { JsonView } from '../../JsonView';
import { HtmlView } from './HtmlView';
import { Tabs, Tab, Title, Help } from '../../../components';

export const Metadata = ({
                             edit = () => {},
                             save = () => {},
                             subset = {}
                         }) => {
    const { t } = useTranslation();
    const [ showHelp, setShowHelp ] = useState(false);

    return (
        <>
            <Title text='Metadata'
                   edit={ edit }
                   save={ save }
                   help={ () => setShowHelp(prev => !prev)}
                   download
            />

            <Help visible={ showHelp }>
                <p>{ t('Metadata info') }.</p>
                <p>{ t('Subset validity period info') }.</p>
                <p>{ t('Owning section info') }.</p>
            </Help>

            <Tabs light>
                <Tab title='HTML' path='html'>
                    <HtmlView subset={ subset } />
                </Tab>
                <Tab title='JSON' path='json'>
                    <JsonView data={ subset.payload || subset } />
                </Tab>
            </Tabs>
    </>);
};

