import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory, useParams } from 'react-router-dom';
import { useGet } from '../../controllers/subsets-service';
import { AppContext } from '../../controllers/context';
import Spinner from '../Spinner';
import '../../css/container.css';
import { SubsetPreview } from '../Subset';

export const SubsetPage = () => {
    const { t } = useTranslation();

    let { id, version } = useParams();
    let history = useHistory();
    const { subset } = useContext(AppContext);

    const [ subsetData, isLoadingSubsetData ] = useGet(version
        ? `${id}/versions/${version}`
        : id);

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
                        : <SubsetPreview subset={ subsetData }
                                         edit={() => {
                                             subset.dispatch({action: 'edit', data: subset});
                                             history.push('/create');
                                         }}
                        />
                }
            </div>
        </div>
    );
};