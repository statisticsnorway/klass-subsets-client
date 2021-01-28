import React from 'react';
import { Divider } from '@statisticsnorway/ssb-component-library';
import { useTranslation } from 'react-i18next';
import { LanguageSwitch } from './LanguageSwitch';
import { Menu, Logo, AppTitle } from '../Header';
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
                    path: '/subsets'},
                {
                    title: t('Create subset'),
                    path: '/editor',
                    clickHandler: () => sessionStorage.removeItem('draft')},
                {
                    title: t('Changelog'),
                    path: '/changelog'},
            ]}/>
        </header>
    <Divider/>
    </>
);
}