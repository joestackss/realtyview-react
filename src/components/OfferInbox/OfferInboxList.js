import React from 'react';
import { format as dateFormat, isSameDay, isSameYear } from 'date-fns';
import classNames from 'classnames';
import { ButtonToolbar, IconButton, Table } from 'rsuite';

import { ReactComponent as ArchiveIcon } from '../../images/icons/archive-icon.svg';
import { ReactComponent as EyeIcon } from '../../images/icons/eye-icon.svg';
import { ReactComponent as MarkAsUnreadIcon } from '../../images/icons/mark-as-unread-icon.svg';
import '../../styles/OfferInbox/OfferInboxList.scss';
import { sortOffers } from '../../services/offers';

import OfferInboxContext from './OfferInboxContext';

const InboxCell = ({ rowData, dataKey, className, children, textTransform, end, ...props }) => {
  return (
    <Table.Cell 
      {...props} 
      dataKey={dataKey}
      className={classNames(
        className, 
        !rowData.is_read && 'offer-inbox-list-unread-cell'
      )}
      style={textTransform && { textTransform }}
    >
      {children || rowData[dataKey] || <span className="offer-inbox-value-na">N/A</span>}
      {end && <div className="offer-inbox-list-item-hover-menu">
        <ButtonToolbar>
          <IconButton 
            appearance="subtle" 
            circle 
            size="sm" 
            icon={<EyeIcon width="14" height="14" />}
            onClick={e => { e.stopPropagation() }}
          />
          <IconButton 
            appearance="subtle" 
            circle 
            size="sm" 
            icon={<ArchiveIcon width="14" height="14" />}
            onClick={e => { e.stopPropagation() }}
          />
          <IconButton 
            appearance="subtle" 
            circle 
            size="sm" 
            icon={<MarkAsUnreadIcon width="14" height="14" />}
            onClick={e => { e.stopPropagation() }}
          />
        </ButtonToolbar>
      </div>}
    </Table.Cell>
  );
}

const ClientCell = ({ rowData, className, ...props }) => {
  return (
    <InboxCell 
      {...props} 
      rowData={rowData}
      className={classNames(className, 'offer-inbox-list-client-cell')}
    >
      <div 
        className={classNames(
          'offer-inbox-marker', 
          `offer-inbox-marker-${rowData.client_relationship_type}`
        )}
        style={{ width: '7px', height: '7px' }}
      ></div>
      {rowData.client_name}
    </InboxCell>
  )
} 

const CreatedCell = ({ rowData, className, refDate, ...props }) => {
  let dateString = '';
  if (isSameDay(refDate, rowData.created)) {
    dateString = dateFormat(rowData.created, "'Today' - h:mm a");
  } else if (isSameYear(refDate, rowData.created)) {
    dateString = dateFormat(rowData.created, 'MMM d - h:mm a');
  } else {
    dateString = dateFormat(rowData.created, 'MM/dd/yyyy');
  }
  return (
    <InboxCell 
      {...props} 
      rowData={rowData}
      className={classNames(className, 'offer-inbox-list-client-cell')}
    >
      {dateString}
    </InboxCell>
  )
}

const StatusCell = ({ rowData, className, ...props }) => {
  return (
    <InboxCell 
      {...props} 
      rowData={rowData}
      className={classNames(className, 'offer-inbox-list-client-cell')}
    >
      <div className={classNames('offer-inbox-status-tag', `offer-inbox-status-tag-${rowData.status.replace(' ', '-')}`)}>
        {rowData.status}
      </div>
    </InboxCell>
  )
} 

class OfferInboxList extends React.Component {
  static contextType = OfferInboxContext;

  handleSortColumn = (sortColumn, sortType) => {
    const { onSortColumn } = this.context;
    onSortColumn(sortColumn, sortType);
  }

  handleOfferClick = (offer) => {
    const { showOfferDisplay } = this.context;
    showOfferDisplay(offer.id);
  }

  render() {
    const { bucket, offers, sortColumn, sortType } = this.context;
    const isDraftOrArchived = bucket === 'drafts' || bucket === 'archives';
    const refDate = new Date();
    return (
      <Table
        className="offer-inbox-list"
        height={700}
        headerHeight={42}
        data={offers}
        rowKey="id"
        sortColumn={sortColumn}
        sortType={sortType}
        onSortColumn={this.handleSortColumn}
        renderEmpty={() => (
          <div className="rs-table-body-info">No offers found</div>
        )}
        onRowClick={this.handleOfferClick}
      >
        {isDraftOrArchived && <Table.Column width={100} fixed>
          <Table.HeaderCell></Table.HeaderCell>
          <InboxCell dataKey="status" textTransform="capitalize" />
        </Table.Column>}
        <Table.Column width={175} fixed sortable>
          <Table.HeaderCell>Client (Relationship)</Table.HeaderCell>
          <ClientCell dataKey="client_name" />
        </Table.Column>
        <Table.Column width={150} fixed sortable>
          <Table.HeaderCell>Date & Time</Table.HeaderCell>
          <CreatedCell dataKey="created" refDate={refDate} />
        </Table.Column>
        {!isDraftOrArchived && <Table.Column width={100} fixed sortable>
          <Table.HeaderCell>Status</Table.HeaderCell>
          <StatusCell dataKey="status" />
        </Table.Column>}
        <Table.Column flexGrow={1}>
          <Table.HeaderCell>Address</Table.HeaderCell>
          <InboxCell dataKey="address"/>
        </Table.Column>
        <Table.Column width={200} fixed sortable>
          <Table.HeaderCell>Agent</Table.HeaderCell>
          <InboxCell dataKey="broker_name" end/>
        </Table.Column>               
      </Table>
    )
  }
}

export default OfferInboxList;