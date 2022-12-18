/* Copyright (C) RealtyView, Inc. - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Joshua Santiago <jsantiago@realtyview.com>
 */

import React from 'react';
import { connect } from 'react-redux';
import {
  Container,
  Panel,
  Placeholder,
  Input,
  IconButton,
  Button,
  SelectPicker,
  DatePicker,
  Timeline,
  Table,
  Tag,
  Icon,
  Whisper,
  Popover,
  Dropdown,
  Avatar,
  Modal,
  List } from 'rsuite';
  import { store as notificationStore } from 'react-notifications-component';
import axios from 'axios';
import _ from 'lodash';
import empty from 'is-empty';
import classNames from 'classnames';
import moment from 'moment';
import numeral from 'numeral';
import MaskedInput from 'react-text-mask';
import createNumberMask from 'text-mask-addons/dist/createNumberMask';

import TopNav from './TopNav';
import RV_Sidebar from './RV_Sidebar';
import RVButton from './shared/RVButton';
import SampleProfileImg from '../images/sample-profile-picture.png';
import { ReactComponent as PhoneIcon } from '../images/icons/phone-icon.svg';
import { ReactComponent as MailIcon } from '../images/icons/mail-icon.svg';
import { ReactComponent as HomeIcon } from '../images/icons/home-icon.svg';
import { ReactComponent as LocationIcon } from '../images/icons/location-icon.svg';
import { ReactComponent as LocationIcon2 } from '../images/icons/location-icon-2.svg';
import { ReactComponent as UserIcon } from '../images/icons/user-icon.svg';
import { ReactComponent as SmartOfferIcon } from '../images/icons/smart-offer-icon.svg';
import { ReactComponent as AttachmentsIcon } from '../images/icons/attachments-icon.svg';
import { ReactComponent as CommentsIcon } from '../images/icons/comments-icon.svg';
import '../styles/OfferViewPage.scss';



class OfferViewPage extends React.Component {
  constructor(props) {
    super(props);
    this.webSocketClient = null;
    this.getOfferDetails = this.getOfferDetails.bind(this);
    this.clearOfferDetails = this.clearOfferDetails.bind(this);
    this.submitOffer = this.submitOffer.bind(this);
    this.handleSubmitValidation = this.handleSubmitValidation.bind(this);
    this.getRelationships = this.getRelationships.bind(this);
    this.attachRelationshipToOffer = this.attachRelationshipToOffer.bind(this);
    this.showRelationshipLinkModal = this.showRelationshipLinkModal.bind(this);
    this.hideRelationshipLinkModal = this.hideRelationshipLinkModal.bind(this);
    this.sendComment = this.sendComment.bind(this);
    this.state = {
      offer: {},
      comments: [],
      comment: "",
      commentsLastSync: "",
      displayRelationshipsLinkModal: false,
      relationships: [],
      isProcessingRelationshipAttachment: false
    };
  }

  componentDidMount() {
    const { id } = this.props.match.params;

    // Get offer details
    this.getOfferDetails(id);

    // Get relationships
    this.getRelationships();

    // Subscribe to offer comment event source
    const eventSource = new EventSource(
      `${process.env.REACT_APP_REALTYVIEW_API_ENDPOINT}/offer/${id}/comments`,
      {
        withCredentials: true
      }
    );

    // Initial connected message
    eventSource.addEventListener('connected', (event) => {
      console.log("Connected to event source");
    });

    eventSource.addEventListener('offerComment', (event) => {
      try {
        const data = JSON.parse(event.data);
        const comments = _.get(data, "comments");

        this.setState(prevState => {
          return {
            comments: _.uniqBy( _.concat(prevState.comments, comments), 'id' )
          }
        });

      } catch (e) {}
    });
  }

  /**
   * Gets the offer details
   * @param {string - UUID} offerId
   */
  getOfferDetails(offerId) {
    axios
      .get(`${process.env.REACT_APP_REALTYVIEW_API_ENDPOINT}/offer/${offerId}`, {
        withCredentials: true
      })
      .then((response) => {
        if (response.status === 200) {
          this.setState({
            offer: response.data
          });
        }
      })
      .catch((err) => console.log(err));
  }

