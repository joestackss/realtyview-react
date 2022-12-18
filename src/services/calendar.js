import { 
  differenceInCalendarDays,
  isSameDay,
} from 'date-fns';

// // Event Category Schema
// interface CalendarEventCategory {
//   id: string;
//   name: string;
//   color: string;
// }

// // Event Guest Schema
// interface CalendarEventGuest {
//   id: string;
//   avatar: string;
//   name: string;
//   phone: string;
//   email: string;
//   relationship?: string
// }

// // Event JSON Schema
// interface CalendarEventData {
//   id: string;
//   title: string;
//   from: string; // ISOString
//   to: string; // ISOString
//   isAllDay: boolean;
//   frequency: string;
//   location: string;
//   organizer: string;
//   guests: string[];
//   categoryId: number;
//   description: String;
// }

// // Event Object Schema
// interface CalendarEvent {
//   id: string;
//   title: string;
//   from: Date
//   to: Date
//   dateCoverage: number; // Number of dates spanned
//   isAllDay: boolean;
//   frequency: string;
//   location: string;
//   organizer: CalendarEventGuest;
//   guests: CalendarEventGuest[];
//   categoryId: number;
//   category: CalendarEventCategory;
//   description: String;
// }

function getDateObj(isoString, isAllDay = false) {
  /*  
  Retrieve a Date object that will be used for calendar events

  Args:
    isoString: string 
    isAllDay?: boolean
  Returns: Date

  If isAllDay is `false`, the date is treated as locale sensitive, 
  so the Date object created will respect the user's locale (which
  is default behavior).

  If isAllDay is `true`, the date is treated as locale insensitive. 
  This will create a Date object that will be the start of day in 
  the current locale. The date is assumed to be stored in UTC so this 
  function will parse "2020-08-05T05:00:00Z" to "2020-08-05T00:00:00-4:00"
  in UTC offset -4 and to "2020-08-05T00:00:00+8:00" in UTC offset +8.
  Note that the hours, minutes and seconds are ignored.
  */
  const date = new Date(isoString)
  if (!isAllDay) {
    return date;
  } else {
    // Assume that all day event start dates are stored in UTC time
    // Convert this to start of day in current timezone 
    return new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
  }
}

export function getCalendarEventsFromData(events, user, relationships, categories) {
  /*
  Converts calendar events received from backend to a more
  usable format. Timestamps are replaced with dates and 
  dateCoverage field is included.

  Args: 
    events: CalendarEventData[]
    categories: CalendarEventCategory[]
  Returns: CalendarEvent[]
  */
  
  const categoryMap = {}
  categories.forEach(category => {
    categoryMap[category.id] = category;
  });

  const userMap = getUserMap(user, relationships);

  return events
    .map(v => {
      const from = getDateObj(v.from, v.isAllDay);
      const to = getDateObj(v.to, v.isAllDay);
      const dateCoverage = differenceInCalendarDays(to, from) + 1;
      const category = categoryMap[v.categoryId];
      const organizer = getUserData(v.organizer, userMap);
      const guests = v.guests.map(email => getUserData(email, userMap));
      return { ...v, from, to, dateCoverage, category, guests, organizer }
    });  
}

export function sortCalendarEventsForStacking(events) {
  /*
  Sorts calendar events based on the following sort priority:
  1. Start Date
  2. is All Day
  3. is Multiple Days
  4. Start Time
  5. Duration in Days
  6. End Time
  7. Title

  The returned arrangement should be used to decide which events 
  to stack first.

  Args: CalendarEvent[]
  Returns: CalendarEvent[]

  This is based on experimentation with Google's Calendar stacking.
  */
  return events.sort((a, b) => {
    // Sort by earlier start date (without time)
    if (!isSameDay(a.from, b.from)) return a.from - b.from;

    // Prioritize is All Day events
    if (a.isAllDay !== b.isAllDay) return a.isAllDay ? -1 : 1;

    // Prioritize events that span more than one date.
    if (a.dateCoverage > 1 && b.dateCoverage === 1) return -1;
    if (b.dateCoverage > 1 && a.dateCoverage === 1) return 1;

    // Sort by earlier start time
    if (a.from !== b.from) return a.from - b.from;

    // Sort by larger coverage of dates
    if (a.dateCoverage !== b.dateCoverage) return b.dateCoverage - a.dateCoverage;

    // Sort by later end date
    if (a.to !== b.to) return b.to - a.to;

    // Sort title alphabetically
    return a.title.localeCompare(b.title);
  });
}

export function getUserMap(user, relationships) {
  const userMap = {}
  if (user != null) userMap[user.email] = user;
  relationships.forEach(relationship => {
    userMap[relationship.email] = relationship;
  });
  return userMap;
}

function getUserData(email, userMap) {
  const user = userMap.hasOwnProperty(email) ? userMap[email] : { email };
  return user;
}

export function getGuests(guestEmails, user, relationships) {
  const userMap = getUserMap(user, relationships);
  const guests = guestEmails.map(email => getUserData(email, userMap));
  return guests;
}
