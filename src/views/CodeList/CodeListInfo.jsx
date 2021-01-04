import React from 'react';
import { useTranslation } from 'react-i18next';

export const CodeListInfo = ({ id, info }) => {
    const { t } = useTranslation();

    return (
        <>{ !info
            ? <p>{ t('No code list info') }</p>
            : <><h3>{ t('Code list info') }</h3>
                <p><strong>Id:</strong> {id}</p>
                <table>
                    <tbody>
                    <tr>
                        <th>{ t('From') }</th>
                        <th>{ t('To') }</th>
                        <th>{ t('Version') }</th>
                    </tr>
                    { info?.versions
                        .sort((a, b) => (a.validFrom > b.validFrom ? -1 : 0))
                        .map((version, i) => (
                            <tr key={i}>
                                <td>{ version.validFrom || '...' }</td>
                                <td>{ version.validTo || '...' }</td>
                                <td>{ version.name }</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <p><strong>{ t('Description') }:</strong> { info?.description || '-' }</p>
            </>}
        </>
    );
};