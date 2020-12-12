import React from 'react';
import { DownloadButton, EditButton, SaveButton } from '../../Buttons';
import { Tab, Tabs } from '../../Tabs';
import { JsonView } from '../../JsonView';
import { useTranslation } from 'react-i18next';
import { Brief } from './Brief';
import { HtmlView } from './HtmlView';

export const Version = ({
                            edit = () => {},
                            data = {},
                            save = false
}) => {
    const { t } = useTranslation();

    return (
        <>
            <h2>{ t('Version') } { t(data.validFrom) }
                <DownloadButton title={ t('Download') }/>

                { edit && <EditButton
                    title={ t('Edit version') }
                    clickHandler={ edit }
                />}

                { save && <SaveButton
                    title={ t('Save version') }
                    clickHandler={ edit }
                />}
            </h2>
            <Brief
                id={ data.version }
                lastModified={ data.lastModified }
                created={ data.createdDate }
                validFrom={ data.validFrom }
                validUntil={ data.validUntil }
                status={ data.administrativeStatus }
                toBeSaved={ data?.versionRationale[0]?.languageText?.endsWith('111') }
            />

            <Tabs light>
                <Tab title='HTML' path='html'>
                    <HtmlView version={ data } />
                </Tab>
                <Tab title='JSON' path='json'>
                    <JsonView data={ data } />
                </Tab>
            </Tabs>
        </>
    );
}