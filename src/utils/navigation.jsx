import React, {useState} from 'react';
import {Button} from '@statisticsnorway/ssb-component-library';
import '../css/tooltip.css';
import {useTranslation} from "react-i18next";

// TODO: add api to navigate to particular steps from inside og the form.
// For instance from the last (preview) page.
export function Navigation({children}) {
    const [step, setStep] = useState(0);

    return (<>
            <ProgressBar steps={children} handleClick={setStep} activeStep={step} />
            <div>{children[step]}</div>
            <PrevNext min={step===0} max={step===children.length-1} handleClick={setStep} />
        </>
    );
}

export const Step = ({children}) => {
    return <>{children}</>;
};

export const ProgressBar = ({steps, handleClick, activeStep}) => {
    return (
        <div style={{textAlign: 'center', width: '60%'}}>
            {steps.map((step, index) => (
                <button key={index}
                        className='tooltip'
                        onClick={ () => handleClick(index) }
                        style={{
                            borderRadius: '50%',
                            background: activeStep === index ? '#62919A' : '#C3DCDC',
                            border: 'none',
                            color: 'transparent',
                            textAlign: 'center',
                            textDecoration: 'none',
                            display: 'inline-block',
                            padding: '1px 5px',
                            margin: '0 30px 0 0'
                        }}
                >{index}
                    <span className="tooltiptext">{step.props.label}</span>
                </button>
            ))}
        </div>
    );
};

export const PrevNext = ({min, max, handleClick}) => {
    const { t } = useTranslation();

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
            <Button primary disabled={min} onClick={ prev }>{t('Previous')}</Button>
            <Button primary disabled={max} onClick={ next }>{t('Next')}</Button>
        </>
    );
};