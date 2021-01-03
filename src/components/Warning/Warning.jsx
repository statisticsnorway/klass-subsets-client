import React, { useState } from 'react';
import { Dialog } from '@statisticsnorway/ssb-component-library';
import {XButton} from "../Buttons";

export const Warning = ({
                            title = 'Alert button',
                            children
                        }) => {
    const [ show, setShow ] = useState(true);

    return (
        <>
            { show &&
            <Dialog type='warning'
                    title={ title }>
                { children }
                <br/>
                <XButton
                    clickHandler={() => setShow(false) }
                    active={ false }
                />
            </Dialog>
            }
        </>
    );
};
