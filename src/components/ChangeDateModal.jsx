import React from "react";
import ReactDOM from "react-dom";
import { Dialog, Button } from "@statisticsnorway/ssb-component-library";
import { useTranslation } from "react-i18next";
import "../css/DateModal.css";


const ChangeDateModal = ({ isShowing, dismiss, submit }) => {
    const {t} = useTranslation();

    return( 
    isShowing ? ReactDOM.createPortal(
              <dialog className='date-modal-ovelay'>
                  <div className='date-modal'>
                      <Dialog type='info' title={t('Change date warningHeader')}>
                          {t('Change date warning text')}
                          <div className='date-modal-button-container'>
                              <Button type='reset' onClick={dismiss}>
                                  {t('Do not change date button')}
                              </Button>
                              <Button primary type='submit' onClick={submit}>
                                  {t('Change date button')}
                              </Button>
                          </div>
                      </Dialog>
                  </div>
              </dialog>,
              document.body
          ) : null 
    );
    
};
export default ChangeDateModal;
