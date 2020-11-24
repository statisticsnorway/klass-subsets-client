import React from 'react';
import { useTranslation } from 'react-i18next';
import { Edit } from 'react-feather';

export const Title = ({
                          name = null,
                          edit = () => {}
}) => {
    const { t } = useTranslation();


    return (
        <h1>{ name || t('No name') }
            {
                edit &&
                <Edit
                    style={{
                        color: '#ED5935',
                        margin: '0 10px',
                        cursor: 'pointer'
                    }}
                    onClick={ edit }/>
            }
        </h1>
    );
};

