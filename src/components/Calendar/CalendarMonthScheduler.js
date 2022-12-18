/* Copyright (C) RealtyView, Inc. - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Terence Co <terence@realtyview.com>
 */

import React from 'react';
import classNames from 'classnames';
import {
  addDays,
  addWeeks,
  getWeeksInMonth,
  isToday,
  startOfMonth,
  startOfWeek,
} from 'date-fns';

import '../../styles/Calendar/CalendarMonthScheduler.scss';

import CalendarSchedulerContext from './CalendarSchedulerContext';
import CalendarMonthSchedulerEvents from './CalendarMonthSchedulerEvents';

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const HeaderRow = props => {
  return (
    <tr className="calendar-month-scheduler-header-row">
      {WEEKDAYS.map((weekday, i) => (
        <th key={`calendar-month-scheduler-header-cell-${i}`} className="calendar-month-scheduler-header-cell">{weekday}</th>
      ))}
    </tr>
  );
}

const Row = props => {
  const { startDate, activeMonth } = props;
  return (
    <tr className="calendar-month-scheduler-row">
      {WEEKDAYS.map((weekday, i) => (
        <Cell key={`calendar-month-scheduler-cell-${i}`} date={addDays(startDate, i)} activeMonth={activeMonth}/>
      ))}
    </tr>
  );
}

const Cell = props => {
  const { date, activeMonth } = props;
  return (
    <td className={classNames({
      'calendar-month-scheduler-cell': true,
      'calendar-month-scheduler-cell-current-date': isToday(date),
      'calendar-month-scheduler-cell-active-month': date.getMonth() === activeMonth,
    })}>
      <div className="calendar-month-scheduler-cell-label">{date.getDate()}</div>
    </td>
  );
}

class CalendarMonthScheduler extends React.Component {
  static contextType = CalendarSchedulerContext;

  render() {
    const { events, refDate, condensed } = this.context;
    const month = refDate.getMonth();

    // The first day in the first week of the month
    const startDate = startOfWeek(startOfMonth(refDate));
    const weeksInMonth = getWeeksInMonth(refDate);
    return (
      <div className={classNames(
        'calendar-scheduler',
        'calendar-month-scheduler',
        condensed && 'calendar-month-scheduler-condensed'
      )}>
        <table className="calendar-month-scheduler-table">
          <thead>
            <HeaderRow />
          </thead>
          <tbody>
            {[...Array(weeksInMonth)].map((v, i) => (
              <Row 
                key={`calendar-month-scheduler-row-${i}`} 
                startDate={addWeeks(startDate, i)} 
                activeMonth={month} 
              />
            ))}
          </tbody>
        </table>
        <CalendarMonthSchedulerEvents 
          className="calendar-month-scheduler-events-overlay" 
          events={events} 
          startDate={startDate} 
          weeks={weeksInMonth} 
          condensed={condensed}
        />
      </div>
    );
  }
}

export default CalendarMonthScheduler;