import React from 'react';
import { useQuery } from 'utils';
import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export const ProgressBar = ({ steps }) => {
    let query = useQuery();
    const { t } = useTranslation();

    return (
        <div style={{ textAlign: 'center', paddingBottom: '30px' }}>
            { steps.map(step => (
                <div key={ step.props.label }
                     style={{ display: 'inline-block' }}
                >
                    <NavLink to={ `?${ query.update('step', step.props.label) }` }
                             area-current='step'
                             className='ssb-link profiled'
                             activeStyle={{ color: 'black', textDecoration: 'none'}}
                             activeClassName='link-text with-icon profiled'
                             isActive={ () => (query.get('step') === step.props.label) }
                    >{ t(step.props.label) }
                    </NavLink>
                    <span style={{ color: '#1A9D49', padding: '10px' }}>&#10095;</span>
                </div>
            ))}
        </div>
    );
};