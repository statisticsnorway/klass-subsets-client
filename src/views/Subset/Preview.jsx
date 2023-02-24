import React from 'react';
import { Metadata, Versions } from 'views';
import { Title } from 'components';
import { Subset } from 'models';
import { useNavigate } from 'react-router-dom';

export const Preview = ({ data,
                          edit = false,
                          save = false,
                          publish = false,
                          syncParams = false,
                          syncQuery = false
}) => {
    const subset = new Subset(data);
    let navigate = useNavigate();

    // TODO: use simple Links instead of buttons
    const editMetadata = () => navigate(`/auth/editor?step=Metadata&subsetId=${ data?.id }`);
    const editVersion = (versionId) => navigate(`/auth/editor?step=Versions&subsetId=${ data?.id }&versionId=${ versionId }`);
    const saveMetadata = (query) => navigate(`/auth/save?metadata=true&${ query }`);
    const saveVersion = (query) => navigate(`/auth/save?version=true&${ query }`);
    const publishVersion = (query) => navigate(`/auth/save?version=true&publish=true&${ query }`);

    return (
        <>
            <Title translates={ subset?.name } tag='h1'/>

            <Metadata edit={ edit ? editMetadata : null }
                      save={ save ? saveMetadata : null }
                      subset={ data }/>
            <Versions edit={ edit ? editVersion : null }
                      save={ save && !subset.isNew() ? saveVersion : null }
                      publish={ publish && !subset.isNew() ? publishVersion : null }
                      versions={ data?.versions }
                      current={ data.versionId }
                      syncParams={ syncParams }
                      syncQuery={ syncQuery }
            />
        </>
    );
};
