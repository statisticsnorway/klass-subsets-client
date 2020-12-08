import React, {useContext } from 'react';
import { URL, useGet } from '../../controllers/klass-api';
import { AppContext } from '../../controllers/context';
import { CodeList } from './CodeList';

export const CodeListContextual = ({ item: { id }}) => {
    const { subset:
        { draft: {
            versionValidFrom,
            versionValidUntil
        }, dispatch }
    } = useContext(AppContext);

    const { path, codesPath } = URL.toClassificationURL(
        id,
        versionValidFrom,
        versionValidUntil
    );
    const [ metadata, isLoadingMetadata,,, ] = useGet(path);
    const [ codes, isLoadingCodes,,, ] = useGet(codesPath);

    return (
        <>
            <CodeList
                id={ id }
                codes={{
                    isLoading: isLoadingCodes,
                    ...codes
                }}
                metadata={{
                        isLoading: isLoadingMetadata,
                        ...metadata
                    }}
            />
        </>
    )
};
