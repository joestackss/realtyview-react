/* Copyright (C) RealtyView, Inc. - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Terence Co <terence@realtyview.com>
 */

import React from 'react';
import classNames from 'classnames';
import { connect } from 'react-redux';
import MediaQuery from 'react-responsive';
import { 
  addDays,
  addMonths,
  addWeeks,
  addYears,
  format as dateFormat,
  startOfDay,
  startOfMonth,
  startOfWeek,
  startOfYear, 
} from 'date-fns';

import { fetchCalendarData, filterCalendarData, upsertCalendarEvent, upsertCalendarCategory, deleteCalendarEvent } from '../../actions/calendar';
import RelationshipsData from '../../data/relationships.json';
import '../../styles/Calendar/CalendarSchedulerPage.scss';
import RVPrompt from '../../components/shared/RVPrompt';

import CalendarAddCategoryModal from './CalendarAddCategoryModal';
import CalendarDeleteEventModal from './CalendarDeleteEventModal';
import CalendarMonthScheduler from './CalendarMonthScheduler';
import CalendarSchedulerContext from './CalendarSchedulerContext';
import CalendarSchedulerControls from './CalendarSchedulerControls';
import CalendarSchedulerFilter from './CalendarSchedulerFilter';

class CalendarSchedulerPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      type: 'month',
      refDate: new Date(), 
      showAddCategoryModal: false,
      deletePromptEventId: null,
    };
  }

  componentDidMount() {
    this.props.fetchData();
  }

  // Calendar Control Handlers

  changeCalendarType = type => {
    this.setState({ type: type });
  }

  goToToday = () => {
    this.setState({ refDate: new Date() });
  }

  goToPrevious = () => {
    const { refDate, type } = this.state;
    this.setState({ refDate: this.navigateDate(refDate, -1, type) });
  } 

  goToNext = () => {
    const { refDate, type } = this.state;
    this.setState({ refDate: this.navigateDate(refDate, 1, type) });
  }

  setAddCategoryModalVisibility = (visible) => {
    this.setState({ showAddCategoryModal: visible });
  }

  promptDeleteEvent = (eventId) => {
    this.setState({ deletePromptEventId: eventId });
  }

  closeDeletePrompt = () => {
    this.setState({ deletePromptEventId: null });
  }

  deleteEventFromPrompt = () => {
    const { deletePromptEventId } = this.state;
    const { deleteEvent } = this.props;
    if (deletePromptEventId != null) {
      deleteEvent(deletePromptEventId, { 
        success: () => {
          this.closeDeletePrompt();
        },
      });
    }
  }

  fetchRelationships = () => {
    return RelationshipsData.relationships;
  }

  navigateDate(refDate, amount, unit) {
    if (unit === 'day') {
      return addDays(startOfDay(refDate), amount);
    } else if (unit === 'week') {
      return addWeeks(startOfWeek(refDate), amount);
    } else if (unit === 'month') {
      return addMonths(startOfMonth(refDate), amount);
    } else if (unit === 'year') {
      return addYears(startOfYear(refDate), amount);
    }
  }

  render() {
    const { events, categories, isLoading } = this.props;
    const { refDate, showAddCategoryModal, deletePromptEventId } = this.state;
    const calendarLabel = dateFormat(this.state.refDate, 'MMMM yyyy');
    return (
      <MediaQuery maxWidth={991}>
        {condensed => (
          <CalendarSchedulerContext.Provider value={{
            refDate,
            events,
            categories,
            isLoading,
            showAddCategoryModal,
            changeCalendarType: this.changeCalendarType,
            goToToday: this.goToToday,
            goToPrevious: this.goToPrevious,
            goToNext: this.goToNext,
            setAddCategoryModalVisibility: this.setAddCategoryModalVisibility,
            promptDeleteEvent: this.promptDeleteEvent,
            upsertEvent: this.props.upsertEvent,
            deleteEvent: this.props.deleteEvent,
            upsertCategory: this.props.upsertCategory,
            filterEvents: this.props.filterEvents,
            fetchRelationships: this.fetchRelationships,
            condensed,
          }}>
            <div className="calendar-scheduler-page">
              <CalendarSchedulerControls label={calendarLabel}/>
              <div className={classNames(
                'calendar-scheduler-body', 
                condensed && 'calendar-scheduler-body-condensed',
                !condensed && 'calendar-scheduler-body-full',
              )}>
                <CalendarSchedulerFilter horizontal={condensed}/>
                <CalendarMonthScheduler />
              </div>
            </div>
            <CalendarAddCategoryModal />
            <RVPrompt 
              show={deletePromptEventId != null}
              onCancel={this.closeDeletePrompt}
              cancelBtnTitle="Cancel"
              onAccept={this.deleteEventFromPrompt}
              acceptBtnTitle="Delete"
              acceptBtnPalette="danger"
            >
              Are you sure you would like to delete this event?
            </RVPrompt>
            <CalendarDeleteEventModal />
          </CalendarSchedulerContext.Provider>
        )}
      </MediaQuery>
    );
  }
}

const mapStateToProps = state => ({
  isLoading: state.calendar.isLoading,
  events: state.calendar.filteredEvents,
  categories: state.calendar.categories, 
});

const mapDispatchToProps = dispatch => ({
  fetchData: () => dispatch(fetchCalendarData()),
  filterEvents: (filteredCategories) => dispatch(filterCalendarData(filteredCategories)),
  upsertEvent: (event, callbacks) => dispatch(upsertCalendarEvent(event, callbacks)),
  deleteEvent: (eventId, callbacks) => dispatch(deleteCalendarEvent(eventId, callbacks)),
  upsertCategory: (category, callbacks) => dispatch(upsertCalendarCategory(category, callbacks)),
});

export default connect(mapStateToProps, mapDispatchToProps)(CalendarSchedulerPage)
