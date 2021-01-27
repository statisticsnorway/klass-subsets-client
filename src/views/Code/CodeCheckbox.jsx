import React, { useContext } from 'react';
import { AppContext } from 'controllers/context';
import { Text } from '@statisticsnorway/ssb-component-library';
import {toCodeId} from "../../utils";


export const CodeCheckbox = ({ item, ...props }) => {
    const { subset: {
                draft: {
                    isPublished,
                    codesMap,
                }, dispatch
        }
    } = useContext(AppContext);

    const mapKey = toCodeId(item);

    return (
        <div className='ssb-checkbox' style={ props.style }>
            <input id={ mapKey }
                   type='checkbox' name='include'
                   checked={ codesMap.has(mapKey) }
                   value={ item.code }
                   disabled={ isPublished }
                   onChange={ (e) =>
                       codesMap.has(mapKey)
                           ? dispatch({
                               action: 'codes_exclude',
                               data: [ item ]
                           })
                           : dispatch({
                               action: 'codes_include',
                               data: [ item ]
                           })
                   }/>
            <label className='checkbox-label'
                   htmlFor={ mapKey }>
                <Text><strong>{ item.code }</strong> { item.name }</Text>
            </label>
        </div>
    );
}