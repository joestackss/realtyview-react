import { compareAsc as compareDate } from "date-fns";

import { compareString } from "../utils/common";

export function getOffersFromData(offers) {
  return offers
    .map(v => {
      const created = new Date(v.created);
      const expiration = new Date(v.expiration);
      const proposed_closing_date = new Date(v.proposed_closing_date);
      return { ...v, created, expiration, proposed_closing_date };
    });
}

export function sortOffers(offers, sortColumn, sortType) {
  const modifier = sortType === 'desc' ? -1 : 1;
  let compareFn = compareString;
  if (["created", "expiration", "proposed_closing_date"].indexOf(sortColumn) !== -1) {
    compareFn = compareDate;
  }
  return offers.sort((a, b) => {
    const compareVal = modifier * compareFn(a[sortColumn], b[sortColumn]);
    if (compareVal !== 0 || sortColumn === 'created') return compareVal;
    return compareDate(a['created'], b['created']);
  })
}

export function filterOffers(offers, userId, query) {
  const { bucket, relationshipFilter, addressFilter, searchFilter } = query;
  return offers
    .filter(offer => {
      if (getBucketFromOffer(offer, userId) !== (bucket != null ? bucket : 'inbox')) {
        return false;
      }
      return (
        (relationshipFilter == null || relationshipFilter === offer.client_relationship_type) &&
        (addressFilter == null || addressFilter === offer.address)
        // logic for searchFilter
      )
    })
}

// There are a lot of flaws with this logic
// Better to have a separate model for drafts and actual offers
// Better to also have an archived relationship between user and offer.
export function getBucketFromOffer(offer, userId) {
  if (offer.sender_id === userId) {
    if (offer.status === 'draft') return 'drafts';
    return 'sent';
  } else if (offer.receiver_id === userId) {
    if (offer.status === 'archived') return 'archives';
    return 'inbox';  
  }
  return null;
}