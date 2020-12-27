import React from 'react';
import { eu, euTime } from 'utils';
import { BoxExpandable } from 'components';
import { IdForm } from '../../SubsetMetadata';

export const Brief = ({ id,
                      editable,
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
        <div title='Brief subset status' style={{ fontSize: '12px',  display: 'flex'}}>
            { editable
                ? <IdForm id={ id }/>
                : <BoxExpandable label={'Subset ID'} text={ id || '-' }/>
            }
            <BoxExpandable label={ 'Subset created' } text={ eu(created) || '-' }  />
            <BoxExpandable label={ 'Subset updated' } text={ euTime(lastModified) || '-' } />
            <BoxExpandable label={ 'Subsets validity period' } text={
                `${ eu(validFrom) || '...' } - ${ eu(validUntil) || '...' }`
            } />
            { available >= 0 && <BoxExpandable
                label='Number of available versions'
                text={ available }/>
            }
            { published >= 0 && <BoxExpandable
                label='Number of published versions'
                text={ published }
                color='#9272FC'
                light
            /> }
            { drafts >= 0 && <BoxExpandable
                label='Number of drafts'
                text={ drafts }
                color='#ED5935'
                light
            /> }
            { locals > 0 && <BoxExpandable
                label='Local drafts'
                text={ locals }
                color='bisque'
            /> }
            { toBeSaved > 0 && <BoxExpandable
                label='To be saved'
                text={ toBeSaved } />
            }
            { metadataToBeSaved && <BoxExpandable
                label='Metadata has been changed locally'
                text='Modified locally'
                color='bisque'
            />}
            <br style={{ clear: 'both' }}/>
        </div>
    );
};
