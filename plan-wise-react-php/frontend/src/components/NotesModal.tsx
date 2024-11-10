import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { Modal } from 'bootstrap';
import notesAPI from '../services/notes-service';
import './Header.css'

const NotesModal = forwardRef((props: any, ref: any) => {
    const [localCurrentNotes, setLocalCurrentNotes] = useState(props.currentNotes);
    const [localSelectedDate, setLocalSelectedDate] = useState(props.selectedDate);

    useEffect(() => {
        onShow();
    }, [props.currentNotes, props.selectedDate]);

    const onShow = () => {
        setLocalSelectedDate(props.selectedDate);
        setLocalCurrentNotes(props.currentNotes);
    };
    
    const saveNotes = async (date: Date) => {
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
        <div ref={ref} className="modal fade" id="notesModal" tabIndex={-1} aria-labelledby="notesModalLabel" aria-hidden="true">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="notesModalLabel">Notes</h5>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
                        <label htmlFor="notesTextArea" className="form-label">{localSelectedDate}</label>
                        <textarea className="form-control" id="notesTextArea" rows={3} value={localCurrentNotes.notes} onChange={e => setLocalCurrentNotes({ ...localCurrentNotes, notes: e.target.value })}></textarea>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        <button type="button" className="btn btn-primary" data-bs-dismiss="modal" onClick={() => {saveNotes(localSelectedDate)}}>Save changes</button>
                    </div>
                </div>
            </div>
        </div>
    );
});

export default NotesModal;
