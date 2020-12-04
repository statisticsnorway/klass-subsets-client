import React, { useContext } from 'react';
import { Classification } from '../../../components/Classification';
import { useTranslation } from 'react-i18next';
import './list.css';
import { BriefContextual } from '../../../components/Subset';
import { AppContext } from '../../../controllers/context';
import { SearchFormContextual } from '../../../components/Forms'

export const Step3ChooseCodes = () => {
    const { t } = useTranslation();

    /* TODO: tooltips for classification icons */
    return (<>
            <h3>{ t('Choose classifications and code lists') }</h3>
            <BriefContextual />
            <SearchFormContextual />
            <IncludedCodeLists/>
        </>
    );
};

export const IncludedCodeLists = () => {
    const { subset: { draft: { origin }} } = useContext(AppContext);
    const { t } = useTranslation();

    return (
        <>
            <h3>{ t('Choose codes from classifications') }</h3>

            { origin?.length === 0
                ? <p>{ t('No classifications in the subset draft') }</p>
                : <ul className='list'>
                    { origin.map((urn, index) =>
                        <Classification key={ urn + index }
                                        item={{ urn }}
                        />)
                    }
                </ul>
            }
        </>
    );
};