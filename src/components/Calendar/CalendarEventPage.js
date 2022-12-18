import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import MediaQuery from 'react-responsive';
import classNames from 'classnames';
import { 
  addDays, 
  addMinutes, 
  differenceInCalendarDays, 
  differenceInMinutes,
  isSameDay, 
  set as dateSet,
  startOfDay,
} from 'date-fns';
import * as EmailValidator from 'email-validator';
import {
  Checkbox,
  Col,
  Form,
  Grid,
  Icon,
  IconButton, 
  Input,
  Row
} from 'rsuite';

import { fetchCalendarData, upsertCalendarEvent } from '../../actions/calendar';
import { ReactComponent as CircleIcon } from '../../images/icons/circle.svg';
import { ReactComponent as DescriptionIcon } from '../../images/icons/description-icon.svg';
import { ReactComponent as GuestsIcon } from '../../images/icons/guests-icon.svg';
import { ReactComponent as LocationIcon } from '../../images/icons/location-icon.svg';
import { ReactComponent as CloseIcon } from '../../images/icons/close-icon.svg';
import RVButton from '../shared/RVButton';
import RVDatePicker from '../shared/RVDatePicker';
import RVLocationPicker from '../shared/RVLocationPicker';
import RVPicker from '../shared/RVPicker';
import RVPrompt from '../shared/RVPrompt';
import RVRichTextEditor from '../shared/RVRichTextEditor';
import RelationshipsData from '../../data/relationships.json';

import '../../styles/Calendar/CalendarEventPage.scss';

class CalendarEventPage extends React.Component {
  constructor(props) {
    super(props);
    const { categories } = props;
    const from = startOfDay(new Date());
    const to = addMinutes(from, 15);
    this.state = {
      id: null,
      title: '',
      from,
      to,
      isAllDay: true,
      location: null,
      guests: [],
      category: categories[0],
      description: '',
      guestQuery: '',
      errors: {},
      hasChanges: false,
      nextLocation: null,
      nextAction: null,
    };
    this.possibleGuests = RelationshipsData.relationships.map(r => ({ value: r.email, label: (r.name ? r.name : r.email) }));
    this.relationshipMap = {}
    RelationshipsData.relationships.forEach(r => { this.relationshipMap[r.email] = r });
  }

  componentDidMount() {
    const { eventId } = this.props.match.params;
    const { events, history, fetchData } = this.props;
    fetchData({ 
      success: () => {
        if (eventId == null) return;
        const event = events.find(e => e.id === eventId);
        if (event == null) return;
        const { id, title, from, to, isAllDay, location, guests, category, description } = event;
        this.setState({
          id, title, from, to, isAllDay, location, guests: guests.map(g => g.email), category, description
        });
      },
    });
    history.block(this.handleHistoryChange);
  }

  handleTitleChange = (title) => {
    this.setState({ title, hasChanges: true });
  }

  handleFromDateChange = (fromDate) => {
    if (isSameDay(this.state.from, fromDate)) return;
    const eventDuration = differenceInCalendarDays(this.state.to, this.state.from);
    const newFromDate = dateSet(this.state.from, { 
      year: fromDate.getFullYear(), 
      month: fromDate.getMonth(), 
      date: fromDate.getDate() 
    });
    const newToDate = addDays(newFromDate, eventDuration);
    this.setState({ from: newFromDate, to: newToDate, hasChanges: true });
  }

  handleFromTimeChange = (fromDate) => {
    const eventDuration = differenceInMinutes(this.state.to, this.state.from);
    const newToDate = addMinutes(fromDate, eventDuration);
    this.setState({ from: fromDate, to: newToDate, hasChanges: true });
  }

  handleToDateChange = (toDate) => {
    if (differenceInCalendarDays(toDate, this.state.from) < 0) return;
    const newToDate = dateSet(this.state.to, { 
      year: toDate.getFullYear(), 
      month: toDate.getMonth(), 
      date: toDate.getDate() 
    });
    this.setState({ to: newToDate, hasChanges: true });
  }

  handleToTimeChange = (toDate) => {
    const newToDate = (
      differenceInMinutes(toDate, this.state.from) <= 0 ?
      addDays(toDate, 1) :
      toDate
    );
    this.setState({ to: newToDate, hasChanges: true });
  }

