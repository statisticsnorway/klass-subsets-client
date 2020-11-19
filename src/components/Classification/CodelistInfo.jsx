import React from 'react';
import { useTranslation } from "react-i18next";
import { Paragraph, Title } from "@statisticsnorway/ssb-component-library";

export const CodelistInfo = ({id, info}) => {
    const { t } = useTranslation();

    return (
        <div style={{ backgroundColor: '#eff4f5' }}
             className='panel'>
            <Title size={4}>{t('Code list info')}</Title>
            <Paragraph><strong>Id:</strong> {id}</Paragraph>
            <table>
                <tbody>
                <tr>
                    <th>{t('From')}</th>
                    <th>{t('To')}</th>
                    <th>{t('Version')}</th>
                </tr>
                { info.versions
                    .sort((a, b) => (a.validFrom > b.validFrom ? -1 : 0))
                    .map((version, i) => (
                        <tr key={i}>
                            <td>{ version.validFrom || '...' }</td>
                            <td>{ version.validTo || '...' }</td>
                            <td style={{ width: '65%' }}>{version.name}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <Paragraph><strong>{ t('Description') }:</strong> { info.description || '-' }</Paragraph>
        </div>
    );
};