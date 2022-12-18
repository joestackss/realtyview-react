import React from 'react';
import classNames from 'classnames';
import { useMediaQuery } from 'react-responsive';
import {
  addDays,
  addWeeks,
  differenceInCalendarDays,
  endOfDay,
  endOfWeek,
  format as dateFormat,
} from 'date-fns';

import '../../styles/Calendar/CalendarMonthSchedulerEvents.scss';

import CalendarQuickView from './CalendarQuickView';
import CalendarDayEvents from './CalendarDayEvents';
import CalendarSchedulerContext from './CalendarSchedulerContext';

function getArrangedEventsForWeek(sortedEvents, startDate, endDate, rows) {
  /*
  Stack events for the Calendar's Month Scheduler UI.

  Args:
    sortedEvents: CalendarEvent[]
    startDate: Date
    endDate: Date
    rows: number
  Returns: {
    displayedEventIndexesByDate: number[][]
    hiddenEventIndexesByDate: number[][]
  }

  This assumes that the events are already sorted by `sortCalendarEventsForStacking`.
  This will stack the events based on current sort order and the available space in 
  the calendar dictated by the `rows` argument. `cols` is set to be the number of days
  between startDate and endDate.

  `displayedEventIndexesByDate` is a `cols` x `rows` 2-D array that specifies the event
  index present in the cell. Note that an event can span more than one cell in a row,
  depending on its dateCoverage. Empty cells are marked as null.

  `hiddenEventIndexesByDate` is a `cols` array that contains an array of hidden events
  indexes for that column/date. This is used to fill the "more" button shown in Month
  Scheduler.

  Note that event index, in this context, is its position in `sortedEvents` and not to be
  confused with the event's id field.
  */

  const cols = differenceInCalendarDays(endDate, startDate) + 1;

  const displayedEventIndexesByDate = [...Array(cols)].map(() => Array(rows).fill(null));
  const hiddenEventIndexesByDate = [...Array(cols)].map(() => []); 
  
  let colIndex = 0
  let eod = endOfDay(startDate);
  for (const eventIndex in sortedEvents) {
    const event = sortedEvents[eventIndex];
    // This event and all events after are not included in the interval
    if (event.from > endDate) break; 
    // Find the column where the event belongs to
    while (event.from > eod) {
      colIndex += 1
      eod = addDays(eod, 1);
    }
    const daysCovered = Math.min(differenceInCalendarDays(event.to, eod) + 1, cols - colIndex)
    if (colIndex >= cols) break;
    let addedEvent = false;
    for (let rowIndex = 0; rowIndex < rows; rowIndex++) {
      if (displayedEventIndexesByDate[colIndex][rowIndex] != null) continue;

      // Fill the whole date coverage of the event or until end of week
      for (let i = 0; i < daysCovered; i++) {
        displayedEventIndexesByDate[colIndex + i][rowIndex] = eventIndex;
      }
      addedEvent = true;
      break;
    }
    if (!addedEvent) {
      // Fill the whole date coverage of the event or until end of week
      for (let i = 0; i < daysCovered; i++) {
        hiddenEventIndexesByDate[colIndex + i].push(eventIndex);
      }
    }
  }
  
  return { displayedEventIndexesByDate, hiddenEventIndexesByDate };
}

function getEventDisplayData(displayedEventIndexesByDate) {
  /*
  Convert cell data from `displayedEventIndexesByDate` into concrete display 
  data that can be used by the `Item` component.

  Args: 
    displayedEventIndexesByDate: number[][]
  Returns: { 
    index: number;
    row: number;
    col: number;
    colSpan: number;
  }[]

  Note that event index, in this context, is its position in `sortedEvents` and not to be
  confused with the event's id field.
  */
  const eventDisplayData = [];
  const rows = displayedEventIndexesByDate[0].length;
  for (let row = 0; row < rows; row++) {
    let currentEventIndex = null;
    let currentEventDisplayData = null;
    for (let col = 0; col < displayedEventIndexesByDate.length; col++) {
      const index = displayedEventIndexesByDate[col][row];
      if (currentEventIndex !== index) {
        if (currentEventIndex != null) {
          eventDisplayData.push(currentEventDisplayData);
          currentEventDisplayData = null;
        }
        if (index != null) {
          currentEventDisplayData = { index, row, col, colSpan: 1 };
          currentEventIndex = index;
        } else {
          currentEventDisplayData = null;
          currentEventIndex = null;
        }
      } else {
        if (index != null) {
          currentEventDisplayData.colSpan += 1;
        }
      }
    }
    if (currentEventIndex != null) {
      eventDisplayData.push(currentEventDisplayData);
    }
  }
  return eventDisplayData;
}

