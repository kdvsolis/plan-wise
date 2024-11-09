import React, { useState, useEffect } from 'react';
// @ts-expect-error TS(7016): Could not find a declaration file for module 'boot... Remove this comment to see the full error message
import { Modal } from 'bootstrap';
import "./ConfirmationModal.css"

// @ts-expect-error TS(2339): Property 'headerMessage' does not exist on type '{... Remove this comment to see the full error message
const ConfirmationModal = React.forwardRef(({ headerMessage, confirmationAction, actionMessage, actionClass, bodyMessage }, ref) => {
    const [localHeaderMessage, setLocalHeaderMessage] = useState('');
    const [localBodyMessage, setLocalBodyMessage] = useState('');
    const [displayErrorMessage, setDisplayErrorMessage] = useState(false);

    useEffect(() => {
        const modalElement = document.getElementById('confirmationModal');
        const handleShow = () => {
        onShow();
        };
        // @ts-expect-error TS(2531): Object is possibly 'null'.
        modalElement.addEventListener('shown.bs.modal', handleShow);

        // Linisin ang event listener kapag unmounted ang component
        return () => {
        // @ts-expect-error TS(2531): Object is possibly 'null'.
        modalElement.removeEventListener('shown.bs.modal', handleShow);
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
        // Ipatuloy ang logic dito
    };

    return (
        // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
        <div ref={ref} className="modal fade" id="confirmationModal" tabIndex="-1" role="dialog" aria-labelledby="confirmationModalLabel" aria-hidden="true">
        // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
        <div className="modal-dialog" role="document">
            // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
            <div className="modal-content">
            // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
            <div className="modal-header">
                // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                <h5 className="modal-title" id="confirmationModalLabel">{localHeaderMessage}</h5>
                // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                <button type="button" className="close" data-bs-dismiss="modal" aria-label="Close">
                // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                <span aria-hidden="true">×</span>
                </button>
            </div>
            // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
            <div className="modal-body">
                {localBodyMessage}
                {displayErrorMessage && (
                // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                <div className="alert alert-danger" role="alert">
                    Error occurred in this operation! Please try again
                </div>
                )}
            </div>
            // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
            <div className="modal-footer">
                // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                <button type="button" className={`btn ${actionClass}`} onClick={confirmationAction}>{actionMessage}</button>
            </div>
            </div>
        </div>
        </div>
    );
});

export default ConfirmationModal;
