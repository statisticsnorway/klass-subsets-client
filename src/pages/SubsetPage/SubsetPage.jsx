import React from 'react';
import { useParams } from 'react-router-dom';
import { useSubset } from 'controllers/subsets-api';
import {Spinner, Warning} from 'components';
import './container.css';
import { Preview } from 'views';

export const SubsetPage = () => {
    let { id, version } = useParams();
    const [ subset, error ] = useSubset(id);

    return(
        <div className='container'>
            <div className='content'>
                { !subset && !error &&
                    <div style={{ margin: 'auto', width: '20%' }}><Spinner/></div>
                }
                { error &&
                    <Warning visible={ error }
                             title='Fetch failed'>
                        { error.message }
                        { error.info }
                    </Warning>
                }
                { subset && <Preview
                    data={ subset }
                    current={ version }
                    edit
                    syncParams
                />
                }
            </div>
        </div>
    );
};