const Display = props => {
  const { events, startDate, height, rows, condensed } = props;
  // The bottom row contains the hidden events
  const displayRows = rows - 1;
  const endDate = endOfWeek(startDate);
  const weekEvents = events.filter(event => differenceInCalendarDays(endDate, event.from) >= 0 && differenceInCalendarDays(event.to, startDate) >= 0);
  const { displayedEventIndexesByDate, hiddenEventIndexesByDate } = getArrangedEventsForWeek(weekEvents, startDate, endDate, displayRows);
  const eventDisplayData = getEventDisplayData(displayedEventIndexesByDate);

  return (
    <div className="calendar-month-scheduler-events-display" style={{ height, fontSize: height / rows }}>
      {eventDisplayData.map(({ index, row, col, colSpan }) => {
        const event = weekEvents[index];
        return <Item 
          key={`calendar-month-scheduler-events-item-${event.id}`}
          event={event}
          row={row}
          col={col}
          colSpan={colSpan}
          extendLeft={event.from < startDate}
          extendRight={event.to > endDate}
          hideTime={condensed}
        />
      })}
      {hiddenEventIndexesByDate.map((eventIndexes, i) => (
        eventIndexes.length > 0 &&
        <MoreItems
          key={`calendar-month-scheduler-events-more-items-${i}`}
          events={weekEvents}
          hiddenItemCount={eventIndexes.length}
          startDate={addDays(startDate, i)}
          row={displayRows}
          col={i}
        />
      ))}
    </div>
  );
}

const Item = props => {
  const { event, row, col, colSpan, extendLeft, extendRight, hideTime } = props;
  const timeString = dateFormat(event.from, event.from.getMinutes() ? 'h:mmaaaaa' : 'haaaaa')
  const isShortEvent = !event.isAllDay && event.dateCoverage === 1
  return (
    <CalendarQuickView.Trigger trigger="click" placement="auto" preventOverflow event={event}>
      <div 
        className={classNames({
          'calendar-month-scheduler-events-item-wrapper': true,
          'calendar-month-scheduler-events-item-extend-left': extendLeft,
          'calendar-month-scheduler-events-item-extend-right': extendRight,
        })}
        style={{
          position: 'absolute',
          top: `${row}em`,
          left: `${col * 100 / 7}%`,
          width: `${colSpan * 100 / 7}%`,
          height: '1em',
        }}
      >
        {!hideTime && isShortEvent && <div className="calendar-month-scheduler-events-item-time">{timeString}</div>}
        <div className={classNames(
          'calendar-month-scheduler-events-item', 
          !hideTime && isShortEvent && 'calendar-month-scheduler-events-item-short',
          `calendar-month-scheduler-events-item-${event.category.color}`,
        )}>
          {!hideTime && !event.isAllDay && !isShortEvent && !extendLeft && <span style={{float: "left"}}>{timeString} </span>}
          {event.title}
        </div>
      </div>
    </CalendarQuickView.Trigger>
  );
}

const MoreItems = props => {
  const { events, hiddenItemCount, startDate, row, col } = props;
  const dayEvents = events.filter(event => differenceInCalendarDays(startDate, event.from) >= 0 && differenceInCalendarDays(event.to, startDate) >= 0);
  return (
    <CalendarDayEvents.Trigger trigger="click" placement="top" preventOverflow events={dayEvents} date={startDate}>
      <div 
        className="calendar-month-scheduler-events-item-wrapper"
        style={{
          position: 'absolute',
          top: `${row}em`,
          left: `${col * 100 / 7}%`,
          width: `${100 / 7}%`,
          height: '1em',
        }}
      >
        <div className={classNames(
          'calendar-month-scheduler-events-item', 
          'calendar-month-scheduler-events-more-items'
        )}>{`${hiddenItemCount} more`}</div>
      </div>
    </CalendarDayEvents.Trigger>
  );
}

class CalendarMonthSchedulerEvents extends React.Component {
  static contextType = CalendarSchedulerContext;

  // NOTE: Sync these values with CSS styles
  headerHeight = 42;
  labelHeight = 30;

  render() {
    const { className, startDate, weeks, condensed } = this.props;
    const { events } = this.context;
    const calendarHeight = condensed ? 585 : 700;
    const displayCellHeight = condensed ? 18 : 25;
    const weekDisplayHeight = (calendarHeight - this.headerHeight) / weeks - this.labelHeight;
    const rows = Math.floor(weekDisplayHeight / displayCellHeight);
    return (
      <table className={classNames(
        className, 
        'calendar-month-scheduler-events-table', 
        `calendar-month-scheduler-events-${weeks}-weeks`, 
        condensed && 'calendar-month-scheduler-events-condensed',
      )}>
        <thead><tr><th></th></tr></thead>
        <tbody>
          {[...Array(weeks)].map((v, i) => (
            <tr key={`calendar-month-scheduler-events-row-${i}`} className="calendar-month-scheduler-events-row">
              <td>
                <Display events={events} startDate={addWeeks(startDate, i)} height={weekDisplayHeight} rows={rows} condensed={condensed}/>
              </td> 
            </tr>
          ))}
        </tbody>
      </table>
    );
  }
}

export default CalendarMonthSchedulerEvents;