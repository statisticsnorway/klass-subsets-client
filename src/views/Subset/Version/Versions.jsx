import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Version, Switcher } from 'views';
import { CheckboxGroup } from '@statisticsnorway/ssb-component-library';
import { orderByValidFromDesc } from 'utils';
import { Help, Title } from 'components';

export const Versions = ({ data = [],
                           edit = () => {},
                           save = () => {},
                           publish = () => {},
                           current = ''
}) => {
    const { t } = useTranslation();

    const [ version, setVersion ] = useState(
        data?.find(v => v.versionId === current)
        //orderByValidFromDesc(versions
        //.filter(v => v.administrativStatus != 'OPEN')
        //.filter(v => v.validFrom > new Date().toJSON()))[0] || null
    );
    const [ showHelp, setShowHelp ] = useState(false);


    return (
        <>
            <Title text={ t('Versions') }
                   tag='h2'
                   help={ () => setShowHelp( prev => !prev) }
            />

            <Help visible={ showHelp }>
                <p>{ t('Version info') }.</p>
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
            </Help>

            <Switcher versions={ data }
                      onSelect={ option => setVersion(option) }
                      selected={ version }
            />

            { version &&
                <Version data={ version }
                           edit={ edit }
                           save={ save }
                           publish={ publish }
                />
            }

        </>
    );
};

