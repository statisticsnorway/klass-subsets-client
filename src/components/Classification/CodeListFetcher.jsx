import React, { useContext } from 'react';
import { URL, useSWRGet} from '../../controllers/klass-api';
import { AppContext } from '../../controllers/context';
import { CodeList } from './CodeList';

export const CodeListFetcher = ({ item: { id }}) => {
    const { subset:
        { draft: {
            versionValidFrom,
            versionValidUntil
        }}
    } = useContext(AppContext);

    const { url, codesUrl } = URL.toClassificationURL(
        id,
        versionValidFrom,
        versionValidUntil
    );

    // TODO: setup NO RETRY when failed
    const [ metadata, metadataError ] = useSWRGet(url);
    const [ codes, codesError ] = useSWRGet(codesUrl);

    return (
            <CodeList
                id={ id }
                codes={{
                    isLoading: !codesError && !codes,
                    ...codes
                }}
                metadata={{
                        isLoading: !metadataError && !metadata,
                        ...metadata
                    }}
                errors={ {metadataError, codesError} }
            />
    )
};
