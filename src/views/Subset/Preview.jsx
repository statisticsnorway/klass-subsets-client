import React from 'react';
import { BriefMetadata, Metadata, Versions, SearchCodes } from 'views';
import { Tab, Tabs, Title } from 'components';
import { Subset } from 'models';
import { useHistory } from 'react-router-dom';
import {useTranslation} from "react-i18next";
import {Accordion} from "@statisticsnorway/ssb-component-library";

export const Preview = ({ data,
                          edit = false,
                          save = false,
                          publish = false,
                          syncParams = false,
                          syncQuery = false
}) => {
    const subset = new Subset(data);
    let history = useHistory();
    const { t } = useTranslation();

    // TODO: use simple Links instead of buttons
    const editMetadata = () => history.push(`/auth/editor?step=Metadata&subsetId=${ data?.id }`);
    const editVersion = (versionId) => history.push(`/auth/editor?step=Versions&subsetId=${ data?.id }&versionId=${ versionId }`);
    const saveMetadata = () => history.push(`/auth/save?metadata=true`);
    const saveVersion = () => history.push(`/auth/save?version=true`);
    const publishVersion = () => history.push(`/auth/save?version=true&publish=true`);

    return (
        <>
            <Title translates={ subset?.name } tag='h1'/>

            <Metadata edit={ edit ? editMetadata : null }
                      save={ save ? saveMetadata : null }
                      subset={ data }/>
            <Versions edit={ edit ? editVersion : null }
                      save={ save ? saveVersion : null }
                      publish={ publish ? publishVersion : null }
                      data={ data?.versions }
                      current={ data.versionId }
                      syncParams={ syncParams }
                      syncQuery={ syncQuery }
            />
        </>
    );
};
