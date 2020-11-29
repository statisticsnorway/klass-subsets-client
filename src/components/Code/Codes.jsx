import React from 'react';
import { CodeDumb} from './CodeDumb';
import { useTranslation } from 'react-i18next';
import { Datepicker } from '../Forms';
import { flatten } from '../../utils/arrays';
import { DownloadButton, EditButton } from '../Buttons';

export const Codes = ({ data = [], edit = () => {} }) => {
    const { t } = useTranslation();

    return (
        <>
            <h2>{ t('Codes') }
                <DownloadButton title={ t('Download') }/>

                { edit && <EditButton
                    title={ t('Edit metadata') }
                    clickHandler={ edit }
                />}
            </h2>
            <p>{ t('Codes filter info') }.</p>

            <section style={{ margin: '5px 0 5px 0' }}>
                <div style={{ float: 'left', padding: '20px'
                }}>
                    <Datepicker label={ t('Valid from') }/>
                </div>
                <div style={{ float: 'left', padding: '20px'
                }}>
                    <Datepicker label={ t('Valid to') }/>
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