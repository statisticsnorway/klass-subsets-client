import React from 'react';
import { DownloadButton } from '../DownloadButton';
import { EditButton } from '../EditButton';
import { Tab, Tabs } from '../Tabs';
import { JsonView } from './JsonView';
import { useTranslation } from 'react-i18next';
import { Brief } from './Brief';
import { Id } from './Id';
import { VersionHtmlView } from './VersionHtmlView';

export const Version = ({
                            edit = () => {},
                            data = {}
}) => {
    const { t } = useTranslation();

    return (
        <>
            <h2>{ t('Version') } { t(data.validFrom) }
                <DownloadButton title={ t('Download') }/>

                { edit && <EditButton
                    title={ t('Edit metadata') }
                    clickHandler={ edit }
                />}
            </h2>
            <Brief
                id={ <Id>{ data.version || '-' }</Id> }
                versionValidFrom={ data.validFrom }
                lastModified={ data.lastModified }
                status={ data.administrativeStatus }
            />

            <Tabs light>
                <Tab title='HTML' path='html'>
                    <VersionHtmlView version={ data } />
                </Tab>
                <Tab title='JSON' path='json'>
                    <JsonView data={ data } />
                </Tab>
            </Tabs>
        </>
    );
}