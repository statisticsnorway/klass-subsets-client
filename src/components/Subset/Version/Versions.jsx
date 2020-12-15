import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Version, Switcher } from '../Version';
import { CheckboxGroup } from '@statisticsnorway/ssb-component-library';
import { orderByValidFromDesc } from '../../../utils/arrays';
import { Title } from '../../../components';

export const Versions = ({ data = [], edit = () => {}, save = () => {}}) => {
    const { t } = useTranslation();

    const [ version, setVersion ] = useState( data[0]
        //orderByValidFromDesc(versions
        //.filter(v => v.administrativStatus != 'OPEN')
        //.filter(v => v.validFrom > new Date().toJSON()))[0] || null
    );

    return (
        <>
            <Title text={ t('Versions') } tag='h2' edit={edit} />

            <p className='small'>{ t('Version info') }.</p>

            <Switcher versions={ data }
                      onSelect={ option => setVersion(option) }
                      selected={ version }
            />

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

            { version
                ? <Version data={ version } edit save={ save } />
                : <p>{ t('No published versions') }.</p>
            }

        </>
    );
};