  handleIsAllDayChecked = (v, checked) => {
    if (!checked && differenceInMinutes(this.state.to, this.state.from) <= 0) {
      const newToDate = addMinutes(this.state.from, 15);
      this.setState({ isAllDay: checked, to: newToDate, hasChanges: true });
    } else {
      this.setState({ isAllDay: checked, hasChanges: true });
    }
  }

  handleLocationSelect = (location) => {
    this.setState({ location, hasChanges: true });
  }

  handleLocationChange = (location) => {
    this.setState({ location, hasChanges: true });
  }

  handleGuestSearch = (query) => {
    this.setState({ guestQuery: query });
  }

  handleGuestSelect = (value, guest) => {
    const { guests } = this.state;
    guests.push(guest.value);
    this.setState({ guests, guestQuery: '', hasChanges: true });
  }

  handleGuestDelete = (index) => {
    const { guests } = this.state;
    guests.splice(index, 1);
    this.setState({ guests, hasChanges: true });    
  }

  handleCategorySelect = (categoryTitle, selectedCategory) => {
    if (!categoryTitle.trim()) return;
    if (selectedCategory.id == null) {
      const category = this.categories.find(c => c.title.toLowerCase() === categoryTitle.trim().toLowerCase());
      if (category) {
        this.setState({ category, hasChanges: true });
      } else {
        this.setState({ category: { "title": categoryTitle }, hasChanges: true });
      }
    } else {
      this.setState({ category: selectedCategory, hasChanges: true });
    }
  }

  handleDescriptionChange = (description) => {
    this.setState({ description, hasChanges: true });
  }

  handleGoBack = () => {
    this.goBack();
  }

  handleSubmit = () => {
    const { id, title, from, to, isAllDay, guests, category, location, description } = this.state;
    const { upsertEvent } = this.props;
    if (this.validate()) {
      const cleanedFrom = isAllDay ? startOfDay(from) : from;
      const cleanedTo = isAllDay ? startOfDay(to) : to;
      
      const event = { id, title, from: cleanedFrom, to: cleanedTo, isAllDay, guests, category, location, description };
      this.setState({ hasChanges: false });
      upsertEvent(event, { 
        success: () => {
          this.goBack(true);
        } 
      });
    }
  }

  filterPossibleGuests() {
    const { guests, guestQuery } = this.state;
    const filteredGuests = this.possibleGuests.filter(g => guests.indexOf(g.value) === -1);
    if (guestQuery.trim() && guests.indexOf(guestQuery) === -1) {
      filteredGuests.push({ value: guestQuery, label: guestQuery, new: true });
    }
    return filteredGuests;
  }

  validate() {
    const errors = {};
    const { title, from, to } = this.state;

    if (title == null || !title.trim()) {
      errors.titleRequired = true;
    }
    if (to < from) {
      errors.dateRangeInvalid = true;
    }

    this.setState({ errors });
    return Object.entries(errors).length === 0;
  }

  goBack = (skipPrompt = false) => {
    const { history } = this.props;
    history.push('/calendar', { skipPrompt });
  }

  handleHistoryChange = (location, action) => {
    if (action === 'POP') return;
    if (location.state.skipPrompt) return;
    const { nextLocation, hasChanges } = this.state;
    if (!hasChanges) return;
    // This will trigger only if we accept the discard prompt
    if (nextLocation != null) return;
    
    this.setState({ nextLocation: location, nextAction: action });
    return false;
  }

  closeDiscardPrompt = () => {
    this.setState({ nextLocation: null, nextAction: null });
  }

  acceptDiscardPrompt = () => {
    const { history } = this.props;
    const { nextLocation, nextAction } = this.state;
    if (nextAction === 'PUSH') {
      history.push(nextLocation);
    } else {
      history.replace(nextLocation);
    }
  }

