import React, { useContext, useEffect } from 'react';
import { AppContext } from 'controllers';
import { useGet } from 'controllers/subsets-service';
import { subsetDraft } from 'defaults';
import { ErrorTooltip } from 'components';

export const IdForm = () => {
    const { subset:
        { draft: {
            id,
            errors,
            isNew
        }, dispatch
    } } = useContext(AppContext);

    const [ exist,,, setPathExist ] = useGet();

    useEffect(() => {
        if (!isNew() || id?.length === 0) {
            setPathExist(id)
        }
    }, [ id ]);

    return (
        <div style={{ display: 'inline-block' }}>
            <label htmlFor='shortName'>ID:</label>
            <input type='text'
                   id='shortName'
                   name='shortName'
                   value={ id }
                   maxLength={ subsetDraft.maxLengthId }
                   onChange={ event => {
                       setPathExist(event.target.value);
                       dispatch({
                           action: 'shortName_update',
                           data: event.target.value
                       });
                   }}
                   style={{ margin: '0 5px' }}
                   disabled={ !isNew() }
            />

            {/* FIXME should be Subset.prototype responsibility to set errors */}
            <ErrorTooltip
                messages={['Already used ID']}
                visible={ exist && !exist.error && id?.length > 0 }
            />

            <ErrorTooltip
                messages={ errors?.id }
                visible={ id?.length > 0 }
            />

        </div>
    );
};