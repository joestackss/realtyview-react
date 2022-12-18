/* Copyright (C) RealtyView, Inc. - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Terence Co <terence@realtyview.com>
 */

import React from 'react';
import { Link } from 'react-router-dom';
import {
  ButtonToolbar,
  Dropdown,
  Icon,
  IconButton,
} from 'rsuite';

import RVButton from '../shared/RVButton';
import { ReactComponent as SettingsIcon } from '../../images/icons/settings-icon.svg';
import '../../styles/Calendar/CalendarSchedulerControls.scss';

import CalendarSchedulerContext from './CalendarSchedulerContext';
import CalendarQuickAdd from './CalendarQuickAdd';

class CalendarSchedulerControls extends React.Component {
  static contextType = CalendarSchedulerContext;

  handleTodayClick = () => {
    if (this.context.goToToday) this.context.goToToday();
  }

  handlePreviousClick = () => {
    if (this.context.goToPrevious) this.context.goToPrevious();
  }

  handleNextClick = () => {
    if (this.context.goToNext) this.context.goToNext();
  }

  handleAddCategory = () => {
    if (this.context.setAddCategoryModalVisibility) this.context.setAddCategoryModalVisibility(true);
  }

  render() {
    const { label } = this.props;
    const { condensed } = this.context;
    const settingsButton = (
      <Dropdown 
        className="calendar-settings-btn"
        renderTitle={() => (
          <IconButton appearance="subtle" circle icon={<SettingsIcon width="20" height="20" />} />
        )}
      >
        <Dropdown.Item onSelect={this.handleAddCategory}>Add category</Dropdown.Item>
        <Dropdown.Item disabled>Import &amp; export</Dropdown.Item>
        <Dropdown.Item disabled>More settings</Dropdown.Item>            
      </Dropdown>
    );
    const calendarTypeButton = (
      <Dropdown className="calendar-type-select" title="Month" toggleComponentClass={RVButton} palette="outlined" size="lg">
        <Dropdown.Item>Day</Dropdown.Item>
        <Dropdown.Item>Week</Dropdown.Item>
        <Dropdown.Item>Month</Dropdown.Item>
        <Dropdown.Item>Year</Dropdown.Item>
      </Dropdown>
    );
    return (
      <div className="calendar-scheduler-controls-wrapper">
        {condensed ? (
          <React.Fragment>
            <div className="calendar-scheduler-controls calendar-scheduler-controls-condensed">
              <h4 className="calendar-scheduler-controls-label">{label}</h4>
              <ButtonToolbar className="calendar-scheduler-controls-btn-group">
                <RVButton className="calendar-today-btn" palette="outlined" size="lg" onClick={this.handleTodayClick}>Today</RVButton>
                <Link to="/calendar/event" component={RVButton} className="calendar-add-event-btn" palette="primary" size="lg"><Icon icon="plus"/></Link>
              </ButtonToolbar>
            </div>
            <div className="calendar-scheduler-controls calendar-scheduler-controls-condensed">
              <ButtonToolbar className="calendar-scheduler-controls-btn-group">
                {calendarTypeButton}
              </ButtonToolbar>
              <ButtonToolbar className="calendar-scheduler-controls-btn-group">
                {settingsButton}
                <RVButton className="calendar-nav-btn" palette="light" size="lg" onClick={this.handlePreviousClick}><Icon icon="chevron-left"/></RVButton>
                <RVButton className="calendar-nav-btn" palette="light" size="lg" onClick={this.handleNextClick}><Icon icon="chevron-right"/></RVButton>
              </ButtonToolbar>
            </div>
          </React.Fragment>
        ) : (
          <div className="calendar-scheduler-controls calendar-scheduler-controls-full">
            <h4 className="calendar-scheduler-controls-label">{label}</h4>
            <ButtonToolbar className="calendar-scheduler-controls-btn-group">
              <RVButton className="calendar-today-btn" palette="outlined" size="lg" onClick={this.handleTodayClick}>Today</RVButton>
              <CalendarQuickAdd.Trigger trigger="click" placement="autoVerticalStart" preventOverflow>
                <RVButton className="calendar-add-event-btn" palette="primary" size="lg">Add Event</RVButton>
              </CalendarQuickAdd.Trigger>
            </ButtonToolbar>
            <ButtonToolbar className="calendar-scheduler-controls-btn-group">
              {settingsButton}
              {calendarTypeButton}
              <RVButton className="calendar-nav-btn" palette="light" size="lg" onClick={this.handlePreviousClick}><Icon icon="chevron-left"/></RVButton>
              <RVButton className="calendar-nav-btn" palette="light" size="lg" onClick={this.handleNextClick}><Icon icon="chevron-right"/></RVButton>
            </ButtonToolbar>            
          </div>
        )}
      </div>
    );
  }
}

export default CalendarSchedulerControls;