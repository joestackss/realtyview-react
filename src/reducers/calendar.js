/* Copyright (C) RealtyView, Inc. - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Terence Co <terence@realtyview.com>
 */
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import { 
  TOGGLE_CALENDAR_LOADING_STATE, 
  SET_CALENDAR_DATA, 
  SET_FILTERED_CALENDAR_DATA,
} from '../constants/calendar';

const persistConfig = {
  key: 'calendar',
  storage,
  whitelist: ['events', 'categories'],
};

const defaultState = {
  isLoading: false,
  events: [],
  categories: [],
  filteredEvents: [],
  filteredCategories: [],
};

const reducer = (state = defaultState, action) => {
  switch (action.type) {
    case TOGGLE_CALENDAR_LOADING_STATE:
      return {
        ...state,
        isLoading: action.isLoading,
      };
    case SET_CALENDAR_DATA:
      return {
        ...state,
        events: action.events,
        categories: action.categories,
      };
    case SET_FILTERED_CALENDAR_DATA:
      return {
        ...state,
        filteredEvents: action.filteredEvents,
        filteredCategories: action.filteredCategories,
      };
    default:
      return state;
  }
}

export default persistReducer(persistConfig, reducer);