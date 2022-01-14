import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useQuery } from 'utils';
import { ProgressBar, GoTo } from 'components';

export function Navigation({ children }) {
    const { t } = useTranslation();
    let query = useQuery();
    let navigate = useNavigate();
    const [ step, setStep ] = useState(0);

    useEffect( () => {
        if (!children.find(c => c.props.label === query.get('step'))) {
            navigate(`?${ query.update('step', children[0]?.props.label) }`);
        }
    }, [ children, navigate, query ]);

    useEffect(() => {
        setStep(children.findIndex(c => c.props.label === query.get('step')) || 0);
    }, [ children, query ]);

    return (<>
            <ProgressBar steps={ children } />
            <div>{
                children.find(c => c.props.label === query.get('step'))
                || children[0]
            }</div>
            <div style={{ textAlign: 'center', paddingBottom: '30px' }}>
                <GoTo disabled={ step < 1 }
                      query={`?${ query.update('step', children[step - 1]?.props.label) }`}
                      iconLeft='&#10094;'
                >{ t('Previous') }
                </GoTo>
                <GoTo disabled={ step > children.length - 2 }
                      query={`?${ query.update('step', children[step + 1]?.props.label) }`}
                      iconRight='&#10095;'
                >{ t('Next') }
                </GoTo>
            </div>
        </>
    );
}