  /**
   * Clears the offer round details from the form, not
   * from the database
   */
  clearOfferDetails() {
    let offer = this.state.offer;
    let offerRounds = _.get(offer, "offer_rounds");

    // Clear the last offer round object
    offerRounds[offerRounds.length - 1] = {
      ...offerRounds[offerRounds.length - 1],
      offer_amount: "",
      down_payment_amount: "",
      pre_approval_amount: "",
      seller_concession: "",
      loan_type: "",
      proposed_closing_date: ""
    };
    offer.offer_rounds = offerRounds;

    // Clear the offer notes
    offer.offer_note.note = "";

    this.setState({ offer });
  }

  /**
   * Submit offer to listing agent where they receive an email
   * with the offer details.
   */
  submitOffer() {
    if (this.handleSubmitValidation()) {
      // Send Ajax
      axios
        .post(`${process.env.REACT_APP_REALTYVIEW_API_ENDPOINT}/offer/submit`, {
          offer: this.state.offer
        }, {
          withCredentials: true
        })
        .then((response) => {
          if (response.status === 201) {
            this.setState({
              offer: response.data.data
            });

            // Notification of offer submitted successfully
            notificationStore.addNotification({
              title: "Success",
              message: `Your offer has been submitted to the listing agent.`,
              type: "success",
              insert: "top",
              container: "top-right",
              animationIn: ["animated", "fadeIn"],
              animationOut: ["animated", "fadeOut"],
              dismiss: {
                duration: 5000,
                onScreen: true
              }
            });
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }

  /**
   * Validates all fields needed for an official offer
   */
  handleSubmitValidation() {
    let errors = [];

    // Offer buyer info validation
    if (empty(this.state.offer.relationship_id)) {
      errors.push("You must add a primary buyer to the offer");
    } else {
      const relationship = this.state.relationships.find((relationship) => {
        return relationship.id == this.state.offer.relationship_id;
      });

      if (empty(relationship.relationship_primary_buyer.first_name)) {
        errors.push("You must add a first name for your primary buyer");
      }

      if (empty(relationship.relationship_primary_buyer.last_name)) {
        errors.push("You must add a last name for your primary buyer");
      }

      if (empty(relationship.relationship_primary_buyer.email)) {
        errors.push("You must add an email for your primary buyer");
      }

      if (empty(relationship.relationship_primary_buyer.address)) {
        errors.push("You must add an address for your primary buyer");
      }
    }

    // Offer round details validation
    const currentOfferRound = _.last(this.state.offer.offer_rounds);

    if (empty(currentOfferRound.offer_amount)) {
      errors.push("Offer amount is missing");
    }

    if (empty(currentOfferRound.down_payment_amount)) {
      errors.push("Down payment amount is missing");
    }

    if (empty(currentOfferRound.pre_approval_amount)) {
      errors.push("Pre approval amount is missing");
    }

    if (empty(currentOfferRound.seller_concession)) {
      errors.push("Seller concession is missing");
    }

    if (empty(currentOfferRound.loan_type)) {
      errors.push("Loan type is missing");
    }

    if (empty(currentOfferRound.proposed_closing_date)) {
      errors.push("Proposed closing date is missing");
    }

    // Listing broker details validation
    const listingBrokerDetails = this.state.offer.offer_listing_broker;

    if (empty(listingBrokerDetails.name)) {
      errors.push("Listing broker name is missing");
    }

    if (empty(listingBrokerDetails.email)) {
      errors.push("Listing broker email is missing");
    }

    if (empty(listingBrokerDetails.address)) {
      errors.push("Listing broker address is missing");
    }

    if (empty(listingBrokerDetails.mobile_phone)) {
      errors.push("Listing broker mobile phone is missing");
    }

    // Listing address validation
    if (empty(this.state.offer.listing_address)) {
      errors.push("Listing address is missing");
    }

    // Display errors
    if (!empty(errors)) {

    }

    return empty(errors);
  }

  getRelationships() {
    axios
      .get(`${process.env.REACT_APP_REALTYVIEW_API_ENDPOINT}/relationship/list`, {
        withCredentials: true
      })
      .then((response) => {
        if (response.status === 200) {
          this.setState({
            relationships: _.get(response, "data", [])
          });
        }
      })
      .catch((err) => {});
  }

  showRelationshipLinkModal() {
    this.setState({
      displayRelationshipsLinkModal: true
    });
  }

  hideRelationshipLinkModal() {
    this.setState({
      displayRelationshipsLinkModal: false
    });
  }

  /**
   * Attaches a relationship to the current offer
   * @param {string UUID} relationshipId
   */
  attachRelationshipToOffer(offerId, relationshipId) {
    axios
      .post(`${process.env.REACT_APP_REALTYVIEW_API_ENDPOINT}/offer/attach-relationship`, {
        offer_id: offerId,
        relationship_id: relationshipId
      }, {
        withCredentials: true
      })
      .then((response) => {
        if (response.status === 201) {
          // Update offer object from the React state
          let offer = this.state.offer;
          offer.relationship_id = relationshipId;

          this.setState({
            offer,
            displayRelationshipsLinkModal: false
          });
        }
      })
      .catch((err) => {});
  }

  sendComment() {
    if (empty(this.state.comment)) {
      return;
    }

    const { id } = this.props.match.params;

    axios
      .post(`${process.env.REACT_APP_REALTYVIEW_API_ENDPOINT}/offer/comment`, {
        offer_id: id,
        message: this.state.comment
      }, {
        withCredentials: true
      })
      .then((response) => {
        if (response.status === 201) {
          this.setState((prevState) => {
            return {
              comment: ""
            }
          });

          // Scroll chat messages to the bottom
          const $comments = document.querySelector('.offer-comments-panel .comments');
          $comments.scrollTop = $comments.scrollHeight;
        }
      })
      .catch((err) => {
        console.log(console.error());
      });
  }

  render() {
    const { Paragraph, Grid } = Placeholder;
    const offerRounds = _.get(this.state.offer, "offer_rounds", []);
    const offerStages = _.get(this.state.offer, "offer_stage_data", []);
    const latestOfferRound = _.last(offerRounds);
    const latestOfferStage = _.last(offerStages);
    const attachedOfferRelationship = this.state.relationships.find((relationship) => {
      return relationship.id == this.state.offer.relationship_id;
    });

    return (
      <div className="offer-view-page">
        <main>
          <Container>
            <div className="rs-sidebar-wrapper fixed">
              <RV_Sidebar />
            </div>

            <Container className={classNames({
              "page-context": true,
              "stretched": this.props.isSideMenuOpen === false
            })}>
              <TopNav user={this.props.user} />

              <div className="inline">
                <h2 className="page-context-title">OfferView</h2>
              </div>

              <div className="row">
                <div className="col-md-8">
                  <Panel className="buyer-information" bordered>
                    {!empty(this.state.relationships)
                          && !empty(this.state.offer) ?
                            !empty(_.get(this.state.offer, "relationship_id")) ?
                              (
                                <div className="row middle-xs">
                                  <div className="col-md-6">
                                    <div className="inline">
                                      <h3 className="buyer-name">
                                        {`${attachedOfferRelationship.relationship_primary_buyer.first_name} ${attachedOfferRelationship.relationship_primary_buyer.last_name}`}
                                      </h3>
                                      <Tag color="violet">PRIMARY</Tag>
                                    </div>

                                    <div className="inline">
                                      <PhoneIcon className="phone-icon-purple" />
                                      <p>{attachedOfferRelationship.relationship_primary_buyer.phone}</p>
                                    </div>

                                    <div className="inline mt-sm">
                                      <MailIcon className="mail-icon-purple" />
                                      <p>{attachedOfferRelationship.relationship_primary_buyer.email}</p>
                                    </div>
                                  </div>

                                  <div className="col-md-6">
                                    <div className="inline">
                                      <h3 className="buyer-name">
                                        {!empty(attachedOfferRelationship.relationship_secondary_buyer.first_name)
                                          && !empty(attachedOfferRelationship.relationship_secondary_buyer.last_name)
                                            ? `${attachedOfferRelationship.relationship_secondary_buyer.first_name} ${attachedOfferRelationship.relationship_secondary_buyer.last_name}`
                                              : 'N/A'}
                                      </h3>
                                      <Tag color="blue">Secondary</Tag>
                                    </div>

                                    <div className="inline">
                                      <PhoneIcon className="phone-icon-blue" />
                                      <p>{_.get(attachedOfferRelationship.relationship_secondary_buyer, "phone")}</p>
                                    </div>

                                    <div className="inline mt-sm">
                                      <MailIcon className="mail-icon-blue" />
                                      <p>{_.get(attachedOfferRelationship.relationship_secondary_buyer, "email")}</p>
                                    </div>
                                  </div>
                                </div>
                              ) : (
                                <div className="row middle-xs">
                                  <div className="col-md-6">
                                    <Button
                                      appearance="primary"
                                      onClick={this.showRelationshipLinkModal}
                                    >
                                      + Add Primary Buyer
                                    </Button>
                                  </div>
                                </div>
                              )
                          : (
                          <span></span>
                      )}
                  </Panel>

                  <Panel className="property-information mt-lg" bordered>
                    <div className="inline">
                      <HomeIcon className="home-icon-purple" />
                      <h3>Property</h3>
                    </div>

                    <div className="property-information__address-wrap">
                      <div className="inline">
                        <LocationIcon2 className="location-icon-red" />
                        <p className="full-address">{_.get(this.state.offer, "listing_address")}</p>
                      </div>
                      <a href="#" className="view-google-maps-link">View in Google Maps</a>

                      <div className="row mt-lg">
                        <div className="col-md-4">
                          <label>Asking Price:</label>
                          <p>-</p>
                        </div>
                        <div className="col-md-4">
                          <label>Property Type:</label>
                          <p>-</p>
                        </div>
                        <div className="col-md-4">
                          <label>Sale Type:</label>
                          <p>-</p>
                        </div>
                      </div>

                      <div className="row mt-lg">
                        <div className="col-md-4">
                          <label>DOM:</label>
                          <p>-</p>
                        </div>
                        <div className="col-md-4">
                          <label>Seller:</label>
                          <p>-</p>
                        </div>
                      </div>
                    </div>
                  </Panel>

                  <Panel className="listing-broker-details-panel mt-lg" bordered>
                    <div className="inline">
                      <UserIcon className="user-icon-green" />
                      <h3>Listing Broker</h3>
                    </div>

                    <div className="inline mt-md">
                      <div className="broker-name">
                        {!empty(this.state.offer) ? this.state.offer.offer_listing_broker.name : "-" }
                      </div>
                      <Tag color="green">+ Add to Contacts</Tag>
                    </div>

                    <div className="row mt-md">
                      <div className="col-md-12">
                        <label>Address:</label>
                        <p>{!empty(this.state.offer) ? this.state.offer.offer_listing_broker.address : "-"}</p>
                      </div>
                    </div>

                    <div className="row mt-md">
                      <div className="col-md-4">
                        <label>Mobile:</label>
                        <p>{!empty(this.state.offer) ? this.state.offer.offer_listing_broker.mobile_phone : "-"}</p>
                      </div>
                      <div className="col-md-4">
                        <label>Phone:</label>
                        <p>{!empty(this.state.offer) ? this.state.offer.offer_listing_broker.phone : "-"}</p>
                      </div>
                      <div className="col-md-4">
                        <label>Email Address:</label>
                        <p>{!empty(this.state.offer) ? this.state.offer.offer_listing_broker.email : "-"}</p>
                      </div>
                    </div>
                  </Panel>

                  <Panel className="submit-offer-details-panel mt-lg" bordered>
                    <div className="inline">
                      <SmartOfferIcon className="smart-offer-icon-blue" />
                      <h3>SUBMIT OFFER DETAILS</h3>
                    </div>

                    <div className="row mt-md">
                      <div className="col-md-6">
                        <label>Offer Amount</label>
                        {_.get(latestOfferStage, "stage_id") > 1 ? (
                          <p>{numeral( _.get(latestOfferRound, "offer_amount") ).format('0,0')}</p>
                        ) : (
                          <MaskedInput
                              className="rs-input"
                              mask={createNumberMask({
                                prefix: '$ '
                              })}
                              maxLength="12"
                              value={_.get(latestOfferRound, "offer_amount")}
                              onChange={(e) => {
                                latestOfferRound.offer_amount = e.target.value;
                                offerRounds[offerRounds.length - 1] = latestOfferRound;

                                this.setState(prevState => {
                                  return {
                                    offer: { ...prevState.offer, offer_rounds: offerRounds }
                                  }
                                });
                              }}
                          />
                        )}

                      </div>
                      <div className="col-md-6">
                        <label>Down Payment / Earnest Money</label>
                        {_.get(latestOfferStage, "stage_id") > 1 ? (
                          <p>{numeral( _.get(latestOfferRound, "down_payment_amount") ).format('0,0')}</p>
                        ) : (
                          <MaskedInput
                            className="rs-input"
                            mask={createNumberMask({
                              prefix: '$ '
                            })}
                            maxLength="12"
                            value={_.get(latestOfferRound, "down_payment_amount")}
                            onChange={(e) => {
                              latestOfferRound.down_payment_amount = e.target.value;
                              offerRounds[offerRounds.length - 1] = latestOfferRound;

                              this.setState(prevState => {
                                return {
                                  offer: { ...prevState.offer, offer_rounds: offerRounds }
                                }
                              });
                            }}
                          />
                        )}

                      </div>
                    </div>

                    <div className="row mt-md">
                      <div className="col-md-6">
                        <label>Pre-Approval Amount</label>
                        {_.get(latestOfferStage, "stage_id") > 1 ? (
                          <p>{numeral( _.get(latestOfferRound, "pre_approval_amount") ).format('0,0')}</p>
                        ) : (
                          <MaskedInput
                            className="rs-input"
                            mask={createNumberMask({
                              prefix: '$ '
                            })}
                            maxLength="12"
                            value={_.get(latestOfferRound, "pre_approval_amount")}
                            onChange={(e) => {
                              latestOfferRound.pre_approval_amount = e.target.value;
                              offerRounds[offerRounds.length - 1] = latestOfferRound;

                              this.setState(prevState => {
                                return {
                                  offer: { ...prevState.offer, offer_rounds: offerRounds }
                                }
                              });
                            }}
                          />
                        )}
                      </div>
                      <div className="col-md-6">
                        <label>Seller Concession</label>
                        {_.get(latestOfferStage, "stage_id") > 1 ? (
                          <p>{numeral( _.get(latestOfferRound, "seller_concession") ).format('0,0')}</p>
                        ) : (
                          <MaskedInput
                            className="rs-input"
                            mask={createNumberMask({
                              prefix: '$ '
                            })}
                            maxLength="12"
                            value={_.get(latestOfferRound, "seller_concession")}
                            onChange={(e) => {
                              latestOfferRound.seller_concession = e.target.value;
                              offerRounds[offerRounds.length - 1] = latestOfferRound;

                              this.setState(prevState => {
                                return {
                                  offer: { ...prevState.offer, offer_rounds: offerRounds }
                                }
                              });
                            }}
                          />
                        )}
                      </div>
                    </div>

                    <div className="row mt-md">
                      <div className="col-md-6">
                        <label>Loan Type</label>
                        {_.get(latestOfferStage, "stage_id") > 1 ? (
                          <p>{_.get(latestOfferRound, "loan_type", "-")}</p>
                        ) : (
                          <SelectPicker
                            data={[
                              {
                                "label": "Conventional",
                                "value": "coventional"
                              },
                              {
                                "label": "FHA",
                                "value": "fha"
                              }
                            ]}
                            searchable={false}
                            block
                            value={_.get(latestOfferRound, "loan_type")}
                            onChange={(value) => {
                              latestOfferRound.loan_type = value;
                              offerRounds[offerRounds.length - 1] = latestOfferRound;

                              this.setState(prevState => {
                                return {
                                  offer: { ...prevState.offer, offer_rounds: offerRounds }
                                }
                              });
                            }}
                          />
                        )}
                      </div>
                      <div className="col-md-6">
                        <label>Proposed Closing Date</label>
                        {_.get(latestOfferStage, "stage_id") > 1 ? (
                          <p>{_.get(latestOfferRound, "proposed_closing_date", "-")}</p>
                        ) : (
                          <DatePicker
                            block
                            format="YYYY-MM-DD"
                            value={_.get(latestOfferRound, "proposed_closing_date")}
                            onChange={(value) => {
                              latestOfferRound.proposed_closing_date = value;
                              offerRounds[offerRounds.length - 1] = latestOfferRound;

                              this.setState(prevState => {
                                return {
                                  offer: { ...prevState.offer, offer_rounds: offerRounds }
                                }
                              });
                            }}
                          />
                        )}
                      </div>
                    </div>

                    <div className="row mt-md">
                      <div className="col-md-12">
                        <label>Notes</label>
                        {_.get(latestOfferStage, "stage_id") > 1 ? (
                          <p>{_.get(this.state.offer.offer_note, "note", "-")}</p>
                        ) : (
                          <Input
                            componentClass="textarea"
                            rows={3}
                            style={{ resize: 'auto' }}
                            value={_.get(this.state.offer.offer_note, "note")}
                            onChange={(value) => {
                              let offerNote = this.state.offer.offer_note;
                              offerNote.note = value;

                              this.setState(prevState => {
                                return {
                                  offer: { ...prevState.offer, offer_note: offerNote }
                                }
                              });
                            }}
                          />
                        )}
                      </div>
                    </div>

                    <div className="row mt-md">
                      <div className="col-md-12">
                        {_.get(latestOfferStage, "stage_id") > 1 ? (
                          <span>
                            <Button
                              palette="outline"
                            >
                              Edit Offer
                            </Button>

                            <RVButton
                              palette="danger"
                            >
                              Cancel Offer
                            </RVButton>
                          </span>
                        ) : (
                          <span>
                            <Button
                              appearance="ghost"
                              onClick={this.clearOfferDetails}
                            >
                              Clear All
                            </Button>
                            <Button
                              color="green"
                              onClick={this.submitOffer}
                            >
                              Save &amp; continue
                            </Button>
                          </span>
                        )}

                      </div>
                    </div>
                  </Panel>

                  <Panel className="offer-attachments-panel mt-lg" bordered>
                    <div className="inline-group">
                      <div className="inline">
                        <AttachmentsIcon className="attachments-icon-red" />
                        <h3>ATTACHMENTS</h3>
                        <div className="vertical-seperator">|</div>
                        <p className="address">{_.get(this.state.offer, "listing_address")}</p>
                      </div>

                      <Tag className="add-document-btn" color="green">+ Add a Document</Tag>
                    </div>

                    <ul className="attachments-list">
                      {_.get(this.state.offer, "offer_documents") && _.map(this.state.offer.offer_documents, (document) => {
                        return (
                          <li>
                            <label>Sale Deed</label>
                            <div className="document-meta">
                              <p className="document-meta__name">File_031272.pdf</p>
                              <p>2.30 MB | Uploaded on 10/25/2020 3:02 PM</p>
                            </div>

                            <Whisper
                              trigger="click"
                              placement="autoVerticalStart"
                              speaker={
                                <Popover full>
                                  <Dropdown.Menu>
                                    <Dropdown.Item>Delete</Dropdown.Item>
                                  </Dropdown.Menu>
                                </Popover>
                              }
                            >
                              <IconButton appearance="subtle" icon={<Icon icon="more" />} />
                            </Whisper>
                          </li>
                        )
                      })}
                    </ul>
                  </Panel>
                </div>
                <div className="col-md-4">
                  {/* <Panel className="buyer-narrative" bordered>
                    <label>Buyer Agency</label>

                    <div className="inline mt-md">
                      <label>Confidence Score:</label>
                      <p className="confidence-score">98</p>
                      <Tag color="green">High</Tag>
                    </div>

                    <div className="inline mt-md">
                      <label>Pre-Approval:</label>
                      <Icon icon="check" />
                      <p>Verified</p>
                    </div>
                  </Panel> */}

                  <Panel className="offer-timeline-panel" bordered>
                    <div className="inline">
                      <LocationIcon className="location-icon-yellow" />
                      <h3>Offer Id:</h3>
                      <p className="offer-id">{_.get(this.state.offer, "id")}</p>
                    </div>

                    <Timeline align="left">
                      <Timeline.Item
                        className={classNames({
                          active: _.get(latestOfferStage, "stage_id") == 1
                        })}
                      >
                        <p>Offer Created</p>
                        <p>{
                          !empty(offerStages) ? (
                            _.findIndex(offerStages, (offerStage) => { return offerStage.stage_id == 1 }) !== -1
                            &&
                            moment(_.find(offerStages, (offerStage) => {
                              return offerStage.stage_id == 1;
                            }).dtc).format("MMMM DD, YYYY hh:mm A")
                          )
                          :
                          ""
                        }</p>
                      </Timeline.Item>
                      <Timeline.Item
                        className={classNames({
                          active: _.get(latestOfferStage, "stage_id") == 2
                        })}
                      >
                        <p>Offer in Process</p>
                        <p>{
                          !empty(offerStages) ? (
                            _.findIndex(offerStages, (offerStage) => { return offerStage.stage_id == 2 }) !== -1
                            &&
                            moment(_.find(offerStages, (offerStage) => {
                              return offerStage.stage_id == 2;
                            }).dtc).format("MMMM DD, YYYY hh:mm A")
                          )
                          :
                          ""
                        }</p>
                      </Timeline.Item>
                      <Timeline.Item
                        className={classNames({
                          active: _.get(latestOfferStage, "stage_id") == 3
                        })}
                      >
                        <p>Offer Complete</p>
                        <p>{
                          !empty(offerStages) ? (
                            _.findIndex(offerStages, (offerStage) => { return offerStage.stage_id == 3 }) !== -1
                            &&
                            moment(_.find(offerStages, (offerStage) => {
                              return offerStage.stage_id == 3;
                            }).dtc).format("MMMM DD, YYYY hh:mm A")
                          )
                          :
                          ""
                        }</p>
                      </Timeline.Item>
                      <Timeline.Item
                        className={classNames({
                          active: _.get(latestOfferStage, "stage_id") == 4
                        })}
                      >
                        <p>Offer Sent</p>
                        <p>Estimated delivery within 3 days</p>
                      </Timeline.Item>
                      <Timeline.Item
                        className={classNames({
                          active: _.get(latestOfferStage, "stage_id") == 5
                        })}
                      >
                        <p>Offer Acknowledged</p>
                        <p>{
                          !empty(offerStages) ? (
                            _.findIndex(offerStages, (offerStage) => { return offerStage.stage_id == 5 }) !== -1
                            &&
                            moment(_.find(offerStages, (offerStage) => {
                              return offerStage.stage_id == 5;
                            }).dtc).format("MMMM DD, YYYY hh:mm A")
                          )
                          :
                          ""
                        }</p>
                      </Timeline.Item>
                      <Timeline.Item
                        className={classNames({
                          active: _.get(latestOfferStage, "stage_id") == 7
                        })}
                      >
                        <p>Offer Accepted</p>
                        <p>{
                          !empty(offerStages) ? (
                            _.findIndex(offerStages, (offerStage) => { return offerStage.stage_id == 7 }) !== -1
                            &&
                            moment(_.find(offerStages, (offerStage) => {
                              return offerStage.stage_id == 7;
                            }).dtc).format("MMMM DD, YYYY hh:mm A")
                          )
                          :
                          ""
                        }</p>
                      </Timeline.Item>
                    </Timeline>
                  </Panel>

                  <Panel className="offer-comments-panel mt-lg" bordered>
                    <div className="inline-group">
                      <div className="inline">
                        <CommentsIcon className="comments-icon-purple" />
                        <h3>Comments</h3>
                      </div>

                      {!empty(_.get(this.state.offer, "offer_comments"))
                        && <a href="#">View All</a>
                      }
                    </div>

                    <div className="comments">
                      {_.map(_.get(this.state, "comments"), (offer) => {
                        return (
                          <span>
                          {/* <p className="comment__day">TUE</p> */}

                          <div
                            className={classNames({
                              "comment__message-group": true,
                              "outbound": offer.sender_id == this.props.user.id ? true : false,
                              "inbound": offer.sender_id == this.props.user.id ? false : true
                            })}
                          >
                            <Avatar
                              className="user-img"
                              style={{ background: '#38afd1', color: '#ffffff' }}
                              circle
                            >
                              {offer.sender.first_name.charAt(0) + " " + offer.sender.last_name.charAt(0)}
                            </Avatar>

                            <div className="comment__message-details">
                              <p className="sender"><small>{offer.sender_id == this.props.user.id ? "Me" : `${offer.sender.first_name} ${offer.sender.last_name}`}</small></p>
                              <p className="msg">
                                {offer.msg}
                              </p>
                            </div>
                          </div>
                        </span>
                        )
                      })}
                    </div>

                    <div className="comments-footer">
                      <input
                        type="text"
                        maxLength="280"
                        value={this.state.comment}
                        onChange={(e) => {
                          this.setState({
                            comment: e.target.value
                          });
                        }}
                        onKeyDown={(e) => {
                          if (
                            e.key === 'Enter'
                            && this.state.comment.length > 0
                          ) {
                            this.sendComment();
                          }
                        }}
                      />

                      <Button
                        color="green"
                        onClick={this.sendComment}
                      >
                        <Icon icon="angle-right" />
                      </Button>
                    </div>
                  </Panel>
                </div>
              </div>
            </Container>
          </Container>
        </main>

        <Modal className="relationship-link-modal" show={this.state.displayRelationshipsLinkModal} onHide={this.hideRelationshipLinkModal}>
          <Modal.Header>
            <Modal.Title>Link Relationship</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <List className="agent-relationships-list">
              {this.state.relationships.map((relationship, index) => {
                return (
                  <List.Item index={index}>
                    <div className="primary-buyer-details">
                      <p className="primary-buyer__name">
                        {`${relationship.relationship_primary_buyer.first_name} ${relationship.relationship_primary_buyer.last_name}`}
                      </p>

                      <p className="primary-buyer__address">{relationship.relationship_primary_buyer.address}</p>
                    </div>

                    <Button
                      onClick={() => {
                        this.attachRelationshipToOffer(this.state.offer.id, relationship.id);
                      }}
                    >
                      Select
                    </Button>
                  </List.Item>
                );
              })}
            </List>
          </Modal.Body>
          {/* <Modal.Footer>
            <Button onClick={this.close} appearance="primary">
              Ok
            </Button>
            <Button onClick={this.close} appearance="subtle">
              Cancel
            </Button>
          </Modal.Footer> */}
        </Modal>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    user: state.user,
    isSideMenuOpen: state.common.isSideMenuOpen
  };
}

export default connect(mapStateToProps, null)(OfferViewPage);
