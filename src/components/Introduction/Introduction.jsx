import React from 'react';
import { useTranslation } from 'react-i18next';
import { toId } from 'utils';
import { Tag } from 'components';

export const Introduction = ({
                          texts = [],
                          tag = 'p'
                      }) => {

    const {t} = useTranslation();

    return (
        <>{
            texts?.map( text => (
                <Tag key={ toId(text) } html={ tag }>
                    { t(text) }
                </Tag>)
            )
        }
        </>
    );
};