  render() {
    const { categories } = this.props;
    const { title, from, to, isAllDay, guests, location, category, description, guestQuery, errors, nextLocation } = this.state;
    const disabledGuests = EmailValidator.validate(guestQuery) ? [] : [guestQuery];

    return (
      <MediaQuery maxWidth={991}>
        {condensed => (
          <div className="calendar-event-page">
            <IconButton 
              className="calendar-back-btn" 
              appearance="subtle" size="lg" 
              circle 
              icon={<Icon icon="chevron-left" width="20" height="20" />} 
              onClick={this.handleGoBack}
            />
            <Form className="calendar-event-form" onSubmit={this.handleSubmit}>
              <Grid fluid>
                <Row gutter={28}>
                  <Col md={14} sm={24}>
                    <div className="calendar-event-title-input-group input-group">
                      <div className="calendar-event-title-input-wrapper">
                        <Input 
                          className="calendar-event-title-input"
                          placeholder="Add title"
                          size="lg"
                          value={title}
                          onChange={this.handleTitleChange}
                        />
                        {condensed && <RVButton className="calendar-event-submit-btn" type="submit" palette="success" size="lg">Save</RVButton>}
                      </div>
                      {errors.titleRequired && <div className="error-chip">This field is required.</div>}
                    </div>

                    <div className="calendar-event-date-input-group input-group">
                      <div>
                        <RVDatePicker 
                          className="calendar-event-date-input" 
                          value={from} 
                          onChange={this.handleFromDateChange}
                          oneTap
                          preventOverflow
                        /> 
                        {!isAllDay && <RVDatePicker 
                          className="calendar-event-time-input" 
                          format="hh:mm a" 
                          hideMinutes={minutes => minutes % 15 !== 0} 
                          value={from} 
                          onChange={this.handleFromTimeChange}
                          preventOverflow
                        />}
                        <span className="calendar-event-date-separator">TO</span>
                        {!condensed && <React.Fragment>
                          <RVDatePicker 
                            className="calendar-event-date-input" 
                            disabledDate={date => differenceInCalendarDays(date, from) < 0}
                            value={to} 
                            onChange={this.handleToDateChange}
                            oneTap
                            preventOverflow
                          /> 
                          {!isAllDay && <RVDatePicker 
                            className="calendar-event-time-input" 
                            format="hh:mm a" 
                            hideMinutes={minutes => minutes % 15 !== 0} 
                            value={to} 
                            onChange={this.handleToTimeChange}
                            preventOverflow
                          />}
                        </React.Fragment>}
                      </div>
                      {!condensed && errors.dateRangeInvalid && <div className="error-chip">This date range is invalid.</div>}
                    </div>
                    {condensed && <div className="calendar-event-date-input-group input-group">
                      <div>
                        <span className="calendar-event-date-separator">TO</span>
                        <RVDatePicker 
                          className="calendar-event-date-input" 
                          disabledDate={date => differenceInCalendarDays(date, from) < 0}
                          value={to} 
                          onChange={this.handleToDateChange}
                          oneTap
                          preventOverflow
                        /> 
                        {!isAllDay && <RVDatePicker 
                          className="calendar-event-time-input" 
                          format="hh:mm a" 
                          hideMinutes={minutes => minutes % 15 !== 0} 
                          value={to} 
                          onChange={this.handleToTimeChange}
                          preventOverflow
                        />}
                      </div>
                      {errors.dateRangeInvalid && <div className="error-chip">This date range is invalid.</div>}
                    </div>}
                    <div className="calendar-event-options-input-group input-group">
                      <Checkbox 
                        className="calendar-event-allday-checkbox"
                        checked={isAllDay}
                        onChange={this.handleIsAllDayChecked}
                      >All day</Checkbox>
                    </div>
                  </Col>
                  {!condensed && <Col md={10} sm={24}>
                    <RVButton className="calendar-event-submit-btn" type="submit" palette="success" size="lg">Save</RVButton>
                  </Col>}
                </Row>

                <Row gutter={28}>
                  <Col className="calendar-event-details" md={14} sm={24}>
                    <h6 className="calendar-event-details-header">Event Details</h6>
                    <div className="calendar-event-details-input-group input-group calendar-event-details-location-input">
                      <LocationIcon className="calendar-icon" width="18" height="18" />
                      <RVLocationPicker
                        className="calendar-event-details-input"
                        placeholder="Add location"
                        value={location}
                        onSelect={this.handleLocationSelect}
                        onChange={this.handleLocationChange}
                      />
                    </div>
                    <div className="calendar-event-details-input-group input-group calendar-event-details-category-input">
                      <CircleIcon 
                        className={classNames(
                          'calendar-icon',
                          category && category.color ? `calendar-icon-${category.color}` : null,
                        )} 
                        width="18" 
                        height="18" 
                      />
                      <RVPicker
                        className="calendar-event-details-input"
                        block
                        cleanable={false}
                        placeholder="Add category"
                        data={categories}
                        labelKey="name"
                        valueKey="name"
                        value={category ? category.name : null}
                        renderMenuItem={(label, item) => (
                          <React.Fragment>
                            <div className={classNames('calendar-category-menu-item-marker', `calendar-category-menu-item-marker-${item.color}`)}></div>
                            <span>{item.name}</span>
                          </React.Fragment>
                        )}
                        onSelect={this.handleCategorySelect}
                      />
                    </div>
                    <div className="calendar-event-details-input-group input-group calendar-event-details-description-input">
                      <DescriptionIcon className="calendar-icon" width="18" height="18" />
                      {condensed ? (
                        <Input 
                          className="calendar-event-details-input"
                          componentClass="textarea"
                          placeholder="Add description"
                          value={description}
                          onChange={this.handleDescriptionChange}
                        />
                      ) : (
                        <RVRichTextEditor 
                          className="calendar-event-details-input"
                          placeholder="Add description"
                          value={description}
                          onChange={this.handleDescriptionChange}
                        />
                      )}
                    </div>
                  </Col>
                  <Col className="calendar-event-details" md={10} sm={24}>
                    <h6 className="calendar-event-details-header">Guests</h6>
                    <div className="calendar-event-details-input-group input-group calendar-event-details-guests-input">
                      <RVPicker
                        className="calendar-event-details-input"
                        block
                        cleanable={false}
                        placeholder="Add guests"
                        data={this.filterPossibleGuests()}
                        value={guestQuery}
                        renderMenuItem={(label, item) => (
                          item.new ?
                          <span>{`Invite guest (${item.label})`}</span> :
                          item.label === item.value ? 
                          <span>{item.label}</span> :
                          <span>{`${item.label} (${item.value})`}</span>
                        )}
                        searchBy={(keyword, label, item) => {
                          const k = keyword.toLowerCase().trim();
                          return item.value.toLowerCase().includes(k) || item.label.toLowerCase().includes(k)
                        }}
                        onSearch={this.handleGuestSearch}
                        onSelect={this.handleGuestSelect}
                        disabledItemValues={disabledGuests}
                        preventOverflow
                      />
                    </div>
                    <div className="calendar-event-guest-list">
                      {guests.map((email, i) => (
                        <div key={`calendar-event-guest-item-${i}`} className="calendar-event-guest-item">
                          <span>{(this.relationshipMap[email] && this.relationshipMap[email].name) || email}</span>
                          <IconButton 
                            className="calendar-event-guest-delete-btn" 
                            appearance="subtle" 
                            circle 
                            size="sm"
                            icon={<CloseIcon width="10" height="10" />} 
                            onClick={() => this.handleGuestDelete(i)}
                          />
                        </div>
                      ))}
                    </div>
                  </Col>
                </Row>
              </Grid>
            </Form>
            <RVPrompt
              show={nextLocation != null}
              onCancel={this.closeDiscardPrompt}
              cancelBtnTitle="Cancel"
              onAccept={this.acceptDiscardPrompt}
              acceptBtnTitle="Discard"
              acceptBtnPalette="primary"
            >
              Discard unsaved changes?
            </RVPrompt>
          </div>
        )}
      </MediaQuery>
    );
  }
}

const mapStateToProps = state => ({
  isLoading: state.calendar.isLoading,
  events: state.calendar.events,
  categories: state.calendar.categories, 
});

const mapDispatchToProps = dispatch => ({
  fetchData: (callbacks) => dispatch(fetchCalendarData(callbacks)),
  upsertEvent: (event, callbacks) => dispatch(upsertCalendarEvent(event, callbacks)),
});

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(CalendarEventPage));