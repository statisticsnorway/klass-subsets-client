import React from 'react';
import { useTranslation } from 'react-i18next';
import { JsonView } from '../../JsonView';
import { HtmlView } from './HtmlView';
import { Tabs, Tab } from '../../Tabs';
import { Title } from '../../Title';

export const Metadata = ({
                             edit = () => {},
                            save,
                             subset = {}
                         }) => {
    const { t } = useTranslation();

    return (
        <>
            <Title text='Metadata' edit={ edit } save={ save } download />
            <p className='small'>{ t('Metadata info') }.</p>
            <p className='small'>{ t('Subset validity period info') }.</p>
            <p className='small'>{ t('Owning section info') }.</p>
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

