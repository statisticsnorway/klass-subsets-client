import { useState, useContext } from 'react';
import { AppContext } from '../controllers/context';
import { useKeyPress } from './useKeyPress';

const useChangeDateModal = () => {
    const [isShowing, setIsShowing] = useState(false);
    const { subset } = useContext(AppContext);

    const [toOrFromDateString, setToOrFromDateString] = useState(null)
    const [chosenDate, setChosenDate] = useState('');
     
    useKeyPress('Escape', () => {
        setIsShowing(false);  
    })
    
    function dismiss() {
        setIsShowing(!isShowing);
    }

    function submit() {
        if(toOrFromDateString !== null && toOrFromDateString === 'to') {
            subset.dispatch({ action: toOrFromDateString, data: chosenDate });
        }
        if(toOrFromDateString !== null && toOrFromDateString === 'from') {
            subset.dispatch({ action: toOrFromDateString, data: chosenDate });
        }

        setIsShowing(!isShowing);
    }

    function handleDateChange(date, toOrFrom) {
        if(subset.draft.validFrom?.getTime() === date.getTime()) return;
       
        setToOrFromDateString(toOrFrom)
        setChosenDate(date);
        
        if(toOrFrom === 'from' && subset.draft.validFrom === null) {
            subset.dispatch({ action: 'from', data: date});
            return;
        }
        if(toOrFrom === 'to' && subset.draft.validUntil === null) {
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