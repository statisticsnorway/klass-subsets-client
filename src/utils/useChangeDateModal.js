import { useState } from 'react';
import { useContext } from "react";
import { AppContext } from "../controllers/context";

const useChangeDateModal = () => {
    const [isShowing, setIsShowing] = useState(false);
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');
    const [chosenDate, setChosenDate] = useState('');
    const { subset } = useContext(AppContext);

    function dismiss() {
        setIsShowing(!isShowing);
    }
    function submit(logs) {
        console.log(logs)
        console.log(fromDate)
        
        console.log(chosenDate)
        if(toDate === null) {
            subset.dispatch({ action: 'to', data: chosenDate });
        }
        if(fromDate !== null) {
            subset.dispatch({ action: 'from', data: chosenDate });
        }
        setIsShowing(!isShowing);
    }

    function handleDateChange(date, toOrFrom) {
        setChosenDate(date);
        
        if(toOrFrom === 'from' && subset.draft.validFrom === null) {
            setFromDate(toOrFrom);
            subset.dispatch({ action: 'from', data: date});
            return;
        }
        if(toOrFrom === 'to' && subset.draft.validUntil === null) {
            setToDate(toOrFrom);
            subset.dispatch({ action: 'to', data: date});
            return;
        }
        if(subset.draft.classifications < 1) {
            subset.dispatch({ action: toOrFrom, data: date});
            return;
        }

        setIsShowing(!isShowing);
    }

    return {
        isShowing,
        dismiss,
        submit,
        handleDateChange
    }
}

export default useChangeDateModal;