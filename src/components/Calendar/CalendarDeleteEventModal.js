import React from 'react';
import { ButtonToolbar, Modal } from 'rsuite';

import RVButton from '../../components/shared/RVButton';

import CalendarSchedulerContext from './CalendarSchedulerContext';

import '../../styles/Calendar/CalendarDeleteEventModal.scss';

class CalendarDeleteEventModal extends React.Component {  
  static contextType = CalendarSchedulerContext;

  handleClose = () => {
    const { setDeleteEventModalEventId } = this.context;
    setDeleteEventModalEventId(null);
  }

  handleAccept = () => {
    const { deleteEventModalEventId, deleteEvent } = this.context;
    if (deleteEventModalEventId != null) {
      deleteEvent(deleteEventModalEventId, { 
        success: () => {
          this.handleClose();
        },
      });
    }
  }
  
  render() {
    const { deleteEventModalEventId } = this.context;
    return (
      <Modal className="calendar-delete-event-modal" show={deleteEventModalEventId != null} onHide={this.handleClose} enforceFocus full>
        <Modal.Body>
          Are you sure you would like to delete this event?
        </Modal.Body>
        <Modal.Footer>
          <ButtonToolbar style={{ float: 'right' }}>
            <RVButton palette="link-light" size="lg" onClick={this.handleClose}>Cancel</RVButton>
            <RVButton palette="danger" size="lg" onClick={this.handleAccept}>Delete</RVButton>
          </ButtonToolbar>
        </Modal.Footer>
      </Modal>
    );
  }
}

export default CalendarDeleteEventModal;