/* Copyright (C) RealtyView, Inc. - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Terence Co <terence@realtyview.com>
 */
import * as uuid from 'uuid';
import { differenceInCalendarDays } from 'date-fns';

import { TOGGLE_CALENDAR_LOADING_STATE, SET_CALENDAR_DATA, SET_FILTERED_CALENDAR_DATA } from '../constants/calendar';
import CalendarEventCategories from '../data/calendar/categories.json';
import CalendarEventData from '../data/calendar/events.json';
import RelationshipsData from '../data/relationships.json';
import UserData from '../data/user.json';
import { getCalendarEventsFromData, sortCalendarEventsForStacking, getGuests } from '../services/calendar';

const CATEGORY_COLORS = [
  'red-1', 'red-2', 'red-3', 'orange-1', 'orange-2', 'yellow-1', 'green-1', 'green-2',
  'green-3', 'blue-1', 'blue-2', 'blue-3', 'purple-1', 'purple-2', 'brown-1', 'gray-1',
];

export const toggleCalendarLoadingState = (isLoading) => {
  return { type: TOGGLE_CALENDAR_LOADING_STATE, isLoading };
}

export const setCalendarData = (events, categories) => {
  return { type: SET_CALENDAR_DATA, events, categories };
}

export const setFilteredCalendarData = (filteredEvents, filteredCategories) => {
  return { type: SET_FILTERED_CALENDAR_DATA, filteredEvents, filteredCategories };
}

export const fetchCalendarData = (callbacks = {}) => (dispatch, getState) => {
  const { success } = callbacks;
  const { categories, events, filteredCategories } = getState().calendar;

  dispatch(toggleCalendarLoadingState(true));

  // Fetch calendar events and categories from network. For now this is persisted.
  const fetchedCategories = (categories || categories.length === 0) ? CalendarEventCategories.categories : categories;
  // Persisted state converts dates to str.
  const fetchedEvents = (
    (events || events.length === 0) 
    ? getCalendarEventsFromData(CalendarEventData.events, UserData.user, RelationshipsData.relationships, fetchedCategories)
    : events
  );
  const sortedEvents = sortCalendarEventsForStacking(fetchedEvents);

  dispatch(setCalendarData(sortedEvents, fetchedCategories));

  const filteredEvents = filteredCategories.length ? sortedEvents.filter(e => filteredCategories.indexOf(e.categoryId) !== -1) : sortedEvents;
  dispatch(setFilteredCalendarData(filteredEvents, filteredCategories));
  
  if (success) success();

  dispatch(toggleCalendarLoadingState(false));
}

export const filterCalendarData = (filteredCategories) => (dispatch, getState) => {
  dispatch(toggleCalendarLoadingState(true));

  const { events } = getState().calendar;
  const filteredEvents = filteredCategories.length ? events.filter(e => filteredCategories.indexOf(e.categoryId) !== -1) : events;
  dispatch(setFilteredCalendarData(filteredEvents, filteredCategories));

  dispatch(toggleCalendarLoadingState(false));
}

export const upsertCalendarEvent = (event, callbacks = {}) => (dispatch, getState) => {
  const { success } = callbacks;
  dispatch(toggleCalendarLoadingState(true));

  const { events, categories, filteredCategories } = getState().calendar;

  // Temporary Event + Category creation.
  // Create new category if it doesn't exist
  if (event.category == null) {
    if (categories.length > 0) {
      event.categoryId = categories[0].id;
    }
  } else if (event.category.id == null) {
    const newCategory = event.category;
    newCategory.id = uuid.v4();
    newCategory.color = getRandomEventCategoryColor();
    categories.push(newCategory);
    event.categoryId = newCategory.id;
  } else {
    event.categoryId = event.category.id;
  }

  event.organizer = UserData.user;
  event.guests = getGuests(event.guests, UserData.user, RelationshipsData.relationships);
  event.dateCoverage = differenceInCalendarDays(event.to, event.from) + 1;

  if (event.id != null) {
    // Patch event
    const eventIndex = events.findIndex(e => (e.id === event.id));
    events[eventIndex] = event;
  } else {
    // Post event
    event.id = uuid.v4();
    events.push(event);
  }

  const sortedEvents = sortCalendarEventsForStacking(events);
  dispatch(setCalendarData(sortedEvents, categories));

  const filteredEvents = filteredCategories.length ? sortedEvents.filter(e => filteredCategories.indexOf(e.categoryId) !== -1) : sortedEvents;
  dispatch(setFilteredCalendarData(filteredEvents, filteredCategories));

  if (success) success();

  dispatch(toggleCalendarLoadingState(false));
}

export const deleteCalendarEvent = (eventId, callbacks = {}) => (dispatch, getState) => {
  const { success } = callbacks;
  dispatch(toggleCalendarLoadingState(true));

  const { events, categories, filteredCategories } = getState().calendar;

  const eventIndex = events.findIndex(e => e.id === eventId);
  if (eventIndex === -1 || events[eventIndex].organizer.id !== UserData.user.id) {
    dispatch(toggleCalendarLoadingState(false));
    return;
  }

  // Temporary Event deletion.
  events.splice(eventIndex, 1);
  const sortedEvents = sortCalendarEventsForStacking(events);

  dispatch(setCalendarData(sortedEvents, categories));

  const filteredEvents = filteredCategories.length ? sortedEvents.filter(e => filteredCategories.indexOf(e.categoryId) !== -1) : sortedEvents;
  dispatch(setFilteredCalendarData(filteredEvents, filteredCategories));

  if (success) success();

  dispatch(toggleCalendarLoadingState(false));
}

export const upsertCalendarCategory = (category, callbacks = {}) => (dispatch, getState) => {
  const { success } = callbacks;
  dispatch(toggleCalendarLoadingState(true));

  const { events, categories, filteredCategories } = getState().calendar;

  // Temporary Category creation.
  // Create new category if it doesn't exist
  const catIndex = category.id == null ? -1 : categories.findIndex(c => c.id === category.id);
  if (catIndex === -1) {
    category.id = uuid.v4();
    categories.push(category);
  } else {
    categories[catIndex] = category;
    for (const event of events) {
      if (event.categoryId === category.id) {
        events.category = category;
      }
    }
  }

  dispatch(setCalendarData(events, categories));

  const filteredEvents = filteredCategories.length ? events.filter(e => filteredCategories.indexOf(e.categoryId) !== -1) : events;
  dispatch(setFilteredCalendarData(filteredEvents, filteredCategories));

  if (success) success();

  dispatch(toggleCalendarLoadingState(false));
}

function getRandomEventCategoryColor() {
  const i = Math.floor(Math.random() * CATEGORY_COLORS.length);
  return CATEGORY_COLORS[i];
}
