import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
// @ts-expect-error TS(7016): Could not find a declaration file for module 'boot... Remove this comment to see the full error message
import { Modal } from 'bootstrap';
import notesAPI from '../services/notes-service';
import './Header.css'

const NotesModal = forwardRef((props, ref) => {
    // @ts-expect-error TS(2339): Property 'currentNotes' does not exist on type '{}... Remove this comment to see the full error message
    const [localCurrentNotes, setLocalCurrentNotes] = useState(props.currentNotes);
    // @ts-expect-error TS(2339): Property 'selectedDate' does not exist on type '{}... Remove this comment to see the full error message
    const [localSelectedDate, setLocalSelectedDate] = useState(props.selectedDate);

    useEffect(() => {
        onShow();
    // @ts-expect-error TS(2339): Property 'currentNotes' does not exist on type '{}... Remove this comment to see the full error message
    }, [props.currentNotes, props.selectedDate]);

    const onShow = () => {
        // @ts-expect-error TS(2339): Property 'selectedDate' does not exist on type '{}... Remove this comment to see the full error message
        setLocalSelectedDate(props.selectedDate);
        // @ts-expect-error TS(2339): Property 'currentNotes' does not exist on type '{}... Remove this comment to see the full error message
        setLocalCurrentNotes(props.currentNotes);
    };
    
    const saveNotes = async (date: any) => {
        // @ts-expect-error TS(2339): Property 'currentNotes' does not exist on type '{}... Remove this comment to see the full error message
        if(!props.currentNotes.id){
            await notesAPI.create({
                date: date,
                notes: localCurrentNotes.notes
            });
        } else{
            await notesAPI.updateByDate(date, localCurrentNotes)
        }
    }

    return (
        // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
        <div ref={ref} className="modal fade" id="notesModal" tabIndex="-1" aria-labelledby="notesModalLabel" aria-hidden="true">
            // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
            <div className="modal-dialog">
                // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                <div className="modal-content">
                    // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                    <div className="modal-header">
                        // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                        <h5 className="modal-title" id="notesModalLabel">Notes</h5>
                        // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                    <div className="modal-body">
                        // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                        <label htmlFor="notesTextArea" className="form-label">{localSelectedDate}</label>
                        // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                        <textarea className="form-control" id="notesTextArea" rows="3" value={localCurrentNotes.notes} onChange={e => setLocalCurrentNotes({ ...localCurrentNotes, notes: e.target.value })}></textarea>
                    </div>
                    // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                    <div className="modal-footer">
                        // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                        <button type="button" className="btn btn-primary" data-bs-dismiss="modal" onClick={() => {saveNotes(localSelectedDate)}}>Save changes</button>
                    </div>
                </div>
            </div>
        </div>
    );
});

export default NotesModal;
