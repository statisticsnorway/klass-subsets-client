import React from 'react';
import '../../css/pages.css';
import {Input, Dropdown} from '@statisticsnorway/ssb-component-library';
import {useTranslation} from 'react-i18next';
import {useGet} from '../../controllers/subsets-service';
import {Subsets} from '../Subset';

export default function SearchSubsetsPage() {

    const { t } = useTranslation();
    const [subsets] = useGet('');

    return (
        <div className='page'>
            <h3>{t('Search subsets')}</h3>
            <Input
                ariaLabel={t('Search subsets')}
                placeholder={t('Subset title')}
                searchField
            />
            <h3>{t('Search results')}</h3>
            <Dropdown
                header={t('Sort by')}
                selectedItem={{ title: t('Last updated'), id: 'Last' }}
                items={[
                    { title: t('Last updated'), id: 'last' },
                    { title: t('Name'), id: 'name' },
                    { title: t('Owner'), id: 'owner' },
                    { title: t('Valid to'), id: 'validto' },
                ]}
            />
            {!subsets
                ? <p>{t('Loading...')}</p>
                : <Subsets items={subsets
                    .sort((a,b) => (a.lastUpdatedDate === b.lastUpdatedDate ? 0
                    : a.lastUpdatedDate > b.lastUpdatedDate ? -1 : 1))} />}
        </div>
    );
}