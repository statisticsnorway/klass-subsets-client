import React, {useContext} from 'react';
import {AppContext} from '../controllers/context';

export default function Errors() {
    const {errorRegister} = useContext(AppContext);

    // TODO: sanitize input

    return (
        <>
            { errorRegister.errors.map((error, index) => (
                <Error key={index} error={error}
                       remove={(e) => errorRegister.dispatch({action: 'remove', data: index})}/>
            ))}
            { errorRegister.errors.length > 1 &&
                <button onClick={() => errorRegister.dispatch({action: 'empty'})}
                >Dismiss all</button>
            }

            {/* FIXME: for visible test purposes. Remove before release! */}
            <button onClick={(e) => errorRegister.dispatch({action: 'add', data: {
                    status: '199',
                    message: 'Plus button works',
                    source: e.target
                }})}
            >+
            </button>
        </>
    );
}

export const Error = ({error, remove}) => {
    return (
        <div>
            <span style={{color: 'red'}}>
                {`${error.status}: ${error.message}. Source: ${error.source}`}
            </span>
            <button
                style={{color: 'red', background: 'none', border: 'none', fontWeight: '600'}}
                onClick={remove}
            >⌧
            </button>
        </div>
    );
};