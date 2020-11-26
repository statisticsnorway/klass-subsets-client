import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Version, VersionSwitcher } from '../Subset';
import { CheckboxGroup } from '@statisticsnorway/ssb-component-library';
import { orderByValidFromDesc } from '../../utils/arrays';


export const Versions = ({ data = []}) => {
    const { t } = useTranslation();

    const [ version, setVersion ] = useState( data[0]
        //orderByValidFromDesc(versions
        //.filter(v => v.administrativStatus != 'OPEN')
        //.filter(v => v.validFrom > new Date().toJSON()))[0] || null
    );

    return (
        <>
            <h2>{ t('Versions') } </h2>

            <p>{ t('Metadata info') }.</p>
            <p>{ t('Subset validity period info') }.</p>
            <p>{ t('Owning section info') }.</p>

            <VersionSwitcher versions={ data } onSelect={ (option) => setVersion(option)}/>

            <CheckboxGroup
                header={ t('Filters') }
                onChange={() => {}}
                orientation='column'
                selectedValue='includeFuture'
                items={[
                    { label: 'includeFuture', value: 'includeFuture' },
                    { label: 'includeDrafts', value: 'includeDrafts' },
                    { label: 'includeDeprecated', value: 'includeDeprecated' }
                ]}
            />

            {version
                ? <Version data={ version }/>
                : <p>{ t('No published versions') }.</p>
            }

        </>
    );
};

