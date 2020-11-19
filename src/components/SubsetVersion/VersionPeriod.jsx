import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { AppContext } from '../../controllers/context';
import { VersionValidFromForm } from './VersionValidFromForm';
import { VersionValidUntilForm } from './VersionValidUntilForm';

export const VersionPeriod = () => {
    const { subset } = useContext(AppContext);
    const { t } = useTranslation();

    return (
        <section style={{ margin: '5px 0 5px 0' }}>
            <div style={{ float: 'left',
                marginRight: '20px',
                padding: '0',
                position: 'relative',
                top: '-10px'
            }}>
                <VersionValidFromForm />
            </div>
            <div style={{float: 'left'}}>
                <VersionValidUntilForm />
            </div>
            <br style={{clear: 'both'}}/>

            { subset.draft?.errors?.versionPeriod?.length > 0 &&
            <div className='ssb-input-error '>
                { subset.draft?.errors.versionPeriod.map((error, i) => (
                    <span key={error + i} style={{padding: '0 10px 0 0'}}
                    >{t(error)}.
                    </span>
                ))}
            </div>
            }
        </section>
    );
};