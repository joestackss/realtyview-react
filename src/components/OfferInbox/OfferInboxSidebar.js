import React from 'react';
import classNames from 'classnames';
import { Divider } from 'rsuite';

import { ReactComponent as ArchiveIcon } from '../../images/icons/archive-icon.svg';
import { ReactComponent as DraftIcon } from '../../images/icons/draft-icon.svg';
import { ReactComponent as InboxIcon } from '../../images/icons/inbox-icon.svg';
import { ReactComponent as SentIcon } from '../../images/icons/sent-icon.svg';

import RVButton from '../shared/RVButton';

import OfferInboxContext from './OfferInboxContext';

import '../../styles/OfferInbox/OfferInboxSidebar.scss';

const RELATIONSHIP_FILTERS = ['buyer', 'seller', 'renter', 'landlord'];

const BucketLink = (props) => {
  const { label, icon, count, active, onClick } = props;
  return (
    <div 
      className={classNames(
        'offer-inbox-bucket-link',
        active && 'offer-inbox-bucket-link-active',
      )} 
      onClick={onClick}
    >
      {icon}
      <span className="offer-inbox-bucket-label">{label}</span>
      {Boolean(count) && <div className="offer-inbox-bucket-badge">{count < 100 ? count : '99+'}</div>}
    </div>
  )
}

const RelationshipFilterItem = (props) => {
  const { value, active, onSelect } = props;
  return (
    <div
      className={classNames(
        'offer-inbox-relationship-filter-item',
        `offer-inbox-relationship-filter-${value}`,
        active && `offer-inbox-relationship-filter-item-active`,
      )}
      onClick={() => { onSelect(active ? null : value) }}
    >
      <div className={classNames('offer-inbox-marker', `offer-inbox-marker-${value}`)}></div>
      {value}
    </div>
  )
}

const AddressFilterItem = (props) => {
  const { label, value, active, onSelect } = props;
  return (
    <div
      className={classNames(
        'offer-inbox-address-filter-item',
        active && `offer-inbox-address-filter-item-active`,
      )}
      onClick={() => { onSelect(active ? null : value) }}
    >
      {label}
    </div>
  )
}

class OfferInboxSidebar extends React.Component {
  static contextType = OfferInboxContext;

  handleBucketSelect = (dstBucket) => () => {
    const { bucket, goToBucket, resetFilters } = this.context;
    if (bucket !== dstBucket) {
      goToBucket(dstBucket);
      resetFilters();
    }
  }

  render() {
    const { 
      bucket, 
      relationshipFilter, 
      addressFilter, 
      addressFilters, 
      draftCount,
      unreadCount,
      onRelationshipFilterSelect,
      onAddressFilterSelect,
    } = this.context;
    const { hideNewOfferButton } = this.props;
    return (
      <div className="offer-inbox-sidebar">
        {!hideNewOfferButton && <RVButton size="lg" block palette="primary">+ New Offer</RVButton>}
        <div className="offer-inbox-buckets">
          <BucketLink
            label="Inbox"
            active={bucket === 'inbox'}
            icon={<InboxIcon width="16" height="16"/>}
            count={unreadCount}
            onClick={this.handleBucketSelect('inbox')}
          />
          <BucketLink
            label="Sent"
            active={bucket === 'sent'}
            icon={<SentIcon width="16" height="16"/>}
            onClick={this.handleBucketSelect('sent')}
          />
          <BucketLink
            label="Drafts"
            active={bucket === 'drafts'}
            icon={<DraftIcon width="16" height="16"/>}
            count={draftCount}
            onClick={this.handleBucketSelect('drafts')}
          />
          <BucketLink
            label="Archives"
            active={bucket === 'archives'}
            icon={<ArchiveIcon width="16" height="16"/>}
            onClick={this.handleBucketSelect('archives')}
          />
        </div>
        <Divider />
        <div className="offer-inbox-filter offer-inbox-relationship-filter">
          <h6>Quick Sort</h6>
          {RELATIONSHIP_FILTERS.map((val, i) => (
            <RelationshipFilterItem 
              key={`offer-inbox-relationship-filter-item-${i}`} 
              value={val} 
              active={relationshipFilter === val}
              onSelect={onRelationshipFilterSelect}
            />
          ))}
        </div>
        <Divider />
        <div className="offer-inbox-filter offer-inbox-address-filter">
          <h6>Listings</h6>
          <div className="offer-inbox-filter-items">
            {addressFilters.map(({ label, value }, i) => (
              <AddressFilterItem 
                key={`offer-inbox-address-filter-item-${i}`} 
                label={label}
                value={value} 
                active={addressFilter === value}
                onSelect={onAddressFilterSelect}
              />
            ))}
          </div>
        </div>
      </div>
    )
  }
}

export default OfferInboxSidebar;