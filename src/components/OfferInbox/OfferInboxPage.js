import React from 'react';
import classNames from 'classnames';
import { connect } from 'react-redux';
import { matchPath } from 'react-router';
import { Redirect, withRouter } from 'react-router-dom';
import { Panel } from 'rsuite';

import { ReactComponent as CloseIcon } from '../../images/icons/close-icon.svg';
import OfferData from '../../data/offers_v2.json';
import RelationshipData from '../../data/relationships.json';
import UserData from '../../data/user.json';
import MainLayout from '../layouts/main';
import { getOffersFromData, filterOffers, sortOffers, getBucketFromOffer } from '../../services/offers';

import OfferInboxContext from './OfferInboxContext';
import OfferInboxList from './OfferInboxList';
import OfferInboxMobileList from './OfferInboxMobileList';
import OfferInboxSidebar from './OfferInboxSidebar';
import OfferInboxDisplay from './OfferInboxDisplay';
import OfferInboxDisplayModal from './OfferInboxDisplayModal';

import '../../styles/OfferInbox/OfferInboxPage.scss';

class OfferInboxPage extends React.Component {
  constructor(props) {
    super(props);
    this.allOffers = getOffersFromData(OfferData.offers);
    this.addressFilters = this.getAddressFiltersFromOffers(this.allOffers);
    this.state = {
      user: UserData.users,
      relationshipFilter: null,
      addressFilter: null,
      sortColumn: 'created',
      sortType: 'desc',
      isSidebarShown: false,
      isFetching: true,
    }
  }

  componentDidMount() {
    this.setState({ isFetching: false });
  }

  getBucket() {
    const { match, location } = this.props;
    const bucketMatch = matchPath(location.pathname, { path: `${match.path}/:bucket` });
    if (bucketMatch == null) return 'inbox';
    if (['sent', 'drafts', 'archives'].indexOf(bucketMatch.params.bucket) !== -1) {
      return bucketMatch.params.bucket;
    }
    return null;
  }

  getDisplayedOffer() {
    const { match, location } = this.props;
    const offerMatch = matchPath(location.pathname, { path: `${match.path}/o/:id`, exact: true });
    if (offerMatch == null) return null;
    const displayedOffer = this.allOffers.find(o => o.id === offerMatch.params.id);
    return displayedOffer;
  }

  getSortedAndFilteredOffers(bucket, options = {}) {
    const newState = { ...this.state, ...options };
    console.log(newState);
    const { user, relationshipFilter, addressFilter, sortColumn, sortType } = newState;
    const filteredOffers = filterOffers(this.allOffers, user.id, { bucket, relationshipFilter, addressFilter });
    return sortOffers(filteredOffers, sortColumn, sortType);
  }

  handleRelationshipFilterSelect = (relationshipFilter) => {
    this.setState({ relationshipFilter, isSidebarShown: false });
  }

  handleAddressFilterSelect = (addressFilter) => {
    this.setState({ addressFilter, isSidebarShown: false });
  }

  handleSortColumn = (sortColumn, sortType) => {
    if (sortColumn == null) {
      this.setState({ sortColumn: "created", sortType: "desc" });
    } else {
      this.setState({ sortColumn, sortType });
    }
  }

  goToBucket = (bucket) => {
    const { match, history } = this.props;
    if (bucket === 'inbox') {
      history.push(match.url);
    } else {
      history.push(`${match.url}/${bucket}`);
    }
    this.setState({ isSidebarShown: false });
  }

  resetFilters = () => {
    this.setState({
      relationshipFilter: null,
      addressFilter: null,
      sortColumn: 'created',
      sortType: 'desc',
    });
  }

  showOfferDisplay = (offerId) => {
    const { match, history } = this.props;
    history.push(`${match.url}/o/${offerId}`);
    this.setState({ isSidebarShown: false });
  }

  setSidebarDisplay = (isSidebarShown) => {
    this.setState({ isSidebarShown });
  }

  getDraftCount() {
    const { user } = this.state;
    return this.allOffers.filter(o => o.sender_id === user.id && o.status === 'draft').length;
  }

  getUnreadCount() {
    const { user } = this.state;
    return this.allOffers.filter(o => o.receiver_id === user.id && !o.is_read).length;
  }

  getAddressFiltersFromOffers(offers) {
    const addressFilterMap = offers.reduce((m, offer) => ({ ...m, [offer.address]: offer.address_short }), {});
    return Array.from(Object.entries(addressFilterMap), ([k, v]) => ({label: v, value: k}));
  }

  render() {
    if (this.state.isFetching) return null;

    const { match, isDesktop } = this.props;
    const { user, relationshipFilter, addressFilter, sortColumn, sortType, isSidebarShown } = this.state;
    const isMobile = !isDesktop;

    const displayedOffer = this.getDisplayedOffer();
    const bucket = displayedOffer != null ? getBucketFromOffer(displayedOffer, user.id) : this.getBucket();
    if (bucket == null) {
      return <Redirect to={match.path} />
    }

    const offers = this.getSortedAndFilteredOffers(bucket);

    return (
      <OfferInboxContext.Provider value={{
        user,
        bucket,
        offers,
        displayedOffer,
        relationshipFilter,
        addressFilter,
        sortColumn,
        sortType,
        draftCount: this.getDraftCount(),
        unreadCount: this.getUnreadCount(),
        onRelationshipFilterSelect: this.handleRelationshipFilterSelect,
        onAddressFilterSelect: this.handleAddressFilterSelect,
        onSortColumn: this.handleSortColumn,
        resetFilters: this.resetFilters,
        goToBucket: this.goToBucket,
        showOfferDisplay: this.showOfferDisplay,
        setSidebarDisplay: this.setSidebarDisplay,
        relationships: RelationshipData.relationships,
        addressFilters: this.addressFilters,
        isMobile,
      }}>
        <MainLayout layoutClassName={classNames(
          'offer-inbox-page',
          displayedOffer == null && isMobile && 'offer-inbox-page-fixed-height',
        )}>
          {isMobile && (
            <div className={classNames(
              'offer-inbox-sidebar-drawer',
              isSidebarShown && 'offer-inbox-sidebar-drawer-open',
            )}>
              <OfferInboxSidebar hideNewOfferButton/>
              <div className="offer-inbox-sidebar-drawer-close-btn" onClick={() => { this.setSidebarDisplay(false) }}>
                <CloseIcon width="15" height="15"/>
              </div>
            </div>
          )}
          <h2 className="page-context-title">Offer Inbox</h2>
          {isMobile ? (
            <div className="offer-inbox-wrapper offer-inbox-wrapper-mobile">
              <Panel className="offer-inbox-mobile-panel" shaded>
                {displayedOffer != null ? (
                  <OfferInboxDisplay />
                ) : (
                  <OfferInboxMobileList />
                )}
              </Panel>
            </div>
          ) : (
            <div className="offer-inbox-wrapper offer-inbox-wrapper-desktop">
              <Panel className="offer-inbox-sidebar-panel" shaded>
                <OfferInboxSidebar />
              </Panel>
              <Panel className="offer-inbox-list-panel" shaded>
                <OfferInboxList />
              </Panel>
              {displayedOffer != null && <OfferInboxDisplayModal />}
            </div>
          )}
        </MainLayout>
      </OfferInboxContext.Provider>
    );
  }
}

const mapStateToProps = state => ({
  isDesktop: state.common.isDesktop
});

export default connect(mapStateToProps, null)(withRouter(OfferInboxPage));
