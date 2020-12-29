import React from 'react';
import { useTranslation } from 'react-i18next';
import { Tab, Tabs, JsonView, EditButton, SaveButton, UploadButton } from 'components';
import { BriefVersion, HtmlView } from '../Version';

export const Version = ({
                            data = {},
                            edit = () => {},
                            save = () => {},
                            publish = () => {}
}) => {
    const { t } = useTranslation();
    return (
        <>
            <h2>{ t('Version') } { t(data.validFrom) }
                { edit && <EditButton
                    title={ t('Edit version') }
                    clickHandler={ edit }
                />}

                { save && <SaveButton
                    title={ t('Save version') }
                    clickHandler={ save }
                />}

                { publish && <UploadButton
                    title={ t('Publish version') }
                    clickHandler={ publish }
                />}
            </h2>
            <BriefVersion
                id={ data?.versionId }
                lastModified={ data?.lastModified }
                created={ data?.createdDate }
                validFrom={ data?.validFrom }
                validUntil={ data?.validUntil }
                status={ data?.administrativeStatus }
                toBeSaved={ false }
                codes={ data?.codes?.length }
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