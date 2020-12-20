import React from 'react';
import { useQuery } from 'utils';
import { NavLink } from 'react-router-dom';

export const ProgressBar = ({ steps }) => {
    let query = useQuery();

    return (
        <div style={{ textAlign: 'center', paddingBottom: '30px' }}>
            { steps.map(step => (
                <div key={ step.props.label }
                     style={{ display: 'inline-block' }}
                >
                    <NavLink to={ `?step=${step.props.label}` }
                             area-current='step'
                             className='ssb-link profiled'
                             activeStyle={{ color: 'black', textDecoration: 'none'}}
                             activeClassName='link-text with-icon profiled'
                             isActive={ () => query.get('step') === step.props.label }
                    >{ step.props.label }
                    </NavLink>
                    <span style={{ color: '#1A9D49', padding: '10px' }}>&#10095;</span>
                </div>
            ))}
        </div>
    );
};