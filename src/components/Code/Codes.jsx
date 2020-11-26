import React from 'react';
import { CodeDumb} from './CodeDumb';
import { useTranslation } from 'react-i18next';
import { Datepicker } from '../Forms';
import { flatten } from '../../utils/arrays';
import { DownloadButton } from '../DownloadButton';
import { EditButton } from '../EditButton';

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
            <p>{ t('Metadata info') }.</p>
            <p>{ t('Subset validity period info') }.</p>
            <p>{ t('Owning section info') }.</p>
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