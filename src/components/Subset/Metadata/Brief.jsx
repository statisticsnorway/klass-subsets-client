import React from 'react';
import { eu, euTime } from '../../../utils/strings';
import { BlockExpandable } from '../../BlockExpandable';

export const Brief = ({ id,
                      created,
                      lastModified,
                      validFrom,
                      validUntil,
                      available = -1,
                      published = -1,
                      drafts = -1,
                      locals = -1,
                      toBeSaved = -1
}) => {

    // FIXME: decide whether it should be focusable
    return (
        <div title='Brief subset status' style={{ fontSize: '12px'}}>
            <BlockExpandable label={ 'Subset ID' } text={ id.props.id || '-' }  />
            <BlockExpandable label={ 'Subset created' } text={ eu(created) || '-' }  />
            <BlockExpandable label={ 'Subset updated' } text={ euTime(lastModified) || '-' } />
            <BlockExpandable label={ 'Subsets validity period' } text={
                `${ eu(validFrom) || '...' } - ${ eu(validUntil) || '...' }`
            } />
            { available >= 0 && <BlockExpandable label={'Number of available versions'} text={ available }/> }
            { published >= 0 && <BlockExpandable label={'Number of published versions'} text={ published }/> }
            { drafts >= 0 && <BlockExpandable label={'Number of drafts'} text={ drafts }/> }
            { locals > 0 && <BlockExpandable label={ 'Local drafts' } text={ locals } /> }
            { toBeSaved > 0 && <BlockExpandable label={ 'To be saved' } text={ toBeSaved } /> }
            <br style={{ clear: 'both' }}/>
        </div>
    );
};
