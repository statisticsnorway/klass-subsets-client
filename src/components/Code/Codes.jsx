import React from 'react';
import { CodeDumb} from './CodeDumb';
import { useTranslation } from 'react-i18next';
import { Datepicker } from '../Forms';

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
            { data[0].codes
                .sort((a,b) => (a.rank - b.rank))
                .map((code, i) => (
                        <CodeDumb key={i} origin={code} />
                    )
                )
            }
        </>
    );
}