import React from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { useGet } from 'controllers/subsets-api';
import { Spinner } from 'components';
import './container.css';
import { Preview } from 'views';

export const SubsetPage = () => {
    const { t } = useTranslation();
    let { id, version } = useParams();
    const [ subset, isLoadingSubset ] = useGet(id);

    return(
        <div className='container'>
            <div className='content'>
                { isLoadingSubset
                    ? <div style={{ margin: 'auto', width: '20%' }}><Spinner/></div>
                    : !subset
                        ? <p>{ version
                            ? t('Subset version for subset with id does not exist', { version, id })
                            : t('Subset with id does not exist', { id }) }.
                          </p>
                        : <Preview data={ subset } edit />
                }
            </div>
        </div>
    );
};