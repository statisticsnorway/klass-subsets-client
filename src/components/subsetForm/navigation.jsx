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
            <GoTo disabled={ step < 1 }
                  query={`?step=${children[step - 1]?.props.label}`}
                >{ t('Previous') }
            </GoTo>
            <GoTo disabled={ step > children.length - 1 }
                  query={`?step=${children[step + 1]?.props.label}`}
                >{ t('Next') }
            </GoTo>
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
                             className='ssb-link'
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

export const GoTo = ({ query = '', disabled, children }) => {
    return (<>{
        !disabled &&
        <Link to={query}
            area-labal='step the form'
        >{ children }</Link>}
    </>);
};
