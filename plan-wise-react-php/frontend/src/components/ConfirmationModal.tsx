import React, { useState, useEffect, ForwardedRef } from 'react';
import { Modal } from 'bootstrap';
import './ConfirmationModal.css';

interface ConfirmationModalProps {
  headerMessage: string;
  confirmationAction: () => void;
  actionMessage: string;
  actionClass: string;
  bodyMessage: string;
  handleConfirm: any;
}

const ConfirmationModal = React.forwardRef(
  (
    { headerMessage, confirmationAction, actionMessage, actionClass, bodyMessage, handleConfirm }: ConfirmationModalProps,
    ref: ForwardedRef<HTMLDivElement>,
  ) => {
    const [localHeaderMessage, setLocalHeaderMessage] = useState<string>('');
    const [localBodyMessage, setLocalBodyMessage] = useState<string>('');
    const [displayErrorMessage, setDisplayErrorMessage] = useState<boolean>(false);

    useEffect(() => {
      const modalElement = document.getElementById('confirmationModal');
      const handleShow = () => {
        onShow();
      };
      modalElement?.addEventListener('shown.bs.modal', handleShow);

      // Cleanup the event listener when unmounted
      return () => {
        modalElement?.removeEventListener('shown.bs.modal', handleShow);
      };
    }, [headerMessage, bodyMessage]);

    const onShow = () => {
      setLocalHeaderMessage(headerMessage);
      setLocalBodyMessage(bodyMessage);
    };

    const showErrorMessage = () => {
      setDisplayErrorMessage(true);
    };

    const changeModalMessage = () => {
      // Continue your logic here
    };

    return (
      <div ref={ref} className="modal fade" id="confirmationModal" tabIndex={-1} role="dialog" aria-labelledby="confirmationModalLabel" aria-hidden="true">
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="confirmationModalLabel">{localHeaderMessage}</h5>
              <button type="button" className="close" data-bs-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">×</span>
              </button>
            </div>
            <div className="modal-body">
              {localBodyMessage}
              {displayErrorMessage && (
                <div className="alert alert-danger" role="alert">
                  Error occurred in this operation! Please try again
                </div>
              )}
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
              <button type="button" className={`btn ${actionClass}`} onClick={confirmationAction}>
                {actionMessage}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
);

export default ConfirmationModal;
