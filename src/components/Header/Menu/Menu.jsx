import React from 'react';
import { NavLink } from 'react-router-dom';
import { Menu as MenuIcon } from 'react-feather';
import './menu.css';

export const Menu = ({ items = [] }) => {
    return (
        <nav id='Menu'>
            <label htmlFor='toggle'><MenuIcon /></label>
            <input type='checkbox' id='toggle' name='toggle' alt='menu' />

            <div id='MenuItems'>
                { items.map(i => <MenuItem
                    key={ i.title }
                    title={ i.title }
                    path={ i.path }
                    onClick={ i.clickHandler }
                />) }
            </div>
        </nav>
    );
}

export const MenuItem = ({
                             title = 'Choice',
                             path='',
                             onClick = () => {}
}) => {
    return (
        <div className='MenuItem h3' onClick={ onClick }>
            <NavLink
                to={ path }
                className={({ isActive }) => "" + (isActive ? " active" : "")}
                end={ true }
            >{ title }
            </NavLink>
        </div>
    )
}