import React, { useContext } from 'react';
import { AppContext } from 'controllers';
import { CodeListFetcher } from 'components/Classification';
import { useTranslation } from 'react-i18next';
import keys from 'utils/keys';

export const Origins = () => {
    const { t } = useTranslation();
    const { subset: { draft: { origins }} } = useContext(AppContext);

    /* TODO: tooltips for classification icons */
    return (
/*            <ListTabable items={ [...origins ]?.map(o => ({ id: o })) }
                         placeholder={ t('No classifications in the subset draft') }
                         component={ CodeListFetcher }
            />*/
        <>
        { [...origins]?.length === 0
            ? <p>{ t('No classifications in the subset draft') }</p>
            : <ul className='list'>
                { [...origins].map(id => (
                    <li key={ id }
                        tabIndex='0'
                        onKeyDown={ (event) => {
                            switch (event.which) {
                                case keys.DOWN: {
                                    event.preventDefault();
                                    event.target.nextElementSibling && event.target.nextElementSibling.focus();
                                    break;
                                }
                                case keys.UP: {
                                    event.preventDefault();
                                    event.target.previousElementSibling && event.target.previousElementSibling.focus();
                                    break;
                                }
                                default: break;
                            }
                        }}
                    >
                        { <CodeListFetcher item={{id}} /> }
                    </li>)) }
            </ul>
}
</>
    );
};
