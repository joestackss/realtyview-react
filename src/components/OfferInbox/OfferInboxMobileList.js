import React from 'react';
import classNames from 'classnames';
import { isSameDay, isSameYear, format as dateFormat } from 'date-fns';
import { Checkbox, CheckboxGroup, Input, InputGroup } from 'rsuite';

import { ReactComponent as MenuIcon } from '../../images/icons/menu-icon.svg';
import { ReactComponent as NewOfferIcon } from '../../images/icons/new-offer-icon.svg';
import { ReactComponent as SearchIcon } from '../../images/icons/search-icon.svg';
import { ReactComponent as UserIcon } from '../../images/icons/user-icon.svg';

import RVButton from '../shared/RVButton';

import OfferInboxContext from './OfferInboxContext';

import '../../styles/OfferInbox/OfferInboxMobileList.scss';

const OfferList = (props) => {
  const { offers, refDate, onOfferClick } = props;

  const getDateString = (date, refDate) => {
    let dateString = '';
    if (isSameDay(refDate, date)) {
      dateString = dateFormat(date, "'Today' - h:mm a");
    } else if (isSameYear(refDate, date)) {
      dateString = dateFormat(date, "MMM d - h:mm a");
    } else {
      dateString = dateFormat(date, 'MM/dd/yyyy');
    }
    return dateString;
  }

  return (
    <div className="offer-inbox-mobile-list-scrollable">
      <CheckboxGroup className="offer-inbox-mobile-list-group">
        {offers.map((offer, i) => (
          <div className="offer-inbox-mobile-list-cell-wrapper" key={i}>
            <div className={classNames(
              'offer-inbox-mobile-list-cell',
              !offer.is_read && 'offer-inbox-mobile-list-unread-cell',
            )}>
              <Checkbox />
              <div className="offer-inbox-mobile-list-cell-content" onClick={() => { onOfferClick(offer.id) }}>
                <div className="offer-inbox-mobile-list-cell-row" style={{ alignItems: "flex-start" }}>
                  <div className="offer-inbox-mobile-list-cell-sender-client">
                    <div 
                      className={classNames(
                        'offer-inbox-marker', 
                        `offer-inbox-marker-${offer.client_relationship_type}`
                      )}
                      style={{ width: '7px', height: '7px' }}
                    ></div>
                    <span>
                    {offer.client_name || <span className="offer-inbox-value-na">N/A</span>}
                    </span>
                  </div>
                  <div className="offer-inbox-mobile-list-cell-date">
                    {getDateString(offer.created, refDate)}
                  </div>
                </div>
                <div className="offer-inbox-mobile-list-cell-row">
                  <div className="offer-inbox-mobile-list-cell-sender-broker">
                    <div className="offer-inbox-agent-marker">
                      <UserIcon width="7" height="7" />
                    </div>
                    <span>
                      {offer.broker_name || <span className="offer-inbox-value-na">N/A</span>}
                    </span>
                  </div>
                </div>
                <div className="offer-inbox-mobile-list-cell-row" style={{ alignItems: "flex-end" }}>
                  <div className="offer-inbox-mobile-list-cell-address">
                    {offer.address}
                  </div>
                  <div className="offer-inbox-mobile-list-cell-status">
                    <div className={classNames('offer-inbox-status-tag', `offer-inbox-status-tag-${offer.status.replace(' ', '-')}`)}>
                      {offer.status}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </CheckboxGroup>
    </div>
  );
}

class OfferInboxMobileList extends React.Component {
  static contextType = OfferInboxContext;

  handleOfferClick = (offerId) => {
    const { showOfferDisplay } = this.context;
    showOfferDisplay(offerId);
  }

  handleMenuClick = () => {
    const { setSidebarDisplay } = this.context;
    setSidebarDisplay(true);
  }

  render() {
    const { bucket, offers } = this.context;
    const refDate = new Date();

    return (
      <div className="offer-inbox-mobile-list">
        <div className="offer-inbox-mobile-list-header">
          <RVButton palette="secondary" size="lg" onClick={this.handleMenuClick}>
            <MenuIcon width="12" height="12"/>
          </RVButton>
          <div className="offer-inbox-mobile-list-title">{bucket}</div>
          <RVButton palette="primary" size="lg">
            <NewOfferIcon width="12" height="12"/>
          </RVButton>
        </div>
        <InputGroup className="offer-inbox-search">
          <InputGroup.Addon>
            <SearchIcon width="16" height="16"/>
          </InputGroup.Addon>
          <Input placeholder="Search..." />
        </InputGroup>
        <OfferList offers={offers} refDate={refDate} onOfferClick={this.handleOfferClick}/>
      </div>
    );
  }
}

export default OfferInboxMobileList;