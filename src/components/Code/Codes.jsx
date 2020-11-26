import React from 'react';
import { CodeDumb} from './CodeDumb';
import { useTranslation } from 'react-i18next';
import { Datepicker } from '../Forms';
import { flatten } from '../../utils/arrays';

export const Codes = ({ data }) => {
    const { t } = useTranslation();

    return (
        <>
            <section style={{ margin: '5px 0 5px 0' }}>
                <div style={{ float: 'left',
                    position: 'relative',
                    padding: '20px'
                }}>
                    <Datepicker />
                </div>
                <div style={{ float: 'left',
                    padding: '20px'
                }}>
                    <Datepicker />
                </div>
                <br style={{ clear: 'both' }}/>
            </section>

            <h3>{ t('Codes valid in the specified period') }: 01.01.2020 - ...</h3>
            {/* FIXME: check the validity period is set correctly*/}
            { flatten(data.map(version => version.codes))
                .map((code, i) => (
                        <CodeDumb key={i} origin={code} />
                    )
                )
            }
        </>
    );
}