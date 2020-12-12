import React from 'react';
import { eu, euTime } from '../../../utils';
import { BlockExpandable } from '../../BoxExpandable';

export const Brief = ({ id,
                      created,
                      lastModified,
                      validFrom,
                      validUntil,
                      available = -1,
                      published = -1,
                      drafts = -1,
                      locals = -1,
                      toBeSaved = -1,
                      metadataToBeSaved = false
}) => {

    // FIXME: decide whether it should be focusable
    return (
        <div title='Brief subset status' style={{ fontSize: '12px' }}>
            <BlockExpandable label={ 'Subset ID' } text={ id.props.id || '-' }  />
            <BlockExpandable label={ 'Subset created' } text={ eu(created) || '-' }  />
            <BlockExpandable label={ 'Subset updated' } text={ euTime(lastModified) || '-' } />
            <BlockExpandable label={ 'Subsets validity period' } text={
                `${ eu(validFrom) || '...' } - ${ eu(validUntil) || '...' }`
            } />
            { available >= 0 && <BlockExpandable
                label='Number of available versions'
                text={ available }/>
            }
            { published >= 0 && <BlockExpandable
                label='Number of published versions'
                text={ published }
                color='#9272FC'
                light
            /> }
            { drafts >= 0 && <BlockExpandable
                label='Number of drafts'
                text={ drafts }
                color='#ED5935'
                light
            /> }
            { locals > 0 && <BlockExpandable
                label='Local drafts'
                text={ locals }
                color='bisque'
            /> }
            { toBeSaved > 0 && <BlockExpandable
                label='To be saved'
                text={ toBeSaved } />
            }
            { metadataToBeSaved && <BlockExpandable
                label='Metadata has been changed locally'
                text='Modified locally'
                color='bisque'
            />}
            <br style={{ clear: 'both' }}/>
        </div>
    );
};
