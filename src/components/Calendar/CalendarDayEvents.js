import React from 'react';
import classNames from 'classnames';
import { format as dateFormat } from 'date-fns';
import { Popover, Whisper } from 'rsuite';

import CalendarQuickView from './CalendarQuickView';

import '../../styles/Calendar/CalendarDayEvents.scss';

const Item = props => {
  const { event } = props;
  const timeString = dateFormat(event.from, event.from.getMinutes() ? 'h:mmaaaaa' : 'haaaaa')
  const isShortEvent = !event.isAllDay && event.dateCoverage === 1;
  return (
    <CalendarQuickView.Trigger trigger="click" placement="auto" preventOverflow event={event}>
      <div className="calendar-day-events-item-wrapper">
        {isShortEvent && <div className="calendar-day-events-item-time">{timeString}</div>}
        <div className={classNames(
          'calendar-day-events-item', 
          isShortEvent && 'calendar-day-events-item-short',
          `calendar-day-events-item-${event.category.color}`,
        )}>
          {!event.isAllDay && !isShortEvent && <span style={{float: 'left'}}>{timeString} </span>}
          {event.title}
        </div>
      </div>
    </CalendarQuickView.Trigger>
  );
}

class CalendarDayEventsPopover extends React.Component {

  getTriggerRef() {
    const { triggerRef } = this.props;
    if (typeof triggerRef === 'function') {
      return triggerRef();
    } else {
      return triggerRef;
    }
  }

  render() {
    const { staticContext, triggerRef, events, date, ...props } = this.props;
    return (
      <Popover 
        {...props} 
        className={classNames(this.props.className, 'calendar-day-events-popover')} 
      >
        <div className="calendar-day-events-header">
          <h3 className="calendar-day-events-date">{dateFormat(date, "d")}</h3>
          <span className="calendar-day-events-day">{dateFormat(date, "EEE")}</span>
        </div>
        <div>
          {events.map((event, i) => <Item key={`calendar-day-events-item-${i}`} event={event} />)}
        </div>
      </Popover>
    );
  }
}

class CalendarDayEventsTrigger extends React.Component {
  constructor(props) {
    super(props);
    this.triggerRef = React.createRef();
  }
  
  render() {
    const { children, speaker, events, date, ...props } = this.props;
    return (
      <Whisper 
        {...props}
        ref={(ref) => { this.triggerRef = ref }}
        speaker={<CalendarDayEventsPopover triggerRef={() => this.triggerRef} events={events} date={date}/>} 
      >{children}</Whisper>
    );
  }
}

export default {
  Popover: CalendarDayEventsPopover,
  Trigger: CalendarDayEventsTrigger,
};