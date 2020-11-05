import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, NavLink, useHistory } from 'react-router-dom';
import { useQuery } from '../../utils/useQuery';

export function Navigation({ children }) {
    const { t } = useTranslation();
    let query = useQuery();
    let history = useHistory();
    const [ step, setStep ] = useState(0);

    useEffect(() => {
        setStep(children.findIndex(c => c.props.label === query.get('step')) || 0);
    }, [ query ]);

    useEffect( () => {
        if (!children.find(c => c.props.label === query.get('step'))) {
            history.push(`?step=${children[0]?.props.label}`);
        }
    }, []);

    return (<>
            <ProgressBar steps={ children } />
            <div>{
                children.find(c => c.props.label === query.get('step'))
                || children[0]
            }</div>
            <div style={{ textAlign: 'center', paddingBottom: '30px' }}>
                    <GoTo disabled={ step < 1 }
                          query={`?step=${children[step - 1]?.props.label}`}
                          iconLeft='&#10094;'
                    >{ t('Previous') }
                    </GoTo>
                    <GoTo disabled={ step > children.length - 2 }
                          query={`?step=${children[step + 1]?.props.label}`}
                          iconRight='&#10095;'
                    >{ t('Next') }
                    </GoTo>
            </div>
        </>
    );
}

export const Step = ({ label, component }) => {
    return (<>{component()}</>);
};

export const ProgressBar = ({ steps }) => {
    let query = useQuery();

    return (
        <div style={{ textAlign: 'center', paddingBottom: '30px' }}>
            { steps.map(step => (
                <div key={ step.props.label }
                     style={{ display: 'inline-block' }}
                >
                    <NavLink to={`?step=${step.props.label}`}
                             area-current='step'
                             className='ssb-link profiled'
                             activeStyle={{ color: 'black', textDecoration: 'none'}}
                             activeClassName='link-text with-icon profiled'
                             isActive={() => query.get('step') === step.props.label }
                        >{ step.props.label }
                    </NavLink>
                    <span style={{ color: '#1A9D49', padding: '10px' }}>&#10095;</span>
                </div>
            ))}
        </div>
    );
};

export const GoTo = ({ query = '', disabled, iconLeft, iconRight, children }) => {
    return (<>{
        !disabled &&
            <>
                <span style={{color: '#1A9D49', padding: '10px'}}>{iconLeft}</span>
                <Link to={query}
                      area-labal='step the form'
                      className='ssb-link'
                    >{children}
                </Link>
                <span style={{color: '#1A9D49', padding: '10px'}}>{iconRight}</span>
        </>
    }
    </>);
};
