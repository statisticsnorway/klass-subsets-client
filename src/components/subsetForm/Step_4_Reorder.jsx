import React from 'react';
import {Title} from '@statisticsnorway/ssb-component-library';
import {useTranslation} from 'react-i18next';
import {Reorderable} from './reorderable';

export const Step_4_Reorder = ({subset}) => {
    const {draft, dispatch} = subset;
    const { t } = useTranslation();

    return (<>
        <Title size={3}>{t('Reorder codes')}</Title>
        <p style={{fontSize: 'calc(10px + 0.3vmin)'}}>ID: <strong>{draft?.id || '-'}  </strong>
            {t('Version')}: <strong>{draft.version || '-'}  </strong>
            {t('Updated')}: <strong>{draft.lastUpdatedDate || '-'}  </strong>
            {t('Status')}: <strong>{t(draft.administrativeStatus) || '-'}  </strong>
        </p>

        {draft.codes?.length === 0
            ? <p>{t('No items to sort')}</p>
            : <Reorderable list={draft.codes}
                           rerank={ (codes, rank) => dispatch({
                               action: 'codes_rerank',
                               data: {codes, rank}})
                           }
                           remove={ codes => dispatch({
                               action: 'codes_exclude',
                               data: codes})
                           }
                           update={ code => dispatch({
                               action: 'codes_cache',
                               data: code})
                           }
                           disabled={draft.administrativeStatus === 'OPEN'}
            />
        }
     </>);
};
