import React from 'react';
import classNames from 'classnames';
import { Col, Divider, Grid, Icon, IconButton, Row, Panel, Timeline, ButtonToolbar } from 'rsuite';
import { format as dateFormat, isSameDay, isSameYear } from 'date-fns';

import { ReactComponent as ArchiveIcon } from '../../images/icons/archive-icon.svg';
import { ReactComponent as ChatIcon } from '../../images/icons/chat-icon.svg';
import { ReactComponent as LocationIcon } from '../../images/icons/location-icon.svg';
import { ReactComponent as MarkAsUnreadIcon } from '../../images/icons/mark-as-unread-icon.svg';
import { ReactComponent as PrintIcon } from '../../images/icons/print-icon.svg';
import { ReactComponent as SignoutIcon } from '../../images/icons/signout-icon.svg';
import { ReactComponent as TrashIcon } from '../../images/icons/trash-icon.svg';

import RVButton from '../shared/RVButton';

import OfferInboxContext from './OfferInboxContext';

import '../../styles/OfferInbox/OfferInboxDisplay.scss';

class OfferInboxDisplayContacts extends React.Component {
  render() {
    const { offer } = this.props;
    return (
      <div className="offer-inbox-display-contacts">
        <div className="offer-inbox-display-sender-item offer-inbox-display-sender-broker">
          <div className="offer-inbox-display-sender-label">Listing Broker</div>
          <div className="offer-inbox-display-sender-value">
            {offer.broker_name || <span className="offer-inbox-value-na">N/A</span>}
          </div>
          {offer.broker_name && <RVButton className="offer-inbox-display-sender-btn" size="xs" palette="success">
            <ChatIcon width="10" height="10"/>&nbsp;Chat
          </RVButton>}
        </div>
        <div className="offer-inbox-display-sender-item offer-inbox-display-sender-client">
          <div className="offer-inbox-display-sender-label">Primary {offer.client_relationship_type}</div>
          <div className="offer-inbox-display-sender-value">
            {offer.client_name || <span className="offer-inbox-value-na">N/A</span>}
          </div>
        </div>
        <div className="offer-inbox-display-sender-item offer-inbox-display-sender-secondary-client">
          <div className="offer-inbox-display-sender-label">Secondary {offer.client_relationship_type}</div>
          <div className="offer-inbox-display-sender-value">
            {offer.secondary_client_name || <span className="offer-inbox-value-na">N/A</span>}
          </div>
        </div>
      </div>
    );
  }
}

