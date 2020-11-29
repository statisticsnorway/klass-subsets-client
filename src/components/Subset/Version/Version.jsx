import React from 'react';
import { DownloadButton } from '../../DownloadButton';
import { EditButton } from '../../EditButton';
import { Tab, Tabs } from '../../Tabs';
import { JsonView } from '../../JsonView';
import { useTranslation } from 'react-i18next';
import {Brief as BriefVersion, Brief} from '../../Subset/Version';
import { HtmlView } from './HtmlView';

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
                id={ data.version }
                lastModified={ data.lastModified }
                created={ data.createdDate }
                validFrom={ data.validFrom }
                validUntil={ data.validUntil }
                status={ data.administrativeStatus }
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