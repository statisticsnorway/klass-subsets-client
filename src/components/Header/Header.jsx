import React from 'react';
import { Divider } from '@statisticsnorway/ssb-component-library';
import { useTranslation } from 'react-i18next';
import { LanguageSwitch } from '../LanguageSwitch';
import { Menu } from '../Menu';
import { Logo } from '../Logo';
import { AppTitle } from '../AppTitle';
import './header.css';

export const Header = () => {
    const { t } = useTranslation();

    return (
        <>
        <header>
            <Logo/>
            <AppTitle />
            <LanguageSwitch/>
            <Menu items={[
                {
                    title: t('Search subsets'),
                    path: '/search'},
                {
                    title: t('Create subset'),
                    path: '/create#new', clickHandle: () => sessionStorage.removeItem('draft')},
                {
                    title: t('Changelog'),
                    path: '/changelog'},
            ]}/>
        </header>
    <Divider/>
    </>
);
}