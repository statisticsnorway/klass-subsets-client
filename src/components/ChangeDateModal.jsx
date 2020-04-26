import React from "react";
import ReactDOM from "react-dom";
import { Title, Dialog, Button } from "@statisticsnorway/ssb-component-library";
import { useTranslation } from "react-i18next";
import "../css/DateModal.css";


const ChangeDateModal = ({isShowing, dismiss, submit}) =>{


    return( 
    isShowing ? ReactDOM.createPortal(
              <div className='date-modal-ovelay'>
                  <div className='date-modal'>
                      <Dialog type='info' title='ChangeDateWarningHeader'>
                          ChangDateWarningText
                          <div className='date-modal-button-container'>
                              <Button type='reset' onClick={dismiss}>
                                  Ikke endre dato
                              </Button>
                              <Button primary type='submit' onClick={submit}>
                                  Enre dato
                              </Button>
                          </div>
                      </Dialog>
                  </div>
              </div>,
              document.body
          ) : null 
    )
    
}
export default ChangeDateModal;
