import React, {useState} from 'react';
import {useTranslation} from 'react-i18next';
import {Trash2} from 'react-feather';

export const Reorderable = ({list = [], rerank, remove}) => {
    const { t } = useTranslation();

    return (
        <>
            <table>
                <tbody>
                <tr>
                    <th>{t('Code')}</th>
                    <th>{t('Classification')}</th>
                    <th>{t('Code name')}</th>
                    <th>{t('Rank')}</th>
                    <th></th>
                </tr>
                {list.sort((a, b) => (a.rank - b.rank -1))
                    .map((item, i) => (
                        <tr key={item.urn+i}>
                            <td>{item.code || 'code'}</td>
                            <td>{item.classificationID || 'ID'}</td>
                            <td style={{width: '65%'}}>{item.urn || 'name'}</td>
                            <td>{item.rank}
                                <button onClick={() => rerank(item, 1)}>
                                    <Trash2 color='#ED5935'/>
                                </button>
                            </td>
                            <td>
                                <button onClick={() => remove([item])}>
                                    <Trash2 color='#ED5935'/>
                                </button>
                            </td>
                        </tr>
                    ))
                }
                </tbody>
            </table>
        </>
    );
};
