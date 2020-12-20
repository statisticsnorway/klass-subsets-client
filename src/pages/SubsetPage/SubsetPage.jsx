import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory, useParams } from 'react-router-dom';
import { useGet } from 'controllers/subsets-service';
import { AppContext } from 'controllers/';
import { Spinner } from 'components';
import './container.css';
import { Preview } from 'components/Subset';

export const SubsetPage = () => {
    const { t } = useTranslation();

    let { id, version } = useParams();
    let history = useHistory();
    const { subset: { dispatch } } = useContext(AppContext);

    const [ subsetData, isLoadingSubsetData ] = useGet(id);

    return(
        <div className='container'>
            <div className='content'>
                { isLoadingSubsetData
                    ? <div style={{ margin: 'auto', width: '20%' }}><Spinner/></div>
                    : !subsetData
                        ? <p>{ version
                            ? t('Subset version for subset with id does not exist', { version, id })
                            : t('Subset with id does not exist', { id }) }.
                          </p>
                        : <Preview data={ subsetData }
                                   edit={() => {
                                             dispatch({
                                                 action: 'edit',
                                                 data: subsetData});
                                             history.push('/create');
                                         }}
                        />
                }
            </div>
        </div>
    );
};