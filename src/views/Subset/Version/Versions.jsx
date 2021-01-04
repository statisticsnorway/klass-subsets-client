import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Version, Switcher } from 'views';
import { CheckboxGroup } from '@statisticsnorway/ssb-component-library';
import { orderByValidFromDesc, useQuery } from 'utils';
import { Help, Title } from 'components';
import { useHistory, useParams } from 'react-router-dom';

// TODO: clean and simplify
export const Versions = ({ data = [],
                           edit = () => {},
                           save = () => {},
                           publish = () => {},
                            syncParams = false,
                            syncQuery = false
}) => {
    const { t } = useTranslation();
    let history = useHistory();
    let query = useQuery();
    let { versionId } = useParams();

    const [ version, setVersion ] = useState( data?.find(v => v.versionId === versionId || v.versionId === query.get('versionId'))
        //orderByValidFromDesc(versions
        //.filter(v => v.administrativStatus != 'OPEN')
        //.filter(v => v.validFrom > new Date().toJSON()))[0] || null
    );
    const [ showHelp, setShowHelp ] = useState(false);
    const pushParams = (option) => history.push(`/subsets/${ option.subsetId }/versions/${ option.versionId }`);
    const pushQuery = option => history.push(`?${ query.update('versionId', option.versionId) }`);

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
                      onSelect={ option =>
                          syncParams
                              ? pushParams(option)
                              : syncQuery
                                  ? pushQuery(option)
                                  : setVersion(option)
                      }
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
