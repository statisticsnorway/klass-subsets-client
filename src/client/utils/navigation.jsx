import React, {useState} from "react";
import { Button } from '@statisticsnorway/ssb-component-library';

// TODO: add api to navigate to particular steps from inside og the form.
// For instance from the last (preview) page.
export function Navigation({children}) {
    const [step, setStep] = useState(0);

    return (<>
            <ProgressBar steps={children} handleClick={setStep} />
            <div>{children[step]}</div>
            <PrevNext min={step===0} max={step===children.length-1} handleClick={setStep} />
        </>
    );
}

export const Step = ({children}) => {
    return <>{children}</>;
};

export const ProgressBar = ({steps, handleClick}) => {
    return (
        <>
            {steps.map((step, index) => (
                <button key={index}
                        onClick={ () => handleClick(index) }
                >{step.props.label}</button>
            ))}
        </>
    );
};

export const PrevNext = ({min, max, handleClick}) => {

    const next = () => {
        handleClick((state) => (state+1));
    };

    const prev = () => {
        handleClick((state) => (state-1));
    };

    // TODO: place buttons on the same place on the each step page -> on the side, not bottom
    // It should be possible to click forward and backward without scrolling
    return (
        <>
            <Button primary disabled={min} onClick={ prev }>Previous</Button>
            <Button primary disabled={max} onClick={ next }>Next</Button>
        </>
    );
};