import React from 'react';
import classNames from 'classnames'
import { 
  addMinutes, 
  differenceInCalendarDays, 
  differenceInMinutes,
  format as dateFormat,
  startOfDay,
} from 'date-fns';
import * as EmailValidator from 'email-validator';
import { Link } from 'react-router-dom';
import { 
  Checkbox,
  Input, 
  Popover, 
  ButtonToolbar,
  Form,
  Whisper,
} from 'rsuite';

import CalendarSchedulerContext from './CalendarSchedulerContext';
import { ReactComponent as CircleIcon } from '../../images/icons/circle.svg';
import { ReactComponent as DescriptionIcon } from '../../images/icons/description-icon.svg';
import { ReactComponent as GuestsIcon } from '../../images/icons/guests-icon.svg';
import { ReactComponent as LocationIcon } from '../../images/icons/location-icon.svg';
import { ReactComponent as TimeIcon } from '../../images/icons/time-icon.svg';
import RVButton from '../shared/RVButton';
import RVDatePicker from '../shared/RVDatePicker';
import RVLocationPicker from '../shared/RVLocationPicker';
import RVPicker from '../shared/RVPicker';
import RVRichTextEditor from '../shared/RVRichTextEditor';
import '../../styles/Calendar/CalendarQuickAdd.scss';

class CalendarQuickAddPopover extends React.Component {
  static contextType = CalendarSchedulerContext;
  constructor(props) {
    super(props);
    const from = startOfDay(new Date());
    const to = addMinutes(from, 15);
    this.state = {
      title: '',
      from,
      to,
      isAllDay: true,
      location: null,
      guests: [],
      category: null,
      description: '',
      createdGuests: [],
      disabledGuests: [],
      dateFocused: false,
      descriptionFocused: false,
      errors: {},
    };
    this.descriptionEditorRef = React.createRef();
  }

  componentDidMount() {
    const { categories } = this.context;
    if (categories != null && categories.length) {
      this.setState({ category: categories[0] });
    }
  }

  handleTitleChange = (title) => {
    this.setState({ title });
  }

  handleFromDateChange = (fromDate) => {
    const eventDuration = differenceInMinutes(this.state.to, this.state.from);
    const newToDate = addMinutes(fromDate, eventDuration);
    this.setState({ from: fromDate, to: newToDate });
  }

  handleToDateChange = (toDate) => {
    if (differenceInMinutes(toDate, this.state.from) <= 0) {
      this.setState({ to: addMinutes(this.state.from, 15) });
    } else {
      this.setState({ to: toDate });
    }
  }

  handleIsAllDayChecked = (v, checked) => {
    if (!checked && differenceInMinutes(this.state.to, this.state.from) <= 0) {
      const newToDate = addMinutes(this.state.from, 15);
      this.setState({ isAllDay: checked, to: newToDate });
    } else {
      this.setState({ isAllDay: checked });
    }
  }

  handleDateFocus = () => {
    this.setState({ dateFocused: true });
  }

  handleAddTime = () => {
    this.setState({ dateFocused: true, isAllDay: false });
  }

  handleGuestSearch = (query) => {
    const disabledGuests = EmailValidator.validate(query) ? [] : [query];
    this.setState({ disabledGuests });
  }

  handleGuestSelect = (value, guest) => {
    if (!guest.create) return;
    const { createdGuests } = this.state;
    if (createdGuests.findIndex(g => g.value === guest.value) === -1) {
      createdGuests.push(guest);
      this.setState({ createdGuests });
    }
  }

  handleGuestChange = (guests) => {
    this.setState({ guests });
  }

  handleLocationSelect = (location) => {
    this.setState({ location });
  }

  handleLocationChange = (location) => {
    this.setState({ location });
  }

  handleDescriptionChange = (description) => {
    this.setState({ description });
  }

  handleDescriptionFocus = () => {
    this.setState({ descriptionFocused: true });
    this.descriptionEditorRef.focus();
  }

  handleCategorySelect = (categoryTitle, selectedCategory) => {
    if (!categoryTitle.trim()) return;
    if (selectedCategory.id == null) {
      const category = this.context.categories.find(c => c.title.toLowerCase() === categoryTitle.trim().toLowerCase());
      if (category) {
        this.setState({ category });
      } else {
        this.setState({ category: { "title": categoryTitle } });
      }
    } else {
      this.setState({ category: selectedCategory });
    }
  }

  handleSubmit = () => {
    /*
    NOTE: For some reason, sate is not persisted when submitting through Quick Add
    CalendarEventPage calls the same thunk action and is able to persist it's changes.
    I am unable to find the root cause of this so I will ignore it for now since we'll
    be using persistence only while API is unavailable.
    */
    const { title, from, to, isAllDay, guests, category, location, description } = this.state;
    const { upsertEvent } = this.context;
    if (this.validate()) {
      const cleanedFrom = isAllDay ? startOfDay(from) : from;
      const cleanedTo = isAllDay ? startOfDay(to) : to;
      
      const event = { title, from: cleanedFrom, to: cleanedTo, isAllDay, guests, category, location, description };

      // Note .close() is only available for rsuite@^4.8.0
      upsertEvent(event, { success: () => this.getTriggerRef().close() });
    }
  }

