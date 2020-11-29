import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Version, Switcher } from '../Version';
import { CheckboxGroup } from '@statisticsnorway/ssb-component-library';
import { orderByValidFromDesc } from '../../../utils/arrays';
import { EditButton, DownloadButton } from '../../Buttons';

export const Versions = ({ data = [], edit = () => {}}) => {
    const { t } = useTranslation();

    const [ version, setVersion ] = useState( data[0]
        //orderByValidFromDesc(versions
        //.filter(v => v.administrativStatus != 'OPEN')
        //.filter(v => v.validFrom > new Date().toJSON()))[0] || null
    );

    return (
        <>
            <h2>{ t('Versions') }
                <DownloadButton title={ t('Download') }/>

                { edit && <EditButton
                    title={ t('Edit metadata') }
                    clickHandler={ edit }
                />}
            </h2>

            <p>{ t('Version info') }.</p>

            <Switcher versions={ data } onSelect={ (option) => setVersion(option)}/>

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

