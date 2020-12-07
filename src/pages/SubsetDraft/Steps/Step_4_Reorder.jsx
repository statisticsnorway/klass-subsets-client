import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { Table as Reorderable } from '../../../components/Lists';
import { BriefContextual } from '../../../components/Subset';
import { AppContext } from '../../../controllers/context';

export const Step4Reorder = () => {
    const { subset: { draft, dispatch } } = useContext(AppContext);
    const { t } = useTranslation();

    return (<>
        <h3>{ t('Reorder codes') }</h3>
        <BriefContextual metadata currentVersion />

        { draft.codes?.length === 0
            ? <p>{ t('No items to sort') }</p>
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
                           disabled={ draft.administrativeStatus === 'OPEN' }
            />
        }
     </>);
};