  fetchPossibleGuests = () => {
    const { fetchRelationships } = this.context;
    const relationships = fetchRelationships ? fetchRelationships() : [];
    return (
      relationships
      .map(r => ({ value: r.email, label: (r.name ? r.name : r.email) }))
      .concat(this.state.createdGuests)
    );
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

  getTriggerRef() {
    const { triggerRef } = this.props;
    if (typeof triggerRef === 'function') {
      return triggerRef();
    } else {
      return triggerRef;
    }
  }

  render() {
    const { staticContext, triggerRef, ...props } = this.props;
    const { categories } = this.context;
    const { title, from, to, isAllDay, guests, location, category, description, disabledGuests, dateFocused, descriptionFocused, errors } = this.state;
    return (      
      <Popover 
        {...props} 
        className={classNames(this.props.className, 'calendar-quick-add-popover')} 
      >
        <Form onSubmit={this.handleSubmit}>
          <div className="input-group">
            <Input 
              className="calendar-quick-add-title-input"
              placeholder="Add title"
              size="lg"
              value={title}
              onChange={this.handleTitleChange}
            />
            {errors.titleRequired && <div className="error-chip">This field is required.</div>}
          </div>
          <div className="calendar-quick-add-details-input-group input-group calendar-quick-add-date-input">
            <TimeIcon className="calendar-icon" width="16" height="16" />
            {!dateFocused && <React.Fragment>
              <Input 
                className="calendar-quick-add-details-input-untouched"
                value={dateFormat(from, 'EEEE, MMMM d')}
                onFocus={this.handleDateFocus}
              />
              <RVButton 
                className="calendar-quick-add-add-time-btn" 
                palette="secondary" 
                size="xs" 
                onClick={this.handleAddTime}
              >Add time</RVButton>
            </React.Fragment>}
            {dateFocused && <div className="calendar-quick-add-date-input-group">
              <div className="calendar-quick-add-date-input-row">
                <RVDatePicker 
                  className="calendar-quick-add-date-input-field" 
                  subtle
                  inPopover
                  format={isAllDay ? "MMM D, YYYY" : "MMM D, YYYY hh:mm a"}
                  hideMinutes={minutes => minutes % 15 !== 0} 
                  value={from} 
                  onChange={this.handleFromDateChange}
                  oneTap={isAllDay}
                /> 
                <span className="calendar-quick-add-date-separator">&mdash;</span>
                <RVDatePicker 
                  className="calendar-quick-add-date-input-field" 
                  subtle
                  inPopover
                  format={isAllDay ? "MMM D, YYYY" : "MMM D, YYYY hh:mm a"}
                  disabledDate={date => differenceInCalendarDays(date, from) < 0}
                  hideMinutes={minutes => minutes % 15 !== 0} 
                  value={to} 
                  onChange={this.handleToDateChange}
                  oneTap={isAllDay}
                /> 
              </div>
              <div className="calendar-quick-add-date-input-row">
                <Checkbox 
                  className="calendar-quick-add-allday-checkbox"
                  checked={isAllDay}
                  onChange={this.handleIsAllDayChecked}
                >All day</Checkbox>
              </div>
            </div>}
          </div>
          <div className="calendar-quick-add-details-input-group input-group calendar-quick-add-guests-input">
            <GuestsIcon className="calendar-icon" width="16" height="16" />
            <RVPicker
              className="calendar-quick-add-details-input"
              block
              creatable
              cleanable={false}
              multi
              subtle
              inPopover
              size="sm"
              placeholder="Add guests"
              data={this.fetchPossibleGuests()}
              value={guests}
              renderMenuItem={(label, item) => (
                item.create ?
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
              onChange={this.handleGuestChange}
              disabledItemValues={disabledGuests}
            />
          </div>
          <div className="calendar-quick-add-details-input-group input-group calendar-quick-add-location-input">
            <LocationIcon className="calendar-icon" width="16" height="16" />
            <RVLocationPicker
              className="calendar-quick-add-details-input"
              block
              subtle
              inPopover
              size="sm"
              placeholder="Add location"
              value={location}
              onSelect={this.handleLocationSelect}
              onChange={this.handleLocationChange}
            />
          </div>
          <div className="calendar-quick-add-details-input-group input-group calendar-quick-add-description-input">
            <DescriptionIcon className="calendar-icon" width="16" height="16" />
            {!descriptionFocused && <Input 
              className="calendar-quick-add-details-input-untouched"
              placeholder="Add description"
              onFocus={this.handleDescriptionFocus}
            />}
            <RVRichTextEditor 
              className="calendar-quick-add-details-input calendar-quick-add-description-input-touched"
              editorClassName="calendar-quick-add-description-editor"
              placeholder="Add description"
              value={description}
              onChange={this.handleDescriptionChange}
              wrapperStyle={descriptionFocused ? null : {display: 'none'}}
              editorRef={(ref) => { this.descriptionEditorRef = ref }}
            />
          </div>
          <div className="calendar-quick-add-details-input-group input-group calendar-quick-add-details-category-input">
            <CircleIcon 
              className={classNames(
                'calendar-icon',
                category && category.color ? `calendar-icon-${category.color}` : null,
              )} 
              width="16" 
              height="16" 
            />
            <RVPicker
              className="calendar-quick-add-details-input"
              block
              cleanable={false}
              subtle
              inPopover
              size="sm"
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
          <ButtonToolbar style={{ float: 'right' }}>
            <Link to="/calendar/event" component={RVButton} palette="link-primary" size="lg">More Options</Link>
            <RVButton type="submit" palette="success" size="lg">Save</RVButton>
          </ButtonToolbar>
        </Form>
      </Popover>
    );
  }
}

class CalendarQuickAddTrigger extends React.Component {
  constructor(props) {
    super(props);
    this.triggerRef = React.createRef();
  }
  
  render() {
    const { children, speaker, ...props } = this.props;
    return (
      <Whisper 
        {...props}
        speaker={<CalendarQuickAddPopover triggerRef={() => this.triggerRef} />} 
        ref={(ref) => { this.triggerRef = ref }}
      >{children}</Whisper>
    );
  }
}

export default {
  Popover: CalendarQuickAddPopover,
  Trigger: CalendarQuickAddTrigger,
};
