import React from 'react';
import classNames from 'classnames';
import { CheckboxGroup, Checkbox } from 'rsuite';

import '../../styles/Calendar/CalendarSchedulerFilter.scss';

import CalendarSchedulerContext from './CalendarSchedulerContext';

class CalendarSchedulerFilter extends React.Component {
  static contextType = CalendarSchedulerContext;

  constructor(props) {
    super(props);
    this.state = { filters: [] };
  }

  handleChange = (filters) => {
    if (this.context.filterEvents) this.context.filterEvents(filters);
    this.setState({ filters });
  }

  render() {
    const { categories } = this.context;
    const { horizontal } = this.props;
    const cols = 2;
    const itemsPerCol = Math.ceil(categories.length / cols)
    return (
      <div className={classNames(
        'calendar-scheduler-filter', 
        horizontal && 'calendar-scheduler-filter-horizontal',
      )}>
        <h6 className="calendar-scheduler-filter-title">Category</h6>
        {!horizontal ? (
          <CheckboxGroup
            className="calendar-scheduler-filter-checkbox-group"
            value={this.state.filters}
            onChange={this.handleChange}
          >
            {categories.map(({ id, name, color }) => (
              <Checkbox 
                className={classNames(
                  'calendar-scheduler-filter-checkbox',
                  `calendar-scheduler-filter-checkbox-${color}`,
                )}
                key={`calendar-scheduler-filter-checkbox-${id}`}
                value={id}
              >{name}</Checkbox>
            ))}
          </CheckboxGroup>
        ) : (
          <CheckboxGroup
            className="calendar-scheduler-filter-checkbox-group calendar-scheduler-filter-checkbox-group-horizontal"
            value={this.state.filters}
            onChange={this.handleChange}
          > 
            {[...Array(cols)].map((e, i) => (
              <div key={`calendar-scheduler-filter-checkbox-col-${i}`} className="calendar-scheduler-filter-checkbox-col">
                {categories.slice(i * itemsPerCol, (i + 1) * itemsPerCol).map(({ id, name, color }) => (
                  <Checkbox 
                    className={classNames(
                      'calendar-scheduler-filter-checkbox',
                      `calendar-scheduler-filter-checkbox-${color}`,
                    )}
                    key={`calendar-scheduler-filter-checkbox-${id}`}
                    value={id}
                  >{name}</Checkbox>
                ))}
              </div>
            ))}
          </CheckboxGroup>
        )}
      </div>
    );
  }
}

export default CalendarSchedulerFilter;