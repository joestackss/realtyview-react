import React from 'react';
import classNames from 'classnames';
import { format as dateFormat, isSameDay, isSameYear } from 'date-fns';
import { ButtonToolbar, Divider, IconButton, Modal, Panel, Timeline } from 'rsuite';

import { ReactComponent as ArchiveIcon } from '../../images/icons/archive-icon.svg';
import { ReactComponent as MarkAsUnreadIcon } from '../../images/icons/mark-as-unread-icon.svg';
import { ReactComponent as PrintIcon } from '../../images/icons/print-icon.svg';
import { ReactComponent as TrashIcon } from '../../images/icons/trash-icon.svg';
import RVButton from '../shared/RVButton';

import OfferInboxContext from './OfferInboxContext';
import { 
  OfferInboxDisplayContacts, 
  OfferInboxDisplayDetails, 
  OfferInboxDisplayTimeline 
} from './OfferInboxDisplay';

import '../../styles/OfferInbox/OfferInboxDisplayModal.scss';

class OfferInboxDisplayModal extends React.Component {
  static contextType = OfferInboxContext;
  constructor(props) {
    super(props);
    this.state = { isOpen: true };
  }

  handleClose = () => {
    this.setState({ isOpen: false });
  }

  handleExited = () => {
    const { bucket, goToBucket } = this.context;
    goToBucket(bucket);
  }

  getDateString = (date, refDate) => {
    let dateString = '';
    if (isSameDay(refDate, date)) {
      dateString = dateFormat(date, "'Today at' h:mm a");
    } else if (isSameYear(refDate, date)) {
      dateString = dateFormat(date, "MMM d 'at' h:mm a");
    } else {
      dateString = dateFormat(date, 'MM/dd/yyyy');
    }
    return dateString;
  }

  render() {
    const { displayedOffer } = this.context;
    const { isOpen } = this.state;
    const refDate = new Date();
    return (
      <Modal className="offer-inbox-display-modal" show={isOpen} onHide={this.handleClose} onExited={this.handleExited} enforceFocus full>
        {displayedOffer != null && <React.Fragment>
          <Modal.Header>
            <div className="offer-inbox-display-modal-header">
              <div className={classNames('offer-inbox-status-tag', `offer-inbox-status-tag-${displayedOffer.status.replace(' ', '-')}`)}>
                {displayedOffer.status}
              </div>
              <div className="offer-inbox-display-modal-header-address">{displayedOffer.address}</div>
              <div className="offer-inbox-display-modal-header-date">{this.getDateString(displayedOffer.created, refDate)}</div>
            </div>
          </Modal.Header>
          <Modal.Body>
            <Divider />
            <div className="offer-inbox-display-modal-subheader">
              <OfferInboxDisplayContacts offer={displayedOffer} />
              <div className="offer-inbox-display-modal-controls">
                <RVButton size="lg" palette="success">View in OfferView</RVButton>
                <ButtonToolbar>
                  <IconButton 
                    appearance="subtle" 
                    circle 
                    size="sm" 
                    icon={<TrashIcon width="14" height="14" />}
                  />
                  <IconButton 
                    appearance="subtle" 
                    circle 
                    size="sm" 
                    icon={<ArchiveIcon width="14" height="14" />}
                  />
                  <IconButton 
                    appearance="subtle" 
                    circle 
                    size="sm" 
                    icon={<MarkAsUnreadIcon width="14" height="14" />}
                  />
                  <IconButton 
                    appearance="subtle" 
                    circle 
                    size="sm" 
                    icon={<PrintIcon width="14" height="14" />}
                  />
                </ButtonToolbar>
              </div>
            </div>
            <Divider />
            {displayedOffer.broker_name && <div className="offer-inbox-display-modal-message">
              {displayedOffer.broker_name} has submitted an offer. Review the offer details below. 
            </div>}
            <div className="offer-inbox-display-modal-sections">
              <Panel className="offer-inbox-display-modal-details-panel" bordered>
                <OfferInboxDisplayDetails offer={displayedOffer}/>
              </Panel>
              <Panel className="offer-inbox-display-modal-timeline-panel" bordered>
                <OfferInboxDisplayTimeline offer={displayedOffer}/>
              </Panel>
            </div>
          </Modal.Body>
        </React.Fragment>}
      </Modal>
    )
  }
}

export default OfferInboxDisplayModal;