class OfferInboxDisplayDetails extends React.Component {
  render() {
    const { offer } = this.props;
    return (
      <div className="offer-inbox-display-details">
        <div className="offer-inbox-display-details-header">
          <SignoutIcon width="15" height="15" />
          <h6>Offer Details</h6>
        </div>
        <Grid fluid className="offer-inbox-display-details-body">
          <Row>
            <Col xs={12} className="offer-inbox-display-detail">
              <div className="offer-inbox-display-detail-label">Offer Amount</div>
              <div className="offer-inbox-display-detail-value">{offer.amount && `$${offer.amount.toLocaleString()}`}</div>
            </Col>
            <Col xs={12} className="offer-inbox-display-detail">
              <div className="offer-inbox-display-detail-label">Down Payment / Earnest Money</div>
              <div className="offer-inbox-display-detail-value">{offer.downpayment && `$${offer.downpayment.toLocaleString()}`}</div>
            </Col>
          </Row>
          <Row>
            <Col xs={12} className="offer-inbox-display-detail">
              <div className="offer-inbox-display-detail-label">Pre-Approval Amount</div>
              <div className="offer-inbox-display-detail-value">{offer.preapproval_amount && `$${offer.preapproval_amount.toLocaleString()}`}</div>
            </Col>
            <Col xs={12} className="offer-inbox-display-detail">
              <div className="offer-inbox-display-detail-label">Seller Concession</div>
              <div className="offer-inbox-display-detail-value">{offer.seller_concession}</div>
            </Col>
          </Row>
          <Row>
            <Col xs={12} className="offer-inbox-display-detail">
              <div className="offer-inbox-display-detail-label">Loan Type</div>
              <div className="offer-inbox-display-detail-value">{offer.loan_type}</div>
            </Col>
            <Col xs={12} className="offer-inbox-display-detail">
              <div className="offer-inbox-display-detail-label">Proposed Closing Date</div>
              <div className="offer-inbox-display-detail-value">{dateFormat(offer.proposed_closing_date, 'MM/dd/yyyy')}</div>
            </Col>
          </Row>
          <Row>
            <Col xs={24} className="offer-inbox-display-detail offer-inbox-display-notes">
              <div className="offer-inbox-display-detail-label">Notes</div>
              <div className="offer-inbox-display-detail-value">{offer.notes}</div>
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
}

class OfferInboxDisplayTimeline extends React.Component {
  render() {
    const { offer } = this.props;
    return (
      <div className="offer-inbox-display-timeline">
        <div className="offer-inbox-display-timeline-header">
          <LocationIcon width="15" height="15" />
          <h6>
            Offer ID:&nbsp;
            <span className="offer-inbox-display-id">{offer.id}</span>
          </h6>
        </div>
        <Timeline align="left">
          <Timeline.Item className="offer-inbox-display-timeline-current">
            <div className="offer-inbox-display-timeline-label">Offer Created</div>
            <div className="offer-inbox-display-timeline-date">{dateFormat(offer.created, 'MM/dd/yyyy h:mm a')}</div>
            <Divider/>
          </Timeline.Item>
          <Timeline.Item>
            <div className="offer-inbox-display-timeline-label">Offer in Process</div>
            <Divider/>
          </Timeline.Item>
          <Timeline.Item>
            <div className="offer-inbox-display-timeline-label">Offer Complete</div>
            <Divider/>
          </Timeline.Item>
          <Timeline.Item>
            <div className="offer-inbox-display-timeline-label">Offer Sent</div>
            <Divider/>
          </Timeline.Item>
          <Timeline.Item>
            <div className="offer-inbox-display-timeline-label">Offer Acknowledged</div>
            <Divider/>
          </Timeline.Item>
          <Timeline.Item>
            <div className="offer-inbox-display-timeline-label">Offer Accepted</div>
          </Timeline.Item>
        </Timeline>
      </div>
    );
  }
}

class OfferInboxDisplay extends React.Component {
  static contextType = OfferInboxContext;
  constructor(props) {
    super(props);
    this.state = {
      moreControlsShown: false,
    }
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

  handleBack = () => {
    const { bucket, goToBucket } = this.context;
    goToBucket(bucket);
  }

  toggleShowMoreControls = () => {
    this.setState({ moreControlsShown: !this.state.moreControlsShown });
  }

  render() {
    const { bucket, displayedOffer } = this.context;
    const { moreControlsShown } = this.state;
    const refDate = new Date();
    return (
      <div className="offer-inbox-display">
        <div className="offer-inbox-display-controls">
          <RVButton className="offer-inbox-display-back-btn" palette="primary" size="lg" onClick={this.handleBack}>
            <Icon icon="chevron-left"/> {bucket}
          </RVButton>
          <ButtonToolbar>
            <IconButton 
              appearance="subtle" 
              circle 
              size="md" 
              icon={<ArchiveIcon width="20" height="20" />}
            />
            <IconButton 
              appearance="subtle" 
              circle 
              size="md" 
              icon={<TrashIcon width="20" height="20" />}
            />
            <IconButton 
              appearance="subtle" 
              circle
              size="md" 
              icon={<Icon icon={moreControlsShown ? 'arrow-up' : 'arrow-down'} width="20" height="20" />}
              onClick={this.toggleShowMoreControls}
            />
          </ButtonToolbar>
        </div>
        <div className={classNames(
          'offer-inbox-display-more-controls-container',
          moreControlsShown && 'offer-inbox-display-more-controls-container-open',
        )}>
          <div className="offer-inbox-display-more-controls">
            <RVButton palette="link-light">
              <TrashIcon width="20" height="20" />
              <span>Delete</span>
            </RVButton>
            <RVButton palette="link-light">
              <ArchiveIcon width="20" height="20" />
              <span>Archive</span>
            </RVButton>
            <RVButton palette="link-light">
              <MarkAsUnreadIcon width="20" height="20" />
              <span>Mark as unread</span>
            </RVButton>
            <RVButton palette="link-light">
              <PrintIcon width="20" height="20" />
              <span>Print</span>
            </RVButton>
          </div>
        </div>
        <div className="offer-inbox-display-header">
          <div className={classNames('offer-inbox-status-tag', `offer-inbox-status-tag-${displayedOffer.status.replace(' ', '-')}`)}>
            {displayedOffer.status}
          </div>
          <div className="offer-inbox-display-header-details">
            <div className="offer-inbox-display-header-address">{displayedOffer.address}</div>
            <div className="offer-inbox-display-header-date">{this.getDateString(displayedOffer.created, refDate)}</div>
            <RVButton className="offer-inbox-display-offer-view-btn" palette="success" size="lg">
              View in OfferView
            </RVButton>
          </div>
        </div>
        <Divider />
        <OfferInboxDisplayContacts offer={displayedOffer}/>
        <Divider />
        {displayedOffer.broker_name && <div className="offer-inbox-display-message">
          {displayedOffer.broker_name} has submitted an offer. Review the offer details below. 
        </div>}
        <Divider style={{ margin: '24px -24px' }}/>
        <OfferInboxDisplayDetails offer={displayedOffer}/>
        <Divider style={{ margin: '24px -24px' }}/>
        <Divider style={{ margin: '24px -24px' }}/>
        <OfferInboxDisplayTimeline offer={displayedOffer}/>
        <Divider style={{ margin: '24px -24px' }}/>        
      </div>
    );
  }
}

export {
  OfferInboxDisplayContacts,
  OfferInboxDisplayDetails,
  OfferInboxDisplayTimeline
};

export default OfferInboxDisplay;