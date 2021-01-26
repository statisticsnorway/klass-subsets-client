import React from 'react';
import { useTranslation } from 'react-i18next';
import { Tab, Tabs, JsonView, EditButton, SaveButton, UploadButton } from 'components';
import { BriefVersion, HtmlView } from '../Version';
import { useQuery } from 'utils';

export const Version = ({
                            version = {},
                            edit = () => {},
                            save = () => {},
                            publish = () => {}
}) => {
    const { t } = useTranslation();
    let query = useQuery();

    return (
        <>
            <h2>{ t('Version') } { t(version?.validFrom) }
                <EditButton
                    title={ t('Edit version') }
                    clickHandler={ () => edit(version?.versionId) }
                    visible={ edit }
                />

                <SaveButton
                    title={ t('Save version') }
                    clickHandler={ () => save(query.toString()) }
                    visible={ save }
                />

                <UploadButton
                    title={ t('Publish version') }
                    clickHandler={ () => publish(query.toString()) }
                    visible={ publish }
                />
            </h2>
            <BriefVersion
                id={ version?.versionId }
                lastModified={ version?.lastModified }
                created={ version?.createdDate }
                validFrom={ version?.validFrom }
                validUntil={ version?.validUntil }
                status={ version?.administrativeStatus }
                toBeSaved={ false }
                codes={ version?.codes?.length }
            />

            <Tabs light>
                <Tab title='HTML' path='html'>
                    <HtmlView version={ version } />
                </Tab>
                <Tab title='JSON' path='json'>
                    <JsonView data={ version } />
                </Tab>
            </Tabs>
        </>
    );
}