import React, { useContext } from 'react';
import { Title } from '@statisticsnorway/ssb-component-library';
import { useTranslation } from 'react-i18next';
import { Reorderable } from './reorderable';
import { Brief } from '../Subset';
import { AppContext } from '../../controllers/context';

export const Step4Reorder = () => {
    const { subset } = useContext(AppContext);
    const { draft, dispatch } = subset;
    const { t } = useTranslation();

    return (<>
        <Title size={3}>{t('Reorder codes')}</Title>
        <Brief />

        { draft.codes?.length === 0
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
