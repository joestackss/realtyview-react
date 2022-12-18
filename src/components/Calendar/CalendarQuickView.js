import React from 'react';
import classNames from 'classnames'
import { format as dateFormat } from 'date-fns';
import Markdown from 'react-markdown';
import { withRouter } from 'react-router-dom';
import { 
  IconButton,
  Popover, 
  ButtonToolbar,
  Whisper,
} from 'rsuite';

import UserData from '../../data/user.json';
import { ReactComponent as CircleIcon } from '../../images/icons/circle.svg';
import { ReactComponent as DescriptionIcon } from '../../images/icons/description-icon.svg';
import { ReactComponent as GuestsIcon } from '../../images/icons/guests-icon.svg';
import { ReactComponent as LocationIcon } from '../../images/icons/location-icon.svg';
import { ReactComponent as DeleteIcon } from '../../images/icons/delete-icon.svg';
import { ReactComponent as EditIcon } from '../../images/icons/edit-icon.svg';
import { ReactComponent as CloseIcon } from '../../images/icons/close-icon.svg';

import CalendarSchedulerContext from './CalendarSchedulerContext';

import '../../styles/Calendar/CalendarQuickView.scss';

class CalendarQuickViewPopover extends React.Component {
  static contextType = CalendarSchedulerContext;

  getDateDetails(event) {
    const dateDetails = [];
    const baseDateFormat = 'MMM d, yyyy';
    if (event.dateCoverage > 1) {
      const fromDateFormat = !event.isAllDay ? (event.from.getMinutes() === 0 ? baseDateFormat.concat(' (h a)') : baseDateFormat.concat(' (h:mm a)')) : baseDateFormat;
      const toDateFormat = !event.isAllDay ? (event.to.getMinutes() === 0 ? baseDateFormat.concat(' (h a)') : baseDateFormat.concat(' (h:mm a)')) : baseDateFormat;
      dateDetails.push(`${dateFormat(event.from, fromDateFormat)} - ${dateFormat(event.to, toDateFormat)}`);
    } else {
      dateDetails.push(dateFormat(event.from, 'EEEE'));
      dateDetails.push(dateFormat(event.from, baseDateFormat));
      if (!event.isAllDay) {
        const fromTimeString = dateFormat(event.from, event.from.getMinutes() === 0 ? 'h a' : 'h:mm a');
        const toTimeString = dateFormat(event.to, event.to.getMinutes() === 0 ? 'h a' : 'h:mm a');
        // If both have the same AM/PM value, keep only AM/PM of toTimeString
        if (fromTimeString.slice(-2) === toTimeString.slice(-2)) {
          dateDetails.push(`${fromTimeString.slice(0, -3)} - ${toTimeString}`);
        } else {
          dateDetails.push(`${fromTimeString} - ${toTimeString}`);
        }
      }
    }
    if (event.isAllDay) {
      dateDetails.push('All day');
    }
    return dateDetails;
  }

  handleDeleteEvent = () => {
    const { event } = this.props;
    const { promptDeleteEvent } = this.context;
    this.handleClose();
    promptDeleteEvent(event.id);
  }

  handleEditEvent = () => {
    const { event, history } = this.props;
    history.push(`/calendar/event/${event.id}`);
  }

  handleClose = () => {
    this.getTriggerRef().close();
  }

  getTriggerRef() {
    const { triggerRef } = this.props;
    if (typeof triggerRef === 'function') {
      return triggerRef();
    } else {
      return triggerRef;
    }
  }

  render() {
    const { staticContext, triggerRef, event, ...props } = this.props;
    const canEdit = (event.organizer.email === UserData.user.email);
    const eventDateDetails = this.getDateDetails(event);
    return (
      <Popover 
        {...props} 
        className={classNames(this.props.className, 'calendar-quick-view-popover')} 
      >
        <ButtonToolbar className="calendar-quick-view-controls">
          {canEdit && <IconButton className="calendar-quick-view-control" appearance="subtle" size="sm" circle icon={<DeleteIcon width="16" height="16" />} onClick={this.handleDeleteEvent}/>}
          {canEdit && <IconButton className="calendar-quick-view-control" appearance="subtle" size="sm" circle icon={<EditIcon width="16" height="16" />} onClick={this.handleEditEvent}/>}
          <IconButton className="calendar-quick-view-control" appearance="subtle" size="sm" circle icon={<CloseIcon width="16" height="16" />} onClick={this.handleClose}/>
        </ButtonToolbar>
        <div className="calendar-quick-view-scroll-container">
          <div className="calendar-quick-view-row calendar-quick-view-header-row">
            <CircleIcon 
              className={classNames(
                'calendar-icon',
                event.category && event.category.color ? `calendar-icon-${event.category.color}` : null,
              )} 
              width="16" 
              height="16" 
            />
            <div className="calendar-quick-view-header">
              <h4 className="calendar-quick-view-title">{event.title}</h4>
              <div className="calendar-quick-view-time-details">
                {eventDateDetails.map((val, i) => <span key={`calendar-quick-view-time-detail-${i}`}>{val}</span>)}              
              </div>
            </div>
          </div>
          {event.guests && event.guests.length > 0 && <div className="calendar-quick-view-row calendar-quick-view-guests-row">
            <GuestsIcon className="calendar-icon" width="16" height="16" />
            <div className="calendar-quick-view-row-content">
              <div className="calendar-quick-view-guest-count">{event.guests.length + 1} guests</div>
              <div className="calendar-quick-view-guest-item">{event.organizer.name ? event.organizer.name : event.organizer.email}&nbsp;&nbsp;&nbsp;Organizer</div>
              {event.guests.map((g, i) => (
                <div key={`calendar-quick-view-guest-item-${i}`} className="calendar-quick-view-guest-item">{g.name ? g.name : g.email}</div>
              ))}
            </div>
          </div>}
          {event.location && event.location.trim() && <div className="calendar-quick-view-row calendar-quick-view-location-row">
            <LocationIcon className="calendar-icon" width="16" height="16" />
            <div className="calendar-quick-view-row-content">{event.location}</div>
          </div>}
          {event.description && event.description.trim() && <div className="calendar-quick-view-row calendar-quick-view-description-row">
            <DescriptionIcon className="calendar-icon" width="16" height="16" />
            <div className="calendar-quick-view-row-content">
              <Markdown source={event.description} />
            </div>
          </div>}
        </div>
      </Popover>
    );
  }
}

CalendarQuickViewPopover = withRouter(CalendarQuickViewPopover);

class CalendarQuickViewTrigger extends React.Component {
  constructor(props) {
    super(props);
    this.triggerRef = React.createRef();
  }
  
  render() {
    const { children, speaker, event, ...props } = this.props;
    return (
      <Whisper 
        {...props}
        ref={(ref) => { this.triggerRef = ref }}
        speaker={<CalendarQuickViewPopover triggerRef={() => this.triggerRef} event={event}/>} 
      >{children}</Whisper>
    );
  }
}

export default {
  Popover: CalendarQuickViewPopover,
  Trigger: CalendarQuickViewTrigger,